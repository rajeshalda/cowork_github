require('dotenv').config();
const axios = require('axios');
const { execSync } = require('child_process');

const A2A_BASE_URL = 'https://MPN-MTT-APP-5.services.ai.azure.com/api/projects/MPN-MTT-APP-5/agents/github-agent/endpoint/protocols/a2a';
const A2A_VERSION  = '1.0';

function getToken() {
    return execSync('az account get-access-token --resource https://ai.azure.com --query accessToken -o tsv').toString().trim();
}

function makeHeaders(token) {
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'A2A-Version': A2A_VERSION };
}

// Send approval for all pending MCP tool approvals in a task
async function sendApproval(taskId, contextId, approvalRequestId, token) {
    console.log(`\n[Approval] Approving MCP tool request: ${approvalRequestId}`);
    const res = await axios.post(A2A_BASE_URL, {
        jsonrpc: '2.0',
        id:      `approve-${Date.now()}`,
        method:  'SendMessage',
        params:  {
            message: {
                kind:      'message',
                role:      1,
                parts:     [],
                messageId: `msg-approve-${Date.now()}`,
                taskId,
                contextId,
                extensions: {
                    mcp_approval_response: {
                        approval_request_id: approvalRequestId,
                        approve:             true
                    }
                }
            }
        }
    }, { headers: makeHeaders(token), timeout: 30000 });

    console.log('[Approval] Response:', JSON.stringify(res.data, null, 2));
    return res.data?.result?.task;
}

// Poll task, auto-approve any MCP tool requests
async function pollUntilDone(taskId, contextId, token) {
    const maxAttempts = 60;

    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 5000));

        const res = await axios.post(A2A_BASE_URL, {
            jsonrpc: '2.0', id: `poll-${i}`, method: 'GetTask', params: { id: taskId }
        }, { headers: makeHeaders(token), timeout: 30000 });

        const task  = res.data?.result?.task || res.data?.result;
        const state = task?.status?.state;
        console.log(`Poll ${i + 1}: state = ${state}`);

        if (state === 'TASK_STATE_INPUT_REQUIRED') {
            // Auto-approve all pending MCP tool requests
            const approvals = task?.artifacts?.filter(a =>
                a.parts?.some(p => p.text?.includes('APPROVAL REQUIRED'))
            ) || [];

            for (const artifact of approvals) {
                const match = artifact.artifactId;
                if (match) await sendApproval(taskId, contextId, match, token);
            }
            continue;
        }

        if (state === 'completed' || state === 'TASK_STATE_COMPLETED' ||
            state === 'failed'    || state === 'TASK_STATE_FAILED'    ||
            state === 'canceled'  || state === 'TASK_STATE_CANCELLED') {
            return task;
        }
    }
    throw new Error('Timed out after 5 minutes');
}

async function main() {
    console.log('Step 1 — Getting token via Azure CLI...');
    const token = getToken();
    console.log('Token acquired ✅');

    console.log('\nStep 2 — Sending task to github-agent...');
    const msgRes = await axios.post(A2A_BASE_URL, {
        jsonrpc: '2.0', id: 'test-1', method: 'SendMessage',
        params: {
            message: {
                kind:      'message',
                role:      1,
                parts:     [{ kind: 'text', text: 'List all GitHub repositories under the rajeshaldanathcorp account.' }],
                messageId: `msg-${Date.now()}`
            }
        }
    }, { headers: makeHeaders(token), timeout: 60000 });

    console.log('Send response:', JSON.stringify(msgRes.data, null, 2));

    const task      = msgRes.data?.result?.task;
    const taskId    = task?.id;
    const contextId = task?.contextId;

    if (!taskId) {
        console.error('No task ID — check error above');
        process.exit(1);
    }

    // Handle initial input_required state
    if (task?.status?.state === 'TASK_STATE_INPUT_REQUIRED') {
        const approvals = task?.artifacts?.filter(a =>
            a.parts?.some(p => p.text?.includes('APPROVAL REQUIRED'))
        ) || [];
        for (const artifact of approvals) {
            if (artifact.artifactId) await sendApproval(taskId, contextId, artifact.artifactId, token);
        }
    }

    console.log(`\nPolling task ${taskId}...`);
    const completed = await pollUntilDone(taskId, contextId, token);
    console.log('\n✅ Completed task:', JSON.stringify(completed, null, 2));
}

main().catch(err => {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
});
