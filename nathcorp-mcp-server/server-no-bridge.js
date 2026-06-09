require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'NathCorp MCP Server', version: 'no-bridge-test' });
});

app.post('/', async (req, res) => {
    const { jsonrpc, method, params, id } = req.body;

    if (jsonrpc !== '2.0') {
        return res.status(400).json({ jsonrpc: '2.0', id: id ?? null, error: { code: -32600, message: 'Invalid Request' } });
    }

    if (method === 'initialize') {
        return res.json({
            jsonrpc: '2.0', id,
            result: {
                protocolVersion: '2024-11-05',
                capabilities:    { tools: {} },
                serverInfo:      { name: 'NathCorp MCP Server', version: 'no-bridge-test' }
            }
        });
    }

    if (method === 'tools/list') {
        // No tools — Cowork gets empty list
        return res.json({ jsonrpc: '2.0', id, result: { tools: [] } });
    }

    return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NathCorp MCP Server (no-bridge test) running on port ${PORT}`);
});
