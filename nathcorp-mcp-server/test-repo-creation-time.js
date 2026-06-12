require('dotenv').config();
const axios = require('axios');

const A2A_BASE_URL = 'https://MPN-MTT-APP-5.services.ai.azure.com/api/projects/MPN-MTT-APP-5/agents/github-agent/endpoint/protocols/a2a';
const A2A_VERSION  = '1.0';
const TEST_REPO    = `timing-test-${Date.now()}-9`;

async function getToken() {
    const { execSync } = require('child_process');
    return execSync('az account get-access-token --resource https://ai.azure.com --query accessToken -o tsv').toString().trim();
}

async function run() {
    console.log('=== Repo Creation Timing Test ===');
    console.log(`Test repo name: ${TEST_REPO}`);
    console.log('');

    // ── Step 1: Get token ──────────────────────────────────────────────────────
    console.log('[1] Getting Azure token...');
    const t0 = Date.now();
    const token = await getToken();
    console.log(`    Token obtained in ${Date.now() - t0}ms`);
    console.log('');

    // ── Step 2: SendMessage ────────────────────────────────────────────────────
    console.log('[2] Sending A2A SendMessage (create_repository)...');
    const tSend = Date.now();

    const sendRes = await axios.post(A2A_BASE_URL, {
        jsonrpc: '2.0',
        id:      `req-${Date.now()}`,
        method:  'SendMessage',
        params:  {
            message: {
                kind:      'message',
                role:      1,
                parts:     [{ kind: 'text', text: `create a new private GitHub repo called ${TEST_REPO}` }],
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

    const taskId = sendRes.data?.result?.task?.id;
    console.log(`    SendMessage completed in ${Date.now() - tSend}ms`);
    console.log(`    Task ID: ${taskId}`);
    console.log(`    Initial state: ${sendRes.data?.result?.task?.status?.state}`);
    console.log(`    RAW RESPONSE: ${JSON.stringify(sendRes.data, null, 2)}`);
    console.log('');

    // ── Step 3: Poll until complete ────────────────────────────────────────────
    console.log('[3] Polling for completion (every 1000ms)...');
    const tPoll = Date.now();
    let attempt = 0;
    let finalState = '';
    let finalResponse = '';

    while (attempt < 600) {
        attempt++;
        await new Promise(r => setTimeout(r, 500));

        const pollRes = await axios.post(A2A_BASE_URL, {
            jsonrpc: '2.0',
            id:      `poll-${attempt}`,
            method:  'GetTask',
            params:  { id: taskId }
        }, {
            headers: {
                Authorization:  `Bearer ${token}`,
                'Content-Type': 'application/json',
                'A2A-Version':  A2A_VERSION
            },
            timeout: 10000
        });

        const state = pollRes.data?.result?.task?.status?.state;
        const elapsed = Date.now() - tPoll;
        console.log(`    Poll #${attempt} — ${state} — ${elapsed}ms elapsed`);

        if (state === 'TASK_STATE_COMPLETED' || state === 'TASK_STATE_FAILED') {
            finalState = state;
            finalResponse = pollRes.data?.result?.task?.artifacts?.[0]?.parts?.[0]?.text
                         || pollRes.data?.result?.task?.status?.message?.parts?.[0]?.text
                         || 'No response text';
            break;
        }
    }

    // ── Step 4: Summary ────────────────────────────────────────────────────────
    const totalTime = Date.now() - t0;
    console.log('');
    console.log('=== TIMING SUMMARY ===');
    console.log(`Token:          ${Date.now() - t0}ms (approx)`);
    console.log(`Total end-to-end time: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)`);
    console.log(`Poll attempts:  ${attempt}`);
    console.log(`Final state:    ${finalState}`);
    console.log(`Response:       ${finalResponse}`);
    console.log('');
    console.log(`NOTE: Cowork MCP timeout is 60000ms (60s)`);
    if (totalTime > 60000) {
        console.log(`>>> RESULT: ${(totalTime/1000).toFixed(1)}s EXCEEDS 60s timeout — this is why it fails through Cowork`);
    } else {
        console.log(`>>> RESULT: ${(totalTime/1000).toFixed(1)}s is within 60s timeout — timeout is NOT the issue`);
    }
}

run().catch(err => {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
});
