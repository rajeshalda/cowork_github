# NathCorp ServiceNow + Cowork Integration — Technical Deep Dive
**Prepared by:** Rajesh (rajesh.alda@nathcorp.com)
**Date:** 2026-05-24
**Audience:** Technical team, developers, architects

---

## Table of Contents

1. [Overall Architecture](#1-overall-architecture)
2. [Component 1 — Microsoft Cowork](#2-component-1--microsoft-cowork)
3. [Component 2 — Cowork Plugin Package](#3-component-2--cowork-plugin-package)
4. [Component 3 — manifest.json](#4-component-3--manifestjson)
5. [Component 4 — SKILL.md](#5-component-4--skillmd)
6. [Component 5 — MCP Server (server.js)](#6-component-5--mcp-server-serverjs)
7. [Component 6 — ServiceNow](#7-component-6--servicenow)
8. [Communication Protocol — JSON-RPC 2.0](#8-communication-protocol--json-rpc-20)
9. [Authentication Flow — OAuth 2.0](#9-authentication-flow--oauth-20)
10. [Full End-to-End Data Flow](#10-full-end-to-end-data-flow)
11. [Security Implementation](#11-security-implementation)
12. [Azure Hosting](#12-azure-hosting)
13. [Key Problems Solved](#13-key-problems-solved)

---

## 1. Overall Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — USER INTERFACE                                                    │
│                                                                              │
│  Microsoft Cowork  (https://m365.cloud.microsoft)                            │
│  AI Engine: Anthropic Claude                                                 │
│  Access: M365 Copilot license + Frontier preview                            │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             │  Plugin loaded at conversation start
                             │  (NathCorpServiceNowPlugin.zip — deployed via admin.cloud.microsoft)
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2 — PLUGIN (defines skill + connector)                                │
│                                                                              │
│  manifest.json  ←  tells Cowork: "use this MCP server URL"                  │
│  SKILL.md       ←  tells Cowork AI: "follow this exact workflow"            │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             │  JSON-RPC 2.0 over HTTPS
                             │  POST https://nathcorp-mcp-server.azurewebsites.net
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3 — MCP SERVER (Node.js on Azure App Service)                        │
│                                                                              │
│  server.js                                                                   │
│  ├── getToken()             ← OAuth 2.0 client credentials grant            │
│  ├── search_kb_articles()   ← GET /api/now/table/kb_knowledge               │
│  ├── create_incident()      ← POST /api/now/table/incident                  │
│  ├── stripHtml()            ← cleans KB article HTML before sending         │
│  └── safeError()            ← hides internal errors in production           │
│                                                                              │
│  Dependencies: express, axios, dotenv                                        │
│  Runtime: Node.js 22 LTS                                                    │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             │  OAuth 2.0 Bearer Token
                             │  REST API (Table API)
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  LAYER 4 — SERVICENOW (https://dev249650.service-now.com)                   │
│                                                                              │
│  kb_knowledge table   ← 42 KB articles (IT KB: 35, KCS: 4, Known Error: 3) │
│  incident table       ← creates INC tickets                                 │
│  oauth_token.do       ← issues Bearer tokens                                │
│                                                                              │
│  Service account: cowork_plugin_svc (Machine identity)                      │
│  Roles: knowledge + itil                                                     │
│  OAuth app: CoworkPlugin (client credentials grant, 12h token)              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component 1 — Microsoft Cowork

### What it is
Microsoft Cowork is an **agentic AI product** inside Microsoft 365. It is NOT Copilot Studio (which builds chatbots). Cowork is an AI that can take autonomous actions across M365 — emails, files, calendar, and via plugins, external systems like ServiceNow.

### AI Engine
Powered by **Anthropic Claude** — not Azure OpenAI. This is important because SKILL.md follows the Agent Skills open standard which Claude understands natively.

### How Cowork uses our plugin
When a user starts a conversation, Cowork:
1. Loads all active plugins for that user
2. Reads `manifest.json` → discovers MCP server URL
3. Sends `tools/list` to MCP server → discovers what tools are available
4. Reads `SKILL.md` → understands when and how to use those tools
5. When user types an IT issue → SKILL.md triggers → Cowork calls tools via MCP

### Key Concept — Why SKILL.md + MCP together
- **SKILL.md alone** = Cowork AI knows what to do but has no external API access
- **MCP alone** = tools are available but Cowork doesn't know when to use them
- **SKILL.md + MCP together** = Cowork knows exactly when to trigger, what query to send, and what to do with the result ✅

---

## 3. Component 2 — Cowork Plugin Package

### File: `NathCorpServiceNowPlugin.zip`
**Size:** 2793 bytes
**Location:** `C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\NathCorpServiceNowPlugin.zip`

### Contents inside the .zip
```
NathCorpServiceNowPlugin.zip
├── manifest.json                              ← plugin identity + MCP connector URL
├── color.png                                  ← 192x192 full-colour icon
├── outline.png                                ← 32x32 monochrome outline icon
└── skills/
    └── servicenow-kb-search/
        └── SKILL.md                           ← AI workflow instructions
```

### How it was packaged
```powershell
# From inside NathCorpCoworkPlugin\ folder
Compress-Archive -Path manifest.json, color.png, outline.png, skills `
  -DestinationPath ..\NathCorpServiceNowPlugin.zip
```

### How it was deployed
1. Uploaded via **https://admin.cloud.microsoft → Agents → All agents → ... → Add agent**
2. Managed + deployed via **https://admin.microsoft.com → Settings → Integrated apps**
3. Deployed to specific users: `Rajesh.Alda@nathcorp.com`, `richa.kumari@nathcorp.com`

### Version history
| Version | Change | Status |
|---------|--------|--------|
| 1.0.0 | Initial — SKILL.md only, no MCP connector | Replaced |
| 2.0.0 | Added `agentConnectors` with Azure MCP URL + SKILL.md v2.0 | **Active ✅** |

---

## 4. Component 3 — manifest.json

**File:** `NathCorpCoworkPlugin/manifest.json`
**Schema:** Microsoft Teams devPreview manifest schema

### Full file
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/vDevPreview/MicrosoftTeams.schema.json",
  "manifestVersion": "devPreview",
  "version": "2.0.0",
  "id": "49402c59-c65f-444c-99e1-ee02174e1067",
  "packageName": "com.nathcorp.servicenow-kb",
  "developer": {
    "name": "NathCorp IT Team",
    "websiteUrl": "https://nathcorp.com",
    "privacyUrl": "https://nathcorp.com/privacy",
    "termsOfUseUrl": "https://nathcorp.com/terms"
  },
  "name": {
    "short": "NathCorp ServiceNow KB",
    "full": "NathCorp ServiceNow Knowledge Base for Cowork"
  },
  "description": {
    "short": "Search ServiceNow KB for IT issue resolution",
    "full": "Connects Cowork to NathCorp ServiceNow knowledge base..."
  },
  "icons": {
    "color": "color.png",
    "outline": "outline.png"
  },
  "accentColor": "#0078D4",
  "agentSkills": [
    { "folder": "./skills/servicenow-kb-search" }
  ],
  "agentConnectors": [
    {
      "id": "servicenow-mcp",
      "displayName": "NathCorp ServiceNow MCP",
      "toolSource": {
        "remoteMcpServer": {
          "mcpServerUrl": "https://nathcorp-mcp-server.azurewebsites.net",
          "authorization": {
            "type": "None"
          }
        }
      }
    }
  ]
}
```

### Key fields explained

| Field | Value | Purpose |
|-------|-------|---------|
| `manifestVersion` | `devPreview` | Required for Cowork Frontier plugins |
| `version` | `2.0.0` | Must be bumped on every re-upload (admin center enforces this) |
| `id` | `49402c59-...` | Unique GUID — generated once via `[guid]::NewGuid()` in PowerShell |
| `packageName` | `com.nathcorp.servicenow-kb` | Reverse-domain unique identifier |
| `agentSkills` | `./skills/servicenow-kb-search` | Points to folder containing SKILL.md |
| `agentConnectors` | `remoteMcpServer` | Points Cowork to our Azure MCP server URL |
| `authorization.type` | `None` | No token passed from Cowork to MCP server (our server handles its own auth with ServiceNow) |

### Why `authorization: None`
Our MCP server does its own OAuth with ServiceNow using the client secret stored in Azure App Settings. Cowork does not need to pass any token to our MCP server — the Azure App Service is secured at the HTTPS level.

### Wrong schema that caused validation error (fixed)
```json
// ❌ WRONG — caused "Property 'type' has not been defined" error
"agentConnectors": [{ "id": "servicenow-mcp", "type": "mcp", "url": "..." }]

// ✅ CORRECT — required nested structure
"agentConnectors": [{ "toolSource": { "remoteMcpServer": { "mcpServerUrl": "..." } } }]
```

---

## 5. Component 4 — SKILL.md

**File:** `NathCorpCoworkPlugin/skills/servicenow-kb-search/SKILL.md`
**Version:** 2.0
**Standard:** Agent Skills open standard (same used by Claude Code, VS Code Copilot, Cursor, Gemini CLI)

### Full file
```markdown
---
name: servicenow-kb-search
description: |
  NathCorp IT Support assistant. Searches the NathCorp ServiceNow knowledge base
  for IT issue resolution steps and creates support tickets when needed.
  Trigger this skill when user reports any IT problem such as:
  "VPN not working", "can't connect to VPN", "forgot password", "password reset",
  "Outlook not opening", "email not working", "laptop slow", "computer slow",
  "can't login", "network issue", "printer not working", "software not opening",
  "screen not working", "internet not working", "Teams not working", "access denied".
license: MIT
metadata:
  author: NathCorp IT Team
  version: "2.0"
---

# NathCorp IT Support — ServiceNow KB + Ticket Creation

## Role
You are the NathCorp IT Support assistant...

## Workflow

### Step 1 — Search Knowledge Base
When user reports an IT issue:
- Call tool: search_kb_articles
- Parameter query: extract the core IT issue

### Step 2 — Generate Resolution Steps
- Combine KB articles + AI knowledge
- Present numbered resolution steps

### Step 3 — Ask Resolution Confirmation
"Did this resolve your issue? Please reply Yes or No."

### Step 4 — If User Replies Yes
"Great! Glad the issue is resolved."
End conversation. Do NOT create a ticket.

### Step 5 — If User Replies No
- Call tool: create_incident
- short_description: one-line summary
- description: full details + steps tried
- Tell user: "Ticket [number] has been raised."

## Rules
- ALWAYS call search_kb_articles first
- NEVER create a ticket unless user says "No"
- NEVER ask user to contact IT themselves
- NEVER fake a ticket — always call the tool
```

### SKILL.md structure explained

| Section | Purpose |
|---------|---------|
| **YAML frontmatter** (`---`) | `name` and `description` tell Cowork when to activate this skill — Cowork reads the description to decide if it should trigger |
| **Role** | Sets the AI persona — "You are NathCorp IT Support assistant" |
| **Workflow steps** | Exact numbered instructions Cowork AI follows — like a script |
| **Rules** | Hard constraints — prevent hallucination (faking ticket creation), prevent bad UX (asking user to call IT) |

### Why SKILL.md v2.0 was needed
v1.0 said "if user says No, respond that you will raise a ticket" — Cowork was just saying it verbally without actually calling `create_incident`. v2.0 adds explicit instruction: **"Call tool: `create_incident`"** — Cowork now actually calls the API.

### Trigger keywords (from description field)
```
VPN not working | can't connect to VPN | forgot password | password reset
Outlook not opening | email not working | laptop slow | computer slow
can't login | network issue | printer not working | software not opening
screen not working | internet not working | Teams not working | access denied
```

---

## 6. Component 5 — MCP Server (server.js)

**File:** `nathcorp-mcp-server/server.js`
**Version:** 2.0.0
**Runtime:** Node.js 22 LTS
**Framework:** Express.js

### Dependencies (package.json)
```json
{
  "dependencies": {
    "axios":   "^1.7.2",   // HTTP client — calls ServiceNow REST API
    "dotenv":  "^17.4.2",  // loads .env file in local dev
    "express": "^4.19.2"   // HTTP server framework
  },
  "devDependencies": {
    "nodemon": "^3.1.3"    // auto-restart in dev (not used in production)
  },
  "engines": {
    "node": ">=22.0.0"     // enforces correct Node version
  }
}
```

### Server startup — fail fast validation
```javascript
const REQUIRED_ENV = ['SNOW_INSTANCE_URL', 'SNOW_CLIENT_ID', 'SNOW_CLIENT_SECRET'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);  // crash immediately — do not start with bad config
}
```
**Why:** In production, a misconfigured server that silently fails is worse than one that crashes loudly. This ensures the server never starts without required credentials.

---

### Function 1 — getToken() — OAuth Token with Caching

```javascript
let cachedToken  = null;
let tokenExpiry  = 0;
let tokenRefresh = null;  // single promise — prevents duplicate concurrent requests

async function getToken() {
    // Return cached token if still valid
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

    // If a refresh is already in progress, wait for it (don't send 2 token requests)
    if (!tokenRefresh) {
        tokenRefresh = axios.post(
            `${INSTANCE_URL}/oauth_token.do`,
            new URLSearchParams({
                grant_type:    'client_credentials',
                client_id:     CLIENT_ID,
                client_secret: CLIENT_SECRET
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
        ).then(res => {
            cachedToken  = res.data.access_token;
            // expires_in - 300 = refresh 5 minutes before actual expiry (safety buffer)
            tokenExpiry  = Date.now() + (res.data.expires_in - 300) * 1000;
            tokenRefresh = null;
            return cachedToken;
        }).catch(err => { tokenRefresh = null; throw err; });
    }
    return tokenRefresh;  // multiple callers share the same promise
}
```

**Key design decisions:**
- **Token caching** — Token is reused for 12 hours (configured in ServiceNow). No new token request on every API call.
- **5-minute safety buffer** (`expires_in - 300`) — Token is refreshed 5 minutes before it actually expires. Prevents mid-request token expiry.
- **Single refresh promise** — If 10 requests come in at the same time when token is expired, only 1 token request is sent to ServiceNow. All 10 requests share the same promise result. Prevents token flooding.
- **Timeout: 10000ms** — Token request times out after 10 seconds.

---

### Function 2 — stripHtml() — Clean KB Article Content

```javascript
function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, ' ')    // remove all HTML tags → <p>, <br>, <div>, etc.
        .replace(/&amp;/g, '&')       // decode HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#\d+;/g, '')       // remove numeric HTML entities
        .replace(/\s{2,}/g, ' ')      // collapse multiple spaces into one
        .trim()
        .substring(0, 1000);          // limit to 1000 chars — avoid sending massive articles to Cowork
}
```

**Why needed:** ServiceNow KB articles store content as HTML (`<p>Step 1: ...<br/>Step 2:...</p>`). Sending raw HTML to Cowork's AI would confuse the AI and waste tokens. `stripHtml` converts to clean plain text.

---

### Function 3 — safeError() — Production Error Hiding

```javascript
function safeError(err) {
    if (IS_PROD) return 'An internal error occurred. Please try again.';
    return err.response?.data || err.message;
}
```

**Why:** In production (`NODE_ENV=production`), internal error details (ServiceNow URLs, query params, stack traces) must never be exposed to the client. In development, full error details help debugging.

---

### Function 4 — search_kb_articles() — KB Search Tool

```javascript
async function search_kb_articles({ query }) {
    if (!query || !query.trim()) throw new Error('query is required');

    const token  = await getToken();
    const result = await axios.get(`${INSTANCE_URL}/api/now/table/kb_knowledge`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params: {
            sysparm_query:  `short_descriptionLIKE${query.trim()}^ORtextLIKE${query.trim()}`,
            sysparm_fields: 'short_description,text,number,sys_id,category',
            sysparm_limit:  5
        },
        timeout: 15000
    });

    return result.data.result.map(a => ({
        number:            a.number,
        short_description: a.short_description.trim(),
        category:          a.category || '',
        text:              stripHtml(a.text)   // HTML → plain text
    }));
}
```

**ServiceNow Table API call:**
```
GET https://dev249650.service-now.com/api/now/table/kb_knowledge
Authorization: Bearer <token>

Query parameters:
  sysparm_query  = short_descriptionLIKEVPN^ORtextLIKEVPN
  sysparm_fields = short_description,text,number,sys_id,category
  sysparm_limit  = 5
```

**Key decisions:**
- **`LIKE` operator** — case-insensitive partial match. "VPN" matches "VPN not working", "VPN connectivity", etc.
- **`^OR`** — searches BOTH `short_description` (article title) AND `text` (article body). Better coverage.
- **`sysparm_fields`** — fetch only 5 fields (not all 50+ columns). Faster response, smaller payload.
- **`sysparm_limit: 5`** — max 5 articles. Enough context for AI without overloading the response.
- **No `workflow_state=published` filter** — initially added this filter but it caused 0 results. Removed so all 42 articles are searchable regardless of state.
- **Timeout: 15000ms** — ServiceNow API gets 15 seconds to respond.

---

### Function 5 — create_incident() — Ticket Creation Tool

```javascript
async function create_incident({ short_description, description }) {
    if (!short_description?.trim() || !description?.trim())
        throw new Error('short_description and description are required');

    const token  = await getToken();
    const result = await axios.post(
        `${INSTANCE_URL}/api/now/table/incident`,
        {
            short_description: short_description.trim(),
            description:       description.trim(),
            priority:          '3',              // Medium priority
            assignment_group:  'IT Support',     // auto-routed to IT Support group
            contact_type:      'self-service'    // marks it as employee self-raised
        },
        {
            headers: {
                Authorization:  `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept:         'application/json'
            },
            timeout: 15000
        }
    );

    const ticket = result.data.result;
    return {
        ticket_number: ticket.number,      // e.g. "INC0010007"
        sys_id:        ticket.sys_id,
        state:         ticket.state,       // "1" = New
        message:       `Ticket ${ticket.number} has been raised. IT Support will contact you soon.`
    };
}
```

**ServiceNow Table API call:**
```
POST https://dev249650.service-now.com/api/now/table/incident
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "short_description": "VPN not connecting",
  "description": "User reported VPN not working. Steps tried: checked internet, restarted VPN client, verified credentials. Issue not resolved.",
  "priority": "3",
  "assignment_group": "IT Support",
  "contact_type": "self-service"
}
```

**Ticket fields set:**
| Field | Value | Reason |
|-------|-------|--------|
| `priority` | `3` | Medium — not critical, not low. Standard for self-service IT issues. |
| `assignment_group` | `IT Support` | Auto-routes to correct team. No manual routing needed. |
| `contact_type` | `self-service` | Marks ticket as employee-initiated via self-service portal (Cowork) — helps IT reporting. |

---

### MCP Tool Registry (TOOLS array)

```javascript
const TOOLS = [
    {
        name:        'search_kb_articles',
        description: 'Search NathCorp ServiceNow Knowledge Base articles for IT issue resolution steps',
        annotations: { readOnlyHint: true, title: 'Search Knowledge Base' },
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The IT issue to search for...' }
            },
            required: ['query']
        }
    },
    {
        name:        'create_incident',
        description: 'Create a ServiceNow incident ticket when the user says the KB answer did not resolve their issue',
        annotations: { readOnlyHint: false, destructiveHint: false, title: 'Create Support Ticket' },
        inputSchema: {
            type: 'object',
            properties: {
                short_description: { type: 'string', description: 'One-line summary' },
                description:       { type: 'string', description: 'Full description including what was tried' }
            },
            required: ['short_description', 'description']
        }
    }
];
```

**Annotations explained:**
| Annotation | Tool | Value | Effect |
|------------|------|-------|--------|
| `readOnlyHint` | search_kb_articles | `true` | Tells Cowork this tool only reads data — no confirmation dialog shown to user |
| `readOnlyHint` | create_incident | `false` | This tool writes data — Cowork may show confirmation |
| `destructiveHint` | create_incident | `false` | Creating a ticket is not destructive — no extra warning |
| `title` | both | human-readable | Shown in Cowork Sources & Skills panel |

---

### JSON-RPC 2.0 Endpoint — The Core Handler

```javascript
app.post('/', async (req, res) => {
    const { jsonrpc, method, params, id } = req.body;

    // Reject non-JSON-RPC 2.0 requests
    if (jsonrpc !== '2.0') {
        return res.status(400).json({
            jsonrpc: '2.0', id: id ?? null,
            error: { code: -32600, message: 'Invalid Request' }
        });
    }

    // tools/list — Cowork discovers available tools
    if (method === 'tools/list') {
        return res.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    }

    // tools/call — Cowork executes a tool
    if (method === 'tools/call') {
        const fn = TOOL_MAP[params?.name];
        if (!fn) return res.json({
            jsonrpc: '2.0', id,
            error: { code: -32601, message: `Tool not found: ${params?.name}` }
        });
        const result = await fn(params?.arguments || {});
        return res.json({
            jsonrpc: '2.0', id,
            result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        });
    }

    // initialize — MCP client handshake
    if (method === 'initialize') {
        return res.json({
            jsonrpc: '2.0', id,
            result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'NathCorp ServiceNow MCP', version: '2.0.0' }
            }
        });
    }
});
```

**Three MCP methods handled:**
| Method | When called | Response |
|--------|------------|---------|
| `initialize` | First connection — MCP client handshake | Protocol version + capabilities |
| `tools/list` | Cowork discovers what tools exist | Array of tool definitions with schemas |
| `tools/call` | Cowork executes a specific tool | Tool result wrapped in MCP content format |

---

### Legacy HTTP Endpoints (for direct testing only)

```javascript
// These are NOT called by Cowork — kept for PowerShell testing
app.post('/tools/search_kb_articles', async (req, res) => { ... });
app.post('/tools/create_incident',    async (req, res) => { ... });
```

These allow direct testing without JSON-RPC wrapper:
```powershell
# Direct test (bypasses JSON-RPC — for debugging only)
Invoke-RestMethod -Method POST `
  -Uri "https://nathcorp-mcp-server.azurewebsites.net/tools/search_kb_articles" `
  -ContentType "application/json" `
  -Body '{"query":"VPN"}'
```

---

## 7. Component 6 — ServiceNow

### Instance
```
URL:  https://dev249650.service-now.com
Type: Developer/Trial instance
```

### Service Account — cowork_plugin_svc
| Field | Value |
|-------|-------|
| User ID | `cowork_plugin_svc` |
| Display Name | Cowork Plugin Service |
| Identity type | **Machine** (no password login, no UI access) |
| Web Service Access Only | ✅ checked |
| Internal Integration User | ✅ checked |
| Roles | `knowledge` (read KB) + `itil` (create incidents) |

### OAuth Application — CoworkPlugin
| Field | Value |
|-------|-------|
| Name | `CoworkPlugin` |
| Grant type | **Client Credentials** (machine-to-machine, no user login) |
| OAuth user | `cowork_plugin_svc` |
| Client ID | `d18b020ea85841079e001bfc71da7d22` |
| Token lifetime | 43200 seconds (12 hours) |
| Auth scope | `useraccount` (required — without this: "Access to unscoped api is not allowed") |

### System Property (required)
```
Name:  glide.oauth.inbound.client.credential.grant_type.enabled
Value: true
```
Without this property, ServiceNow rejects client credentials grant type entirely.

### KB User Criteria
IT Knowledge Base has a "Can Read" access control. `cowork_plugin_svc` was added explicitly:
- **Name:** Cowork Plugin Service Account
- **Type:** User
- **User:** cowork_plugin_svc

Without this — KB search returns 0 results even with a valid token.

### Tables used
| Table | API Endpoint | Used for |
|-------|-------------|---------|
| `kb_knowledge` | `GET /api/now/table/kb_knowledge` | Search KB articles |
| `incident` | `POST /api/now/table/incident` | Create support tickets |
| `oauth_token.do` | `POST /oauth_token.do` | Get OAuth Bearer token |

---

## 8. Communication Protocol — JSON-RPC 2.0

MCP (Model Context Protocol) uses **JSON-RPC 2.0** as its wire protocol. Cowork requires this standard — custom REST endpoints are not understood.

### Request format
```json
{
  "jsonrpc": "2.0",
  "method":  "tools/call",
  "params":  {
    "name":      "search_kb_articles",
    "arguments": { "query": "VPN" }
  },
  "id": 1
}
```

### Response format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[{\"number\":\"KB0010001\",\"short_description\":\"VPN Troubleshooting\"...}]"
      }
    ]
  }
}
```

### Error response format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code":    -32601,
    "message": "Tool not found: unknown_tool"
  }
}
```

### Standard JSON-RPC error codes
| Code | Meaning |
|------|---------|
| -32600 | Invalid Request (not JSON-RPC 2.0) |
| -32601 | Method/tool not found |
| -32603 | Internal error (ServiceNow call failed) |

---

## 9. Authentication Flow — OAuth 2.0

```
MCP Server startup / first API call
          │
          ▼
POST https://dev249650.service-now.com/oauth_token.do
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=d18b020ea85841079e001bfc71da7d22
&client_secret=***
          │
          ▼
ServiceNow validates client_id + client_secret against CoworkPlugin OAuth app
Checks: glide.oauth.inbound.client.credential.grant_type.enabled = true
Checks: auth scope = useraccount
          │
          ▼
Returns:
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 43200    ← 12 hours
}
          │
          ▼
MCP Server caches token
Sets expiry = now + (43200 - 300) seconds  ← 5 min safety buffer
          │
          ▼
All subsequent API calls:
GET /api/now/table/kb_knowledge
Authorization: Bearer eyJ...

POST /api/now/table/incident
Authorization: Bearer eyJ...
          │
          ▼
Token auto-refreshes when expired (single deduped promise)
```

---

## 10. Full End-to-End Data Flow

```
User types: "VPN not working"
     │
     ▼
Cowork reads SKILL.md description → "VPN not working" matches trigger keywords
     │
     ▼
Cowork calls MCP: tools/list → gets search_kb_articles + create_incident
     │
     ▼
Cowork calls MCP: tools/call → search_kb_articles → query: "VPN"
     │
     ▼
MCP server: getToken() → checks cache → cache empty → POST oauth_token.do
     │
     ◄── Bearer token received, cached 12h
     │
     ▼
MCP server: GET /api/now/table/kb_knowledge
  ?sysparm_query=short_descriptionLIKEVPN^ORtextLIKEVPN
  &sysparm_fields=short_description,text,number,sys_id,category
  &sysparm_limit=5
     │
     ◄── ServiceNow returns up to 5 KB articles as JSON
     │
MCP server: stripHtml(article.text) → clean plain text, max 1000 chars
     │
     ▼
MCP server returns to Cowork:
{
  "jsonrpc":"2.0","id":1,
  "result":{"content":[{"type":"text","text":"[{number:KB001,...}]"}]}
}
     │
     ▼
Cowork AI combines KB article content + its own Claude AI knowledge
Generates numbered resolution steps
Adds source citation: "(Source: ServiceNow KB — VPN Troubleshooting + AI)"
Asks: "Did this resolve your issue? Yes or No?"
     │
     ├── User: "Yes" → Cowork: "Great! Glad it's resolved." → END
     │
     └── User: "No"
          │
          ▼
     Cowork calls MCP: tools/call → create_incident
     {
       "short_description": "VPN not connecting",
       "description": "User reported VPN not working. Steps tried: [list]. Not resolved."
     }
          │
          ▼
     MCP server: getToken() → cache hit → returns cached token
          │
          ▼
     MCP server: POST /api/now/table/incident
     {
       "short_description": "VPN not connecting",
       "description": "...",
       "priority": "3",
       "assignment_group": "IT Support",
       "contact_type": "self-service"
     }
          │
          ◄── ServiceNow creates ticket: INC0010007
          │
          ▼
     MCP server returns:
     { ticket_number: "INC0010007", message: "Ticket INC0010007 has been raised..." }
          │
          ▼
     Cowork: "I have raised support ticket INC0010007 for you.
              IT Support team will contact you shortly."
          │
          ▼
     Ticket visible in ServiceNow Incidents list ← PROOF ✅
```

---

## 11. Security Implementation

| Layer | Measure | Detail |
|-------|---------|--------|
| **Credentials storage** | Azure App Service Application Settings | Encrypted at rest. Never in code, never in git, never in .md files. |
| **Service account** | Machine identity + Web Service Access Only | `cowork_plugin_svc` cannot log in via UI or browser. API-only access. |
| **Minimum roles** | `knowledge` + `itil` only | Cannot access HR, Finance, or any other ServiceNow module. |
| **OAuth grant type** | Client Credentials | Machine-to-machine. No user password in the flow. |
| **Token lifetime** | 12 hours with 5-min buffer | Long enough for efficiency, refreshed automatically before expiry. |
| **Token deduplication** | Single refresh promise | Prevents token flooding — only 1 token request at a time. |
| **KB access control** | User Criteria on IT KB | `cowork_plugin_svc` must be explicitly listed in IT KB "Can Read" criteria. |
| **Error hiding** | `safeError()` in production | Internal ServiceNow URLs, error messages, stack traces never exposed to client. |
| **Transport** | HTTPS only | Azure App Service enforces HTTPS. All ServiceNow API calls use HTTPS. |
| **No data storage** | Federated real-time | KB articles and tickets are never stored on the MCP server or in Microsoft. Data flows through in-memory only. |

---

## 12. Azure Hosting

### Resources
| Resource | Name | Spec |
|----------|------|------|
| Resource Group | `nathcorp-cowork-rg` | East Asia region |
| App Service Plan | `nathcorp-cowork-plan` | **B1 Linux** (1 core, 1.75GB RAM) |
| Web App | `nathcorp-mcp-server` | Node 22 LTS |
| Subscription | MPN - MTT - APP - 5 | `ab16955e-1117-4633-88fe-27dd48acafc1` |

### Why B1 and not Free F1
F1 (Free) has no custom startup command, no Always On, and sleeps after inactivity. B1 supports always-on, custom startup, and production workloads.

### Environment variables (set in Azure Portal → Configuration)
| Variable | Value |
|----------|-------|
| `SNOW_INSTANCE_URL` | `https://dev249650.service-now.com` |
| `SNOW_CLIENT_ID` | `d18b020ea85841079e001bfc71da7d22` |
| `SNOW_CLIENT_SECRET` | (not written here — in Azure Portal only) |
| `NODE_ENV` | `production` |
| `PORT` | Auto-set by Azure (8080) |

### .deployment file (critical)
```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```
Tells Azure Kudu to run `npm install` on every deploy. Without this → `Cannot find module 'dotenv'` error.

### Startup command
```
node server.js
```
Set via: `az webapp config set --startup-file "node server.js"`

### Deploy command
```powershell
az webapp up --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg --runtime "NODE:22-lts"
```

---

## 13. Key Problems Solved

| # | Problem | Root Cause | Fix |
|---|---------|-----------|-----|
| 1 | `Access to unscoped api is not allowed` | ServiceNow OAuth missing `useraccount` auth scope | Added `useraccount` scope in Inbound Integrations |
| 2 | KB search returned 0 results | `workflow_state=published` filter too strict | Removed the filter entirely |
| 3 | KB still 0 results via API (but worked in browser) | `cowork_plugin_svc` not in IT KB "Can Read" user criteria | Added explicit user criteria entry for service account |
| 4 | `Cannot find module 'dotenv'` on Azure | Azure did not run `npm install` — node_modules missing | Added `.deployment` file with `SCM_DO_BUILD_DURING_DEPLOYMENT=true` |
| 5 | Client secret broken in PowerShell CLI | `$` and `\|` characters in secret interpreted by PowerShell | Set env vars manually via Azure Portal |
| 6 | manifest.json validation error on upload | Wrong `agentConnectors` schema (`type` + `url` not valid fields) | Fixed to nested `toolSource.remoteMcpServer.mcpServerUrl` |
| 7 | "Must upload newer version" error | Plugin already existed at v1.0.0 | Bumped `version` in manifest.json to `2.0.0` |
| 8 | Plugin visible in Cowork but not triggering | MCP server used custom REST, not JSON-RPC 2.0 | Rewrote `server.js` to handle `tools/list` + `tools/call` in JSON-RPC 2.0 |
| 9 | SKILL.md v1.0 said "will raise ticket" but never did | v1.0 only had verbal instruction, not explicit tool call | v2.0 added "Call tool: `create_incident`" — forces actual API call |
| 10 | `access_denied` on OAuth token | Special characters in `.env` client secret not quoted | Wrapped value in double quotes in `.env` file |

---

*NathCorp Internal — Technical Reference | Rajesh (rajesh.alda@nathcorp.com)*
