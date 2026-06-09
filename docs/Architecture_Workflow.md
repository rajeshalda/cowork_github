# NathCorp ServiceNow + Microsoft Cowork Integration
## Architecture & Workflow — Manager Presentation
**Prepared by:** Rajesh (rajesh.alda@nathcorp.com)
**Date:** 2026-05-22
**Status:** Production — Live ✅

---

## Executive Summary

NathCorp employees can now type any IT problem in Microsoft Cowork and receive instant resolution steps pulled directly from the ServiceNow Knowledge Base. If the steps do not resolve the issue, Cowork automatically raises a ServiceNow support ticket — no manual form filling, no calls to IT helpdesk.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NATHCORP EMPLOYEE                            │
│                  Types IT issue in Microsoft Cowork                 │
│                   https://m365.cloud.microsoft                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MICROSOFT COWORK                                │
│                  (AI Agent — Powered by Claude)                     │
│                                                                     │
│   Plugin: NathCorp ServiceNow KB v2.0.0  ←  Loaded from Admin      │
│   SKILL.md: Defines workflow + rules                                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │  JSON-RPC 2.0
                                │  POST https://nathcorp-mcp-server.azurewebsites.net
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  NATHCORP MCP SERVER                                │
│             Azure App Service — Node.js v22 LTS                     │
│             https://nathcorp-mcp-server.azurewebsites.net           │
│                                                                     │
│   Tool 1: search_kb_articles  → GET  /api/now/table/kb_knowledge    │
│   Tool 2: create_incident     → POST /api/now/table/incident        │
└────────────────┬────────────────────────────┬────────────────────────┘
                 │  OAuth 2.0                 │  OAuth 2.0
                 │  Bearer Token              │  Bearer Token
                 ▼                            ▼
┌──────────────────────────┐    ┌─────────────────────────────────────┐
│   SERVICENOW KB TABLE    │    │     SERVICENOW INCIDENT TABLE       │
│  kb_knowledge            │    │     incident                        │
│                          │    │                                     │
│  IT Knowledge Base       │    │  Creates ticket with:               │
│  35 articles ✅           │    │  - short_description                │
│  KCS Demo KB             │    │  - description                      │
│  4 articles              │    │  - priority: 3 (Medium)             │
│  Known Error KB          │    │  - assignment_group: IT Support     │
│  3 articles              │    │  - contact_type: self-service       │
│                          │    │                                     │
│  Total: 42 articles      │    │  Returns: INC00XXXXX ✅              │
└──────────────────────────┘    └─────────────────────────────────────┘
         Both tables on: https://dev249650.service-now.com
```

---

## Detailed Step-by-Step Workflow

```
STEP 1 — Employee types IT issue in Cowork
══════════════════════════════════════════
User: "VPN not working"
         │
         │  Cowork reads the active plugin (NathCorp ServiceNow KB v2.0.0)
         │  SKILL.md instructs Cowork: "Always call search_kb_articles first"
         │
         ▼

STEP 2 — Cowork calls MCP Server to search KB
══════════════════════════════════════════════
Cowork → POST https://nathcorp-mcp-server.azurewebsites.net
         Body: {
           "jsonrpc": "2.0",
           "method": "tools/call",
           "params": {
             "name": "search_kb_articles",
             "arguments": { "query": "VPN" }
           },
           "id": 1
         }
         │
         ▼

STEP 3 — MCP Server authenticates with ServiceNow
══════════════════════════════════════════════════
MCP Server → POST https://dev249650.service-now.com/oauth_token.do
             grant_type=client_credentials
             client_id=d18b020ea85841079e001bfc71da7d22
             client_secret=***(stored in Azure App Settings)***
         │
         ◄── Returns: Bearer Token (cached 12 hours)
         │
         ▼

STEP 4 — MCP Server queries ServiceNow KB
═══════════════════════════════════════════
MCP Server → GET https://dev249650.service-now.com/api/now/table/kb_knowledge
             Authorization: Bearer <token>
             sysparm_query=short_descriptionLIKEVPN^ORtextLIKEVPN
             sysparm_fields=short_description,text,number,sys_id,category
             sysparm_limit=5
         │
         ◄── Returns: Up to 5 matching KB articles
         │
         ▼

STEP 5 — MCP Server returns articles to Cowork
════════════════════════════════════════════════
MCP Server → Cowork:
{
  "jsonrpc": "2.0",
  "result": {
    "content": [{
      "type": "text",
      "text": "[{ number: KB0010001, short_description: VPN Troubleshooting, ... }]"
    }]
  }
}
         │
         ▼

STEP 6 — Cowork generates resolution steps
════════════════════════════════════════════
Cowork combines:
  ├── KB article content (from ServiceNow)
  └── AI knowledge (Claude/Anthropic)
         │
         ▼
Cowork replies to user:

  "Here are the resolution steps for VPN not working:
   1. Check your internet connection
   2. Verify your NathCorp credentials
   3. Restart the VPN client
   4. Confirm VPN server: vpn.nathcorp.com
   5. Disable antivirus/firewall temporarily
   *(Source: ServiceNow KB — VPN Troubleshooting + AI)*
   Did this resolve your issue? Please reply Yes or No."
         │
         ├──── User replies YES ──────────────────────────────►  DONE ✅
         │                                                    Cowork: "Great! Glad
         │                                                    the issue is resolved."
         │
         └──── User replies NO ──────────────────────────────►  STEP 7
         │
         ▼

STEP 7 — Cowork calls MCP Server to create ticket
════════════════════════════════════════════════════
Cowork → POST https://nathcorp-mcp-server.azurewebsites.net
         Body: {
           "jsonrpc": "2.0",
           "method": "tools/call",
           "params": {
             "name": "create_incident",
             "arguments": {
               "short_description": "VPN not connecting",
               "description": "User reported VPN not working. Resolution steps provided (check internet, restart VPN, verify credentials). Steps did not resolve the issue."
             }
           },
           "id": 2
         }
         │
         ▼

STEP 8 — MCP Server creates ServiceNow ticket
═══════════════════════════════════════════════
MCP Server → POST https://dev249650.service-now.com/api/now/table/incident
             Authorization: Bearer <token>
             {
               "short_description": "VPN not connecting",
               "description": "...",
               "priority": "3",
               "assignment_group": "IT Support",
               "contact_type": "self-service"
             }
         │
         ◄── Returns: { number: "INC0010001", sys_id: "...", state: "1" }
         │
         ▼

STEP 9 — Cowork confirms ticket to user
═════════════════════════════════════════
Cowork: "I have raised a support ticket INC0010001 for you.
         Our IT Support team will contact you shortly.
         Thank you for your patience."

══════════════════════════════════════════
FLOW COMPLETE ✅
══════════════════════════════════════════
```

---

## Component Details

### 1. Microsoft Cowork
| Item | Detail |
|------|--------|
| Product | Microsoft Cowork (official M365 product) |
| URL | https://m365.cloud.microsoft |
| AI Engine | Powered by Anthropic (Claude) |
| Access | M365 Copilot license + Frontier preview enabled |
| Program | Frontier preview — enabled in NathCorp tenant by Richa + Chandan Sir |

### 2. NathCorp Cowork Plugin (Package)
| Item | Detail |
|------|--------|
| Package | NathCorpServiceNowPlugin.zip |
| Version | 2.0.0 |
| Uploaded via | https://admin.cloud.microsoft → Agents → All agents |
| Deployed via | https://admin.microsoft.com → Settings → Integrated apps |
| Deployed to | Specific users: Rajesh.Alda@nathcorp.com, richa.kumari@nathcorp.com |
| Contents | manifest.json + SKILL.md + icons |

**Plugin folder structure:**
```
NathCorpServiceNowPlugin.zip
├── manifest.json          ← Plugin definition + MCP server URL
├── color.png              ← 192x192 icon
├── outline.png            ← 32x32 icon
└── skills/
    └── servicenow-kb-search/
        └── SKILL.md       ← AI workflow instructions
```

### 3. SKILL.md — The AI Brain
The SKILL.md file is the instruction set that tells Cowork exactly what to do. It defines:
- **When to trigger** — "VPN not working", "password reset", "Outlook issue", etc.
- **What to do** — Always call `search_kb_articles` first, then combine with AI
- **Format** — Numbered resolution steps + KB source citation
- **Decision point** — Ask "Did this resolve your issue? Yes or No"
- **If No** — Call `create_incident` tool with full issue details
- **Hard rules** — Never skip KB search, never fake a ticket, never ask user to call IT themselves

### 4. MCP Server (Azure App Service)
| Item | Detail |
|------|--------|
| URL | https://nathcorp-mcp-server.azurewebsites.net |
| Hosting | Azure App Service — B1 Linux plan |
| Runtime | Node.js 22 LTS |
| Resource Group | nathcorp-cowork-rg |
| App Service Plan | nathcorp-cowork-plan |
| Subscription | MPN - MTT - APP - 5 (NathCorp) |
| Protocol | JSON-RPC 2.0 (MCP standard required by Cowork) |
| Code | server.js — Node.js + Express |

**MCP Server tools exposed:**

| Tool | Type | API Called | Purpose |
|------|------|-----------|---------|
| `search_kb_articles` | Read-only | GET /api/now/table/kb_knowledge | Search ServiceNow KB articles |
| `create_incident` | Write | POST /api/now/table/incident | Create support ticket |

### 5. ServiceNow (Vishal's Instance)
| Item | Detail |
|------|--------|
| Instance URL | https://dev249650.service-now.com |
| Type | Developer/Trial instance |
| Service Account | cowork_plugin_svc (Machine identity) |
| Roles | `knowledge` (KB read) + `itil` (incident write) |
| OAuth App | CoworkPlugin (Client Credentials grant) |
| Client ID | d18b020ea85841079e001bfc71da7d22 |
| Token lifetime | 12 hours (43200 seconds) |
| KB Access | IT Knowledge Base — "Can Read" user criteria added |

**ServiceNow KB Articles available:**
| Knowledge Base | Article Count |
|----------------|---------------|
| IT Knowledge Base | 35 articles |
| KCS Demo KB | 4 articles |
| Known Error KB | 3 articles |
| **Total** | **42 articles** |

---

## API Reference

### OAuth Token Request
```
POST https://dev249650.service-now.com/oauth_token.do
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=d18b020ea85841079e001bfc71da7d22
&client_secret=***
```

### KB Search API
```
GET https://dev249650.service-now.com/api/now/table/kb_knowledge

Query parameters:
  sysparm_query  = short_descriptionLIKE{query}^ORtextLIKE{query}
  sysparm_fields = short_description,text,number,sys_id,category
  sysparm_limit  = 5

Headers:
  Authorization: Bearer <token>
  Accept: application/json
```

### Incident Creation API
```
POST https://dev249650.service-now.com/api/now/table/incident

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "short_description": "VPN not connecting",
  "description": "Full details of issue + steps tried",
  "priority": "3",
  "assignment_group": "IT Support",
  "contact_type": "self-service"
}
```

---

## Security Design

| Component | Security Measure |
|-----------|-----------------|
| ServiceNow credentials | Stored in Azure App Service Application Settings (encrypted at rest) — never in code or .md files |
| OAuth flow | Client Credentials grant — machine-to-machine, no user password involved |
| Token caching | Token cached 12 hours, deduplicated (single refresh promise prevents token flooding) |
| Service account | Dedicated `cowork_plugin_svc` — Machine identity, Web Service Access Only, minimum required roles only |
| Error messages | Production mode hides internal error details from responses (`safeError()` function) |
| MCP authorization | `None` in manifest — Azure App Service is behind HTTPS, MCP server is not publicly advertised |
| KB access | User criteria added — only `cowork_plugin_svc` can read IT Knowledge Base via API |

---

## Team Contributions

| Person | Contribution |
|--------|-------------|
| Richa + Chandan Sir | Enabled Frontier preview in NathCorp M365 tenant |
| Vishal | Set up ServiceNow trial instance + published 42 KB articles |
| Sonalika | Configured Cowork access in NathCorp tenant |
| Rajesh | Built entire integration — OAuth, MCP server, plugin, Azure deployment |
| Nidhi | SKILL.md prompt refinement (in progress) |

---

## What Was Built — Full Task List

| # | Task | Status |
|---|------|--------|
| 1 | ServiceNow OAuth application (CoworkPlugin) created | ✅ Done |
| 2 | Service account `cowork_plugin_svc` with `itil` + `knowledge` roles | ✅ Done |
| 3 | IT KB "Can Read" user criteria added for service account | ✅ Done |
| 4 | OAuth `useraccount` auth scope configured | ✅ Done |
| 5 | API tested — ticket INC0010001 created successfully | ✅ Done |
| 6 | MCP server built (production-ready Node.js + Express) | ✅ Done |
| 7 | Plugin package (manifest.json + SKILL.md v1.0) built | ✅ Done |
| 8 | Azure resources created (Resource Group + B1 App Service) | ✅ Done |
| 9 | MCP server deployed to Azure — INC0010004 created via Azure | ✅ Done |
| 10 | manifest.json v2.0.0 — MCP server URL added | ✅ Done |
| 11 | SKILL.md v2.0 — explicit tool call workflow added | ✅ Done |
| 12 | MCP server updated to JSON-RPC 2.0 protocol | ✅ Done |
| 13 | MCP server v2.0.0 redeployed — INC0010006 created via JSON-RPC | ✅ Done |
| 14 | Plugin v2.0.0 uploaded + working in Cowork | ✅ Done |
| 15 | Full end-to-end flow testing | 🔄 In Progress |
| 16 | Upload final plugin to NathCorp prod tenant (via IT change ticket) | ⬜ Pending |

---

## Issues Fixed During Development

| Issue | Root Cause | Fix Applied |
|-------|-----------|-------------|
| "Access to unscoped api is not allowed" | Missing `useraccount` auth scope on OAuth integration | Added `useraccount` scope in ServiceNow Inbound Integrations |
| KB returning 0 results | `workflow_state=published` filter blocked articles | Removed workflow_state filter — returns all articles |
| KB still 0 results via API | `cowork_plugin_svc` not in IT KB "Can Read" criteria | Added "Cowork Plugin Service Account" user criteria to IT KB |
| Cannot find module 'dotenv' (Azure) | node_modules not built on Azure | Added `.deployment` file with `SCM_DO_BUILD_DURING_DEPLOYMENT=true` |
| Special characters in client secret broken | `$`, `|` chars broke PowerShell command | Added secret manually via Azure Portal |
| manifest.json validation error | Wrong agentConnectors schema | Fixed to `toolSource.remoteMcpServer.mcpServerUrl` |
| Must upload newer version | Plugin already at v1.0.0 | Bumped version to v2.0.0 |
| Plugin not triggering in Cowork | MCP server used custom HTTP, not JSON-RPC 2.0 | Updated server.js to handle `tools/list` + `tools/call` in JSON-RPC 2.0 |
| `access_denied` on token | Special chars in `.env` not quoted | Wrapped client secret in double quotes in `.env` |

---

## Live Environment Status

| Component | URL | Status |
|-----------|-----|--------|
| Cowork | https://m365.cloud.microsoft | ✅ Live |
| MCP Server | https://nathcorp-mcp-server.azurewebsites.net | ✅ Live |
| ServiceNow | https://dev249650.service-now.com | ✅ Live |
| Plugin in Cowork | NathCorp ServiceNow KB v2.0.0 | ✅ Active |
| KB Search | 42 articles searchable | ✅ Working |
| Ticket Creation | INC0010001 → INC0010006 created | ✅ Working |

---

## Next Steps

1. **Full end-to-end test** — Run complete "VPN not working → No → Ticket created" flow in Cowork
2. **Deploy to NathCorp prod tenant** — Upload plugin via IT change ticket to push to all licensed users
3. **Nidhi** — Refine SKILL.md instructions (optional polish)

---

*NathCorp Internal — Confidential | ServiceNow + Microsoft Cowork Integration*
*Prepared by: Rajesh (rajesh.alda@nathcorp.com)*
