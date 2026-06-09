require('dotenv').config();
const express = require('express');
const axios   = require('axios');

const IS_PROD      = process.env.NODE_ENV === 'production';
const A2A_BASE_URL = 'https://MPN-MTT-APP-5.services.ai.azure.com/api/projects/MPN-MTT-APP-5/agents/github-agent/endpoint/protocols/a2a';
const A2A_VERSION  = '1.0';

function safeError(err) {
    if (IS_PROD) return 'An internal error occurred. Please try again.';
    return err.response?.data || err.message;
}

// ─── Get token via Managed Identity (Azure App Service) or CLI (local) ────────
async function getToken() {
    const identityEndpoint = process.env.IDENTITY_ENDPOINT;
    const identityHeader   = process.env.IDENTITY_HEADER;

    if (identityEndpoint && identityHeader) {
        const res = await axios.get(
            `${identityEndpoint}?api-version=2019-08-01&resource=https://ai.azure.com`,
            { headers: { 'X-IDENTITY-HEADER': identityHeader }, timeout: 10000 }
        );
        return res.data.access_token;
    }

    // Local development — Azure CLI
    const { execSync } = require('child_process');
    return execSync('az account get-access-token --resource https://ai.azure.com --query accessToken -o tsv').toString().trim();
}

// ─── Poll A2A task until complete ─────────────────────────────────────────────
async function pollTask(taskId, token) {
    const maxAttempts = 60;  // 5 min max (60 × 5s)
    const delayMs     = 5000;

    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, delayMs));

        const res = await axios.post(A2A_BASE_URL, {
            jsonrpc: '2.0',
            id:      `poll-${i}`,
            method:  'GetTask',
            params:  { id: taskId }
        }, {
            headers: {
                Authorization:  `Bearer ${token}`,
                'Content-Type': 'application/json',
                'A2A-Version':  A2A_VERSION
            },
            timeout: 30000
        });

        const task  = res.data?.result?.task || res.data?.result;
        const state = task?.status?.state;

        console.log(`[A2A] Poll ${i + 1}: state = ${state}`);

        if (state === 'TASK_STATE_COMPLETED' || state === 'completed' ||
            state === 'TASK_STATE_FAILED'    || state === 'failed'    ||
            state === 'TASK_STATE_CANCELLED' || state === 'canceled') {
            return task;
        }
    }
    throw new Error('A2A task timed out after 5 minutes');
}

// ─── Extract text from all known A2A response shapes ─────────────────────────
function extractText(task) {
    // Primary: artifacts[].parts[].text
    const fromArtifacts = task?.artifacts
        ?.flatMap(a => a.parts || [])
        ?.filter(p => p.kind === 'text' || p.text)
        ?.map(p => p.text || '')
        ?.join('\n')
        ?.trim();

    if (fromArtifacts) return fromArtifacts;

    // Fallback: outputs[].parts[].text
    const fromOutputs = task?.outputs
        ?.flatMap(o => o.parts || [])
        ?.map(p => p.text || '')
        ?.join('\n')
        ?.trim();

    if (fromOutputs) return fromOutputs;

    // Fallback: status.message.parts[].text
    const fromStatus = task?.status?.message?.parts
        ?.filter(p => p.kind === 'text' || p.text)
        ?.map(p => p.text || '')
        ?.join('\n')
        ?.trim();

    return fromStatus || JSON.stringify(task);
}

// ─── Bridge tool — delegate task to Foundry GitHub Agent via A2A ─────────────
async function delegate_to_github_agent({ task }) {
    if (!task?.trim()) throw new Error('task parameter is required');

    const token = await getToken();

    const sendRes = await axios.post(A2A_BASE_URL, {
        jsonrpc: '2.0',
        id:      `req-${Date.now()}`,
        method:  'SendMessage',
        params:  {
            message: {
                kind:      'message',
                role:      1,
                parts:     [{ kind: 'text', text: task.trim() }],
                messageId: `msg-${Date.now()}`
            }
        }
    }, {
        headers: {
            Authorization:  `Bearer ${token}`,
            'Content-Type': 'application/json',
            'A2A-Version':  A2A_VERSION
        },
        timeout: 30000
    });

    console.log('[A2A] Send response:', JSON.stringify(sendRes.data, null, 2));

    if (sendRes.data?.error) {
        throw new Error(`A2A error: ${sendRes.data.error.message}`);
    }

    // v1.0 response: result.task
    const initialTask = sendRes.data?.result?.task || sendRes.data?.result;
    const taskId      = initialTask?.id;
    if (!taskId) {
        throw new Error(`No task ID in A2A response: ${JSON.stringify(sendRes.data)}`);
    }

    // If already completed (fast tasks), return immediately
    const initialState = initialTask?.status?.state;
    let completedTask = initialTask;
    if (initialState !== 'TASK_STATE_COMPLETED' && initialState !== 'completed') {
        completedTask = await pollTask(taskId, token);
    }

    console.log('[A2A] Completed task:', JSON.stringify(completedTask, null, 2));

    const state = completedTask?.status?.state || 'unknown';

    if (state === 'TASK_STATE_FAILED' || state === 'failed') {
        const errText = extractText(completedTask);
        throw new Error(`GitHub agent task failed: ${errText}`);
    }

    return {
        status:   state,
        response: extractText(completedTask)
    };
}

// ─── MCP tool registry ────────────────────────────────────────────────────────
const TOOLS = [
    {
        name:        'delegate_to_github_agent',
        description: 'Delegate a code or GitHub task to the NathCorp Azure AI Foundry GitHub Agent. The agent will autonomously read the repository, fix bugs, create branches, commit code, and raise pull requests.',
        annotations: { readOnlyHint: false, title: 'Delegate to GitHub Agent' },
        inputSchema: {
            type:       'object',
            properties: {
                task: {
                    type:        'string',
                    description: 'Full task description. Always include: full repo path as rajeshaldanathcorp/<repo>, file path, bug description, branch name to create, default branch is master. Example: "In GitHub repo rajeshaldanathcorp/beta-test, fix the bug in src/lib/utils.ts line 81 — formatUserName returns lastName+firstName without a space. Default branch is master. Create branch fix/format-user-name-space from master, fix to return lastName + \' \' + firstName, commit, and raise a PR against master."'
                }
            },
            required: ['task']
        }
    }
];

const TOOL_MAP = { delegate_to_github_agent };

// ─── Express app ──────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'NathCorp MCP Server', version: '4.5.0' });
});

app.post('/', async (req, res) => {
    const { jsonrpc, method, params, id } = req.body;

    if (jsonrpc !== '2.0') {
        return res.status(400).json({ jsonrpc: '2.0', id: id ?? null, error: { code: -32600, message: 'Invalid Request' } });
    }

    try {
        if (method === 'initialize') {
            return res.json({
                jsonrpc: '2.0',
                id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities:    { tools: {} },
                    serverInfo:      { name: 'NathCorp MCP Server', version: '4.5.0' }
                }
            });
        }

        if (method === 'tools/list') {
            return res.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
        }

        if (method === 'tools/call') {
            const toolName = params?.name;
            const args     = params?.arguments || {};
            const fn       = TOOL_MAP[toolName];

            if (!fn) {
                return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Tool not found: ${toolName}` } });
            }

            const result = await fn(args);
            return res.json({
                jsonrpc: '2.0',
                id,
                result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
            });
        }

        return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });

    } catch (err) {
        console.error(`[MCP] Error [${method}]:`, err.message);
        return res.json({ jsonrpc: '2.0', id, error: { code: -32603, message: safeError(err) } });
    }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
    console.error('[MCP] Unhandled error:', err);
    res.status(500).json({ error: IS_PROD ? 'Internal server error' : err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NathCorp MCP Server v4.5.0 running on port ${PORT}`);
    console.log(`Environment: ${IS_PROD ? 'production' : 'development'}`);
    console.log(`A2A endpoint: ${A2A_BASE_URL}`);
    console.log(`A2A version: ${A2A_VERSION}`);
});
