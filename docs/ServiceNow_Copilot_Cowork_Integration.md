# ServiceNow + Microsoft Copilot Cowork Integration Guide
**Prepared by:** Rajesh | **Date:** 2026-05-20 | **Presentation:** Raj Sir — 2026-05-21

---

## What is Copilot Cowork?

**Copilot Cowork** is an official Microsoft product — it is NOT Copilot Studio.

| | Copilot Cowork | Copilot Studio |
|---|---|---|
| **What it is** | AI agent that takes actions on your behalf across M365 | Platform to build custom chatbots |
| **Where it runs** | `https://m365.cloud.microsoft` | `https://copilotstudio.microsoft.com` |
| **Access requirement** | M365 Copilot license + **Frontier program** | Separate Copilot Studio license |
| **ServiceNow support** | Via M365 Knowledge Connector OR Custom Plugin | Via connector actions |
| **AI engine** | Powered by Anthropic (Claude) | Azure OpenAI |

> Cowork is currently in **Frontier preview** — Richa + Chandan sir must enable Frontier in NathCorp tenant first before anyone can access it.

---

## Confirmed Flow (Manager Approved)

```
User asks question in Cowork
e.g. "VPN not working"
          │
          ▼
Cowork searches BOTH sources simultaneously:
  ├── ServiceNow Knowledge Base (KB articles)
  └── Generative AI (Cowork's own AI — powered by Anthropic/Claude)
          │
          ▼
Combined answer shown to user
(numbered resolution steps)
          │
          ▼
"Did this resolve your issue?"
  ├── YES → Done ✓
  └── NO  → Create ServiceNow ticket (via MCP)
```

---

## Types of Skills in Cowork — Know the Difference

There are **two completely different types of skills** in Cowork. Do not confuse them.

| | Type 1 — Personal Skill | Type 2 — Plugin Skill ← We use this |
|--|--------------------------|--------------------------------------|
| **What it is** | A SKILL.md file you drop in your own OneDrive | A SKILL.md packaged inside a `.zip` plugin uploaded by admin |
| **Location** | `OneDrive/Documents/Cowork/skills/<name>/SKILL.md` | Inside `NathCorpServiceNowPlugin.zip` → `skills/servicenow-kb-search/SKILL.md` |
| **Who sees it** | Only you (personal) | All deployed users org-wide |
| **MCP tools** | ❌ No — cannot call external APIs | ✅ Yes — `search_kb_articles` + `create_incident` |
| **Calls ServiceNow** | ❌ Cannot | ✅ Yes, live real-time API |
| **Creates tickets** | ❌ Cannot | ✅ Yes |
| **Deployed by** | Individual user | M365 Admin via admin.cloud.microsoft |
| **Best for** | Personal productivity (report formats, writing style) | Live API integrations like ServiceNow |
| **Max skills** | 50 per user | Defined in manifest.json |

> **Our integration uses Type 2 — Plugin Skill.**
> Adding a personal OneDrive skill on top would be redundant and cannot call ServiceNow anyway.
> The `/skills` option visible in Cowork chat refers to Type 1 personal skills — not our plugin.

---

## Team Task Breakdown

| Person | Task | Status |
|--------|------|--------|
| Richa + Chandan sir | Enable Frontier in NathCorp tenant → Cowork becomes available | Done ✓ |
| Vishal | ServiceNow trial instance + publish KB articles | Done ✓ (`https://dev249650.service-now.com`) |
| Sonalika | Configure Cowork in NathCorp tenant after Frontier enabled | Done ✓ |
| **Rajesh** | **Connect ServiceNow KB to Cowork — both approaches documented below** | Done ✓ — Cowork access received, starting configuration |
| Nidhi | Write SKILL.md prompt / instructions for resolution steps | See SKILL.md below |

---

## Key Clarifications

### 1 — ServiceNow Trial + NathCorp Org ID — How Does It Connect?

The M365 Knowledge Connector connects to ServiceNow using only the **instance URL + service account credentials**.
NathCorp's Org ID has nothing to do with ServiceNow authentication — they are completely independent.

```
M365 Admin Center (NathCorp tenant)
        │
        │  uses → https://dev249650.service-now.com
        │          + cowork_kb_reader credentials
        ▼
ServiceNow Trial Instance (Vishal's instance)
        │
        │  returns KB articles
        ▼
Microsoft Search indexes them
        │
        ▼
Cowork reads and answers from them
```

> ServiceNow does NOT care if it is a trial or production instance.
> The connector just needs the URL to be publicly reachable and valid credentials — both are satisfied.

---

### 2 — Who Can Use Cowork Chat? Does Everyone Need an Account?

**The integration is set up ONCE by admin (Rajesh). Users who want to chat with Cowork must be NathCorp employees with an M365 Copilot license.**

| User | Can use Cowork? |
|------|----------------|
| NathCorp employee WITH M365 Copilot license | Yes ✓ |
| NathCorp employee WITHOUT M365 Copilot license | No ✗ |
| External person (no NathCorp account) | No ✗ |

```
Integration = railway track  (set up ONCE by Rajesh — admin)
Users       = passengers     (need a valid ticket = M365 Copilot license)
```

> The integration and the users are separate concerns.
> Rajesh sets up the connector once → all licensed NathCorp users automatically get KB answers in Cowork.

---

### 3 — Minimum Rights Required

#### Approach 1 — M365 Knowledge Connector

| Side | Minimum Role | Why |
|------|-------------|-----|
| Microsoft 365 | **AI Administrator** | To deploy connectors in M365 Admin Center |
| ServiceNow | **`itil` role** on `cowork_kb_reader` account | Read access to KB articles |

#### Approach 2 — Custom Plugin (SKILL.md + MCP)

| Side | Minimum Role | Why |
|------|-------------|-----|
| Microsoft 365 | **AI Administrator** | To upload + deploy plugin via M365 Admin Center |
| Microsoft 365 | **M365 Copilot license** | Required for all Cowork users |
| ServiceNow | **Admin** (one-time only) | To create OAuth endpoint in Application Registry |
| ServiceNow | **`knowledge` role** on `cowork_plugin_svc` account | Read-only KB access for the connector |

> **For Rajesh** — you need **AI Administrator** role in NathCorp's M365 tenant to perform either approach.
> Ask Sonalika or the NathCorp M365 admin to assign this role to your account along with Cowork access.

---

## How Cowork Accesses ServiceNow KB — Key Concepts

### How M365 Connectors Work (Approach 1)
The connector acts like a **photocopier** — it crawls ServiceNow KB every 15 minutes and copies (indexes) articles into **Microsoft Graph** (Microsoft's own search index). When a user asks a question in Cowork, Cowork searches Microsoft's index — it does NOT contact ServiceNow directly at query time.

> *Proof from Microsoft docs: "The ServiceNow Knowledge Microsoft 365 Copilot connector enables organizations to index ServiceNow knowledge base (KB) articles into Microsoft 365 Copilot and search experiences."*
> — [ServiceNow Knowledge Connector Overview — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-overview)

### ServiceNow Already Has 42 KB Articles Out of the Box
Vishal's instance (`https://dev249650.service-now.com`) already has:
- **IT Knowledge Base: 35 articles** ← use this for demo
- KCS Knowledge Base (demo data): 4 articles
- Known Error: 3 articles

> Step 2.2 (Create 4 KB articles manually) is **NOT needed** — articles already exist. Connector will crawl IT Knowledge Base directly.

### What Connectors Can and Cannot Do

| Connector | KB Search | View Tickets | Create Tickets |
|-----------|-----------|--------------|----------------|
| ServiceNow Knowledge Connector | ✓ Yes | ✗ No | ✗ No |
| ServiceNow Tickets Connector | ✗ No | ✓ Yes | ✗ No |
| Custom MCP Connector | ✓ Yes | ✓ Yes | ✓ Yes |

> **Ticket creation requires MCP** — all M365 built-in connectors are READ ONLY.

---

## Three Approaches to Connect ServiceNow to Cowork (Updated)

| | Approach 1 | Approach 2 | Approach 3 |
|---|---|---|---|
| **Method** | M365 Knowledge Connector (built-in) | Custom Plugin (SKILL.md + MCP) | Custom Connector → Connect to MCP Server |
| **How it works** | Indexes KB into Microsoft Graph → Cowork reads index | Plugin package + MCP server queries ServiceNow live | Admin center custom connector points to ServiceNow MCP endpoint |
| **Coding required** | No | Yes — developer needed | No — admin config only |
| **Data freshness** | 15-min indexed | Real-time | Real-time |
| **Ticket creation** | ✗ No | ✓ Yes | ✓ Yes (if MCP tools support it) |
| **ServiceNow MCP needed** | No | Yes (custom server) | Yes (native ServiceNow MCP — Zurich version) |
| **Plugin (.zip) needed** | No | Yes | No |
| **Setup time** | ~1 hour | ~1 day | ~2 hours |
| **Best for** | **Demo today** | Production (custom) | **Production (recommended)** |

### Key Discovery — Custom Connector with MCP (Approach 3)
Microsoft admin center (`admin.microsoft.com → Copilot → Connectors → Created by your org → Add`) now supports:

- **Connect to MCP server** — Real-time, data stays in ServiceNow, federated access, NO indexing
- **Sync from data source** — Indexes data into Microsoft 365 (same as Approach 1)

> From Microsoft docs: *"Custom federated connectors let you securely connect Copilot to your data sources in real time. Data is retrieved into Copilot during queries but is not indexed or stored permanently."*

**AND ServiceNow now has a native MCP server built-in (Zurich version):**
- Native MCP endpoint available in every Now Assist and AI Native SKU
- ServiceNow MCP Server Console for publishing MCP tools
- OAuth-based authentication via Machine Identity Console
- This means NO custom MCP server code needed — ServiceNow exposes the endpoint natively

> This means for **production**: Use Approach 3 — Custom Connector → ServiceNow native MCP endpoint. No plugin, no custom code, real-time data, ticket creation possible.

**Do we need the plugin (Approach 2)?**
- For KB search only → **No** — Approach 1 or 3 is sufficient
- For ticket creation without coding → **Approach 3** (if ServiceNow Zurich MCP supports it)
- For full custom control → **Approach 2** (plugin + custom MCP)

---

## APPROACH 1 — M365 Knowledge Connector (For Today's Demo)

### STEP 1 — Confirm Prerequisites

- [ ] Frontier enabled in NathCorp tenant (Richa + Chandan sir)
- [ ] Cowork visible at `https://m365.cloud.microsoft` (Sonalika)
- [x] ServiceNow trial ready: `https://dev249650.service-now.com` (Vishal)
- [ ] KB articles published in ServiceNow (Step 2 below)

---

### STEP 2 — ServiceNow Setup (Share with Vishal)

**2.1 Install Knowledge API Plugin**

1. Log in to `https://dev249650.service-now.com` as admin
2. Go to **System Definition > Plugins**
3. Search: `Knowledge API`
4. Click **Install** → select latest version → **Install now**
5. Wait for installation to complete

**2.2 Publish KB Articles**

Go to **Knowledge > Knowledge Bases > Create New** and publish these 4 articles.
**All articles must be in Published state — draft articles will NOT be indexed.**

| Article Title | Short Description | Resolution Steps to write |
|---|---|---|
| VPN Troubleshooting | VPN not working / not connecting | 1. Check internet 2. Verify NathCorp credentials 3. Restart VPN client 4. Confirm server: vpn.nathcorp.com 5. Disable antivirus temporarily |
| Password Reset Guide | Forgot password / can't login | 1. Go to self-service portal 2. Click Forgot Password 3. Enter registered email 4. Follow reset link 5. Contact IT if not received |
| Email Not Working | Outlook not opening / emails not loading | 1. Restart Outlook 2. Check internet 3. File > Account Settings > Repair 4. Restart PC 5. Contact IT if persists |
| Laptop Running Slow | Computer slow / performance issues | 1. Restart laptop 2. Close unused apps 3. Run Disk Cleanup 4. Check Windows Update 5. Contact IT if still slow |

**2.3 Create Dedicated Service Account**

> Do NOT use admin credentials for the connector — create a separate read-only account.

1. Go to **User Administration > Users > New**
2. Fill in:
   - User ID: `cowork_kb_reader`
   - First Name: `Cowork`
   - Last Name: `Service`
   - Password: set a strong password and save it (needed in Step 3)
3. In **Roles** tab → add role: `itil`
4. Click **Save**

---

### STEP 3 — Deploy ServiceNow Knowledge Connector in M365 Admin Center

This indexes ServiceNow KB articles into Microsoft Search so Cowork can read them.

1. Go to [https://admin.microsoft.com](https://admin.microsoft.com)
2. Sign in with NathCorp **admin** account
3. Left pane → **Copilot > Connectors**
4. Click **Gallery** tab
5. Find **ServiceNow Knowledge** → click it → click **Add**

**Fill in connector settings:**

| Field | Value |
|-------|-------|
| Display Name | `ServiceNow Knowledge` |
| Instance URL | `https://dev249650.service-now.com` |
| Authentication | Basic |
| Username | `cowork_kb_reader` |
| Password | (password set in Step 2.3) |

6. Click **Next**

**Content settings:**
- Select all published IT knowledge bases
- Filter: leave default (published articles only)

**User settings:**
- Access: **Only people with access to this data source**

**Sync settings:**
- Full crawl: **Daily**
- Incremental crawl: **Every 15 minutes**

7. Click **Create**

> Indexing starts immediately. Wait **15–30 minutes** before testing.

**Validate:**
- Go back to connector in admin center
- Status shows **Ready** + article count = connector is working
- Cowork can now search ServiceNow KB articles when answering questions

---

### STEP 4 — Test in Cowork

1. Go to [https://m365.cloud.microsoft](https://m365.cloud.microsoft)
2. Sign in with NathCorp account
3. Click **Cowork** (or find under **All agents**)
4. Type: `VPN not working`
5. Cowork searches indexed SN KB + uses its own AI → returns numbered steps
6. Check bottom of response — should show citation from ServiceNow KB

**Also test:**
- `I forgot my password`
- `Outlook is not opening`
- `My laptop is very slow`

---

## APPROACH 2 — Custom Plugin with SKILL.md + MCP Connector (For Production) ✅ SELECTED

This is the real-time, proper integration. Cowork calls ServiceNow REST API live — no indexing delay.

**What you build:**

```
nathcorp-servicenow-plugin.zip        ← uploaded to prod via ticket
├── manifest.json                     ← defines the plugin + MCP connector URL
├── color.png                         ← 192x192 icon
├── outline.png                       ← 32x32 icon
└── skills/
    └── servicenow-kb-search/
        └── SKILL.md                  ← tells Cowork how to search KB and create tickets

nathcorp-mcp-server/                  ← hosted on Azure App Service
├── server.js                         ← Node.js MCP server (production-ready)
├── package.json
├── .env.example
├── .gitignore
└── Deploy-ToAzure.ps1                ← one-click Azure deployment script
```

**Progress:**

| Step | Task | Status |
|------|------|--------|
| 1 | ServiceNow OAuth setup | ✅ Done |
| 2 | Service account (`cowork_plugin_svc`) with `itil` + `knowledge` roles | ✅ Done |
| 3 | KB User Criteria — Cowork Plugin Service Account added to IT KB Can Read | ✅ Done |
| 4 | OAuth auth scope (`useraccount`) set | ✅ Done |
| 5 | API tested — ticket creation confirmed (INC0010001) | ✅ Done |
| 6 | MCP server built (production-ready) + tested locally | ✅ Done |
| 7 | Plugin package built + uploaded to test tenant | ✅ Done |
| 8 | Azure resources created (Resource Group, App Service Plan B1, Web App) | ✅ Done |
| 9 | MCP server deployed to Azure — live and tested (INC0010004 created) | ✅ Done |
| 10 | manifest.json updated — MCP URL + `authorization: None` added | ✅ Done |
| 11 | SKILL.md updated to v2.0 — explicit tool call instructions for KB search + ticket creation | ✅ Done |
| 12 | MCP server updated to JSON-RPC 2.0 protocol — required by Cowork | ✅ Done |
| 13 | MCP server v2.0.0 redeployed to Azure — JSON-RPC tested live (INC0010006) | ✅ Done |
| 14 | Plugin v2.0.0 uploaded to Cowork — working in production ✅ | ✅ Done |
| 15 | Full end-to-end flow testing | 🔄 In Progress |

**Azure MCP Server — Live ✅**

| Item | Value |
|------|-------|
| URL | `https://nathcorp-mcp-server.azurewebsites.net` |
| Resource Group | `nathcorp-cowork-rg` |
| App Service Plan | `nathcorp-cowork-plan` (B1 Linux) |
| Runtime | Node 22 LTS |
| Subscription | MPN - MTT - APP - 5 (NathCorp) |
| Protocol | JSON-RPC 2.0 (MCP standard) |
| Health check | `{"status":"ok"}` ✅ |
| `tools/list` | Returns both tools ✅ |
| `tools/call search_kb_articles` | Returns ServiceNow KB articles ✅ |
| `tools/call create_incident` | INC0010006 created successfully ✅ |
| Plugin in Cowork | v2.0.0 active — working ✅ |

**Key Fix — Why Plugin Started Working:**

The MCP server was originally using custom HTTP POST endpoints (`/tools/search_kb_articles`) which Cowork could not understand. Cowork requires the standard **JSON-RPC 2.0 protocol**:

```
Cowork sends → POST / {"jsonrpc":"2.0","method":"tools/list","id":1}
Cowork sends → POST / {"jsonrpc":"2.0","method":"tools/call","params":{...},"id":2}
```

After updating `server.js` to handle `tools/list` and `tools/call` in JSON-RPC 2.0 format and redeploying to Azure — Cowork connected successfully and the plugin started working.

---

### STEP 1 — Set Up ServiceNow OAuth (Confirmed & Tested ✓)

**1.1 Create the OAuth Application user (service account)**

1. Go to **All** → **User Administration → Users → New**
2. Fill in:
   - User ID: `cowork_plugin_svc`
   - First name: `Cowork`
   - Last name: `Plugin Service`
   - Identity type: **Machine** (auto-enables Web Service Access Only)
   - Internal Integration User: **checked ✓**
   - Active: checked ✓
3. Click **Submit**
4. On the saved record → go to **Roles** tab → click **Edit** → add both roles:
   - `knowledge` → for reading KB articles ✓ Done
   - `itil` → for creating incidents/tickets ✓ Add this
5. Click **Save**

**1.2 Create the Inbound OAuth Integration**

1. Log in to `https://dev249650.service-now.com` as admin
2. Go to **All** → search `Inbound integrations` → open it
3. Click **New integration** (top right)
4. Select: **OAuth - Client credentials grant**
   > Do NOT use "[Deprecated UI] Create an OAuth API endpoint for external clients" — use New Inbound Integration Experience → Client credentials grant
5. Fill in:

| Field | Value |
|-------|-------|
| Name | `CoworkPlugin` |
| Provider name | `Microsoft` |
| OAuth application user | `cowork_plugin_svc` |
| Client ID | Auto-generated — **copy and save it** |
| Client secret | Auto-generated — **copy and save it (cannot be viewed again)** |
| Active | checked ✓ |

6. Scroll down → **Advanced options** → change Access token lifespan from `1800` → **`43200`** (12 hours)
7. Auth scope → select **`useraccount`** → click **Save**

> **Important:** Do NOT skip auth scope — without it, API calls will fail with "Access to unscoped api is not allowed"

**1.3 Enable Client Credentials grant type (required system property)**

> Without this, the OAuth client credentials grant will NOT work.

1. Go to **All** → type `sys_properties.list` → press Enter
2. Check if `glide.oauth.inbound.client.credential.grant_type.enabled` exists
3. If not found → click **New** and create it:

| Field | Value |
|-------|-------|
| Name | `glide.oauth.inbound.client.credential.grant_type.enabled` |
| Type | `true\|false` |
| Value | `true` |
| Description | `Enable OAuth client credentials grant type for inbound integrations` |

4. Click **Submit**

**Credentials to save (needed for MCP connector config):**
- Client ID: `d18b020ea85841079e001bfc71da7d22`
- Client Secret: (saved separately — do not write here)

---

### STEP 2 — Create the SKILL.md File

Create a file called `SKILL.md` — this is the instruction that tells Cowork when and how to search ServiceNow KB.

```markdown
---
name: servicenow-kb-search
description: |
  Searches the NathCorp ServiceNow knowledge base for IT issue resolution steps.
  Use when user asks about IT problems, errors, or issues such as:
  "VPN not working", "can't connect to VPN", "forgot password",
  "Outlook not opening", "email not working", "laptop slow",
  "computer running slow", "can't login", "network issue".
  Always search ServiceNow KB first before answering from general knowledge.
license: MIT
metadata:
  author: NathCorp IT Team
  version: "1.0"
---

# ServiceNow KB Search — NathCorp IT Support

## What This Skill Does

Searches the NathCorp ServiceNow knowledge base for articles matching
the user's IT issue and returns clear, numbered resolution steps.
Combines KB article content with AI knowledge for the best possible answer.

## Workflow

1. Extract the IT issue or problem from the user's message
2. Use the `search_kb_articles` tool to search ServiceNow KB with the issue as query
3. Read the returned KB articles
4. Combine KB article content with your own AI knowledge
5. Generate clear, numbered resolution steps
6. Present the response in a friendly, professional tone
7. At the end always ask: "Did this resolve your issue? Please reply Yes or No."
8. If user replies No: respond with "I understand. I will raise a support ticket
   for you. Our IT team will get back to you shortly."

## Output Format

Here are the resolution steps for **[issue name]**:

1. [Step 1]
2. [Step 2]
3. [Step 3]
...

*(Source: ServiceNow KB — [Article Title] + AI)*

Did this resolve your issue? Please reply Yes or No.

## If No KB Article Found

If `search_kb_articles` returns no results, still answer from AI knowledge and say:
"Note: This answer is based on general knowledge. Our IT team will verify if needed."

## Authentication

If the user is not authenticated to ServiceNow, respond with:
"I need to connect to the NathCorp knowledge base. Please sign in when prompted."
```

---

### STEP 3 — Create the manifest.json

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/vDevPreview/MicrosoftTeams.schema.json",
  "manifestVersion": "devPreview",
  "version": "1.0.0",
  "id": "YOUR-GUID-HERE",
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
    "full": "Connects Cowork to NathCorp ServiceNow knowledge base to provide IT issue resolution steps using KB articles and AI."
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
      "id": "servicenow-kb-connector",
      "displayName": "NathCorp ServiceNow KB",
      "description": "Searches ServiceNow knowledge base articles for IT resolutions",
      "toolSource": {
        "remoteMcpServer": {
          "mcpServerUrl": "https://dev249650.service-now.com/api/mcp",
          "authorization": {
            "type": "OAuthPluginVault",
            "referenceId": "nathcorp-servicenow-oauth"
          }
        }
      }
    }
  ]
}
```

> Generate a GUID for `id` by running in PowerShell: `[guid]::NewGuid()`

---

### STEP 4 — Create the Folder Structure

Run this in PowerShell to create the structure:

```powershell
# Create plugin folder structure
New-Item -ItemType Directory -Path "NathCorpCoworkPlugin\skills\servicenow-kb-search" -Force

# Create manifest.json (paste content from Step 3)
# Create SKILL.md inside skills\servicenow-kb-search\ (paste content from Step 2)
# Add color.png (192x192) and outline.png (32x32) icons
```

Final folder structure:
```
NathCorpCoworkPlugin\
├── manifest.json
├── color.png
├── outline.png
└── skills\
    └── servicenow-kb-search\
        └── SKILL.md
```

---

### STEP 5 — Package the Plugin

Run in PowerShell from inside `NathCorpCoworkPlugin\` folder:

```powershell
Compress-Archive -Path manifest.json, color.png, outline.png, skills `
  -DestinationPath NathCorpServiceNowPlugin.zip
```

---

### STEP 6 — Upload, Publish & Deploy Plugin (Tested & Confirmed ✓)

**6.1 Upload the plugin (Admin)**
1. Go to [https://admin.cloud.microsoft](https://admin.cloud.microsoft)
2. Left sidebar → **Agents** → **All agents**
3. Click the **`...`** (three dots) button in the top right corner
4. Click **+ Add agent**
5. Upload `NathCorpServiceNowPlugin.zip`
6. Wizard opens — **Step 1: Upload agent** completes automatically ✓

**6.2 Publish to users**
After upload, the wizard moves to **"Publish agent to selected users"**:
- **Publish to users** → Select **Specific users/groups** → add target users (e.g. `rajesh.alda@nathcorp.com` for test)
- **Install (optional)** → Select **None** (users install themselves) OR **Specific users** to auto-push
- Click **Next** → **Apply template** → Next → **Accept permissions** → Next → **Review & finish** → **Publish**

**6.3 View the uploaded plugin in admin center (Confirmed steps ✓)**

The plugin does NOT appear under Agents → All agents after upload.
It is managed under **Integrated Apps**:

1. Go to [https://admin.microsoft.com](https://admin.microsoft.com)
2. Left sidebar → **Settings** → **Integrated apps**
3. Click the **Available apps** tab
4. Search `NathCorp` — plugin appears with:
   - **Availability Status**: Specific users in the organization can install
   - **Deployment Status**: Not deployed (means not yet auto-pushed to users)
5. Click on **NathCorp ServiceNow KB** to open details panel
6. Details panel shows: App type = Custom, Assigned users, Actions

**6.4 Deploy (auto-push) the plugin to users**

From the details panel in Integrated Apps:
- Click **Deploy app** → plugin is automatically installed for assigned users
- Deployment Status changes from **Not deployed** → **Deployed**
- Users do NOT need to manually find or add the plugin

> **What "Not deployed" means:** The plugin is published and available for users to install themselves,
> but the admin has not yet pushed it automatically. Click "Deploy app" to push it.

**6.5 Verify plugin is active in Cowork (User)**
1. Open Cowork at [https://m365.cloud.microsoft](https://m365.cloud.microsoft)
2. Start a new conversation
3. Open the **Sources & Skills** panel (side panel — only visible during active conversation)
4. Find `NathCorp ServiceNow KB` → confirm toggle is **ON**
5. Test: type `VPN not working` → skill triggers → returns numbered resolution steps

---

### STEP 7 — Build and Deploy MCP Server to Azure App Service ✅ Done

The MCP server is the Node.js backend that Cowork calls to search KB and create tickets.
Code location: `C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\nathcorp-mcp-server\`

**What the MCP server does:**

```
Cowork → POST / {"method":"tools/list"}                → returns tool list (JSON-RPC 2.0)
Cowork → POST / {"method":"tools/call","name":"search_kb_articles"}  → queries ServiceNow KB
Cowork → POST / {"method":"tools/call","name":"create_incident"}     → creates ticket
Cowork → GET  /                                        → health check
```

**Protocol:** JSON-RPC 2.0 (required by Cowork — NOT custom REST endpoints)

**Confirmed working (tested 2026-05-21):**
- `search_kb_articles` → returns KB articles from ServiceNow ✅
- `create_incident` → created INC0010001 → INC0010006 ✅
- JSON-RPC 2.0 `tools/list` + `tools/call` + `initialize` all working ✅

---

**7.1 Prerequisites**

```powershell
# Check Azure CLI is installed
az --version
# Expected: azure-cli 2.86.0 or higher ✅

# Login to Azure (NathCorp tenant)
az login --tenant nathcorp.com

# Set correct subscription
az account set --subscription "ab16955e-1117-4633-88fe-27dd48acafc1"

# Verify correct subscription is active
az account show --query "{name:name, id:id}" -o table
# Expected: MPN - MTT - APP - 5
```

---

**7.2 Create Azure Resources** ✅ Already done — commands saved for reference

```powershell
# Step 1 — Create Resource Group (East Asia region)
az group create --name nathcorp-cowork-rg --location eastasia

# Step 2 — Create App Service Plan (B1 Linux — NOT free F1)
az appservice plan create `
  --name nathcorp-cowork-plan `
  --resource-group nathcorp-cowork-rg `
  --sku B1 `
  --is-linux

# Step 3 — Create Web App (Node 22 LTS)
az webapp create `
  --name nathcorp-mcp-server `
  --resource-group nathcorp-cowork-rg `
  --plan nathcorp-cowork-plan `
  --runtime "NODE:22-lts"

# Step 4 — Set startup command
az webapp config set `
  --name nathcorp-mcp-server `
  --resource-group nathcorp-cowork-rg `
  --startup-file "node server.js"
```

**Azure Resources — Live ✅**

| Resource | Name | Value |
|----------|------|-------|
| Resource Group | `nathcorp-cowork-rg` | East Asia |
| App Service Plan | `nathcorp-cowork-plan` | B1 Linux |
| Web App | `nathcorp-mcp-server` | Running ✅ |
| Runtime | Node 22 LTS | Set ✅ |
| URL | `https://nathcorp-mcp-server.azurewebsites.net` | Live ✅ |
| Subscription | MPN - MTT - APP - 5 | `ab16955e-1117-4633-88fe-27dd48acafc1` |

---

**7.3 Set Environment Variables (Secrets)**

> ⚠️ Special characters (`$`, `|`) in client secret break PowerShell CLI command.
> Set these manually via **Azure Portal → nathcorp-mcp-server → Configuration → Application settings**

| Setting Name | Value |
|-------------|-------|
| `SNOW_INSTANCE_URL` | `https://dev249650.service-now.com` |
| `SNOW_CLIENT_ID` | `d18b020ea85841079e001bfc71da7d22` |
| `SNOW_CLIENT_SECRET` | (see .env file — do not write here) |
| `NODE_ENV` | `production` |

**Via Azure Portal:**
1. Go to https://portal.azure.com
2. Search `nathcorp-mcp-server` → open Web App
3. Left sidebar → **Configuration** → **Application settings**
4. Click **+ New application setting** for each row above
5. Click **Save** → **Continue**

---

**7.4 Enable Build During Deployment**

The `.deployment` file at root of `nathcorp-mcp-server/` must contain:
```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```
> This tells Azure to run `npm install` automatically on each deploy. Without this, `Cannot find module 'dotenv'` error occurs.

---

**7.5 Deploy Code to Azure**

```powershell
# Navigate to MCP server folder
cd "C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\nathcorp-mcp-server"

# Deploy (Azure runs npm install automatically via .deployment file)
az webapp up --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg --runtime "NODE:22-lts"

# Expected output:
# Build: Detected Node.js app
# Build: Running npm install
# Build successful. Time: ~52s
# Site started successfully. Time: ~84s
```

---

**7.6 Verify Deployment — JSON-RPC 2.0**

```powershell
# 1. Health check
Invoke-RestMethod -Uri "https://nathcorp-mcp-server.azurewebsites.net/"
# Expected: { status: "ok", service: "NathCorp MCP Server", version: "2.0.0" }

# 2. MCP tools/list (JSON-RPC 2.0)
Invoke-RestMethod -Method POST `
  -Uri "https://nathcorp-mcp-server.azurewebsites.net/" `
  -ContentType "application/json" `
  -Body '{"jsonrpc":"2.0","method":"tools/list","id":1}'
# Expected: returns search_kb_articles + create_incident tools

# 3. KB search via JSON-RPC 2.0
Invoke-RestMethod -Method POST `
  -Uri "https://nathcorp-mcp-server.azurewebsites.net/" `
  -ContentType "application/json" `
  -Body '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search_kb_articles","arguments":{"query":"VPN"}},"id":2}'
# Expected: returns ServiceNow KB articles about VPN

# 4. View live logs (run in separate terminal)
az webapp log tail --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg
```

**Your MCP Server URL:**
```
https://nathcorp-mcp-server.azurewebsites.net
```

---

### STEP 8 — Update manifest.json + SKILL.md + Repackage ✅ Done

**manifest.json** — `agentConnectors` added with live Azure MCP URL:

```json
"agentConnectors": [
  {
    "id": "servicenow-mcp",
    "type": "mcp",
    "url": "https://nathcorp-mcp-server.azurewebsites.net"
  }
]
```

**SKILL.md v2.0** — Updated to production-ready with explicit tool call instructions:
- Step 1: Always call `search_kb_articles` tool first
- Step 5: If user says No → call `create_incident` tool with `short_description` + `description`
- Cowork writes ticket description intelligently — summarises issue + steps tried (not copy-paste)
- Hard rules added: never skip search, never fake a ticket, always call the tool

**Plugin repackaged** — `NathCorpServiceNowPlugin.zip` (final, 2793 bytes) ✅

---

### STEP 9 — Upload Final Plugin to NathCorp Prod Tenant ⬜ Next

> Plugin upload to production requires a change ticket — already raised.
> Upload the final .zip **once** — no modifications after upload.

1. Go to [https://admin.cloud.microsoft](https://admin.cloud.microsoft)
2. Left sidebar → **Agents** → **All agents**
3. Click **`...`** (three dots) → **+ Add agent**
4. Upload `NathCorpServiceNowPlugin.zip` from `C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\`
5. Wizard → Publish to users → select **Entire organization**
6. Click **Deploy app** → plugin pushed to all licensed NathCorp users automatically

**After deployment — what users experience:**
```
User: "VPN not working"
Cowork: [searches ServiceNow KB + AI] → numbered resolution steps
Cowork: "Did this resolve your issue? Yes or No?"
User: "No"
Cowork: Shows TOOL APPROVAL dialog — "Create Support Ticket [Approve] [Reject]"
        → Click "Show parameters" to see auto-filled ticket JSON
           (user name, email, department + full description of steps tried)
        → Click Approve (or ▼ → "Always allow Create incident" to skip permanently)
Cowork: [calls create_incident on MCP server → ServiceNow creates ticket]
Cowork: "Ticket INC00XXXXX has been raised. IT Support will contact you shortly."
```

> **Tool Approval dialog — what it shows:**
> Cowork captures the logged-in user's identity automatically from M365:
> - Name, email, department, company (e.g. "Rajesh Alda, Rajesh.Alda@nathcorp.com, Associate Software Engineer, Cloud & Infra, NathCorp India")
> - Full description of the issue and all troubleshooting steps already tried — written by AI, not the user
>
> **"Always allow Create incident"** — clicking the dropdown ▼ next to Approve and selecting this option removes the approval dialog for all future ticket creations. Useful after first use.

---

## APPROACH 3 — Custom Connector → ServiceNow Native MCP (Production — Paid License Required)

This is the **recommended production approach** — real-time, no plugin needed, no custom code, ticket creation possible.

> ⚠️ **NOT available on developer/trial instances.**
> MCP Server Console (`sn_mcp_server`) is a **PAID plugin** — requires Now Assist license.
> Confirmed: Vishal's trial instance shows **"Unavailable for Instance"** in Application Manager.
> Use this approach only with NathCorp's licensed production ServiceNow instance.

**Proof from ServiceNow Application Manager:**
- Plugin: `sn_mcp_server` — Pricing: **Paid**
- System Requirements: *"Now Assist is required to use MCP Server Console"*
- Status on trial instance: **Unavailable for Instance**

**How it works:**
```
User asks question in Cowork
        │
        ▼
Cowork → M365 Custom Connector (federated)
        │
        ▼
ServiceNow Native MCP Server (paid — Now Assist required)
        │
        ▼
Searches KB + Can create tickets live
        │
        ▼
Returns real-time answer to Cowork
```

**Why better than Approach 1 and 2:**

| | Approach 1 | Approach 2 | Approach 3 |
|--|------------|------------|------------|
| Real-time data | ✗ No | ✓ Yes | ✓ Yes |
| Ticket creation | ✗ No | ✓ Yes | ✓ Yes |
| Custom code needed | No | Yes — developer | No |
| Plugin (.zip) needed | No | Yes | No |
| Setup complexity | Low | High | Medium |
| License required | No | No | **Yes — Now Assist (Paid)** |
| Works on trial instance | ✓ Yes | ✓ Yes | ✗ No |

**Prerequisites (Production only):**
- ServiceNow **Australia or Zurich** version
- **Now Assist license** (paid SKU) — NOT available on free developer instance
- M365 admin access (AI Administrator role)
- `sn_mcp_server` plugin installed from ServiceNow Store

---

### STEP 1 — Install MCP Server Console (Production Instance Only)

1. Log in to production ServiceNow instance as admin
2. Go to **Admin** → **Application Manager**
3. Search `Model Context Protocol Server` (App ID: `sn_mcp_server`)
4. Click **Install** (requires Now Assist license — will show "Unavailable for Instance" on trial)
5. Roles added automatically: `sn_mcp_server.admin`, `sn_mcp_server.tools_admin`, `sn_mcp_server.viewer`

---

### STEP 2 — Create MCP Server in ServiceNow

1. Go to **All** → search `MCP Server Console` → open it
2. Click **New Server** or use the **Quickstart** option
3. Quickstart includes a pre-built server for **incident lookup and summarization**
4. Add tools:
   - **search_kb_articles** — searches Knowledge Base
   - **create_incident** — creates a ticket (if Now Assist supports write operations)
5. Set authentication: **OAuth 2.0** → use the `CoworkPlugin` OAuth app we created
6. Click **Publish** → note the **MCP endpoint URL** (format: `https://dev249650.service-now.com/sncapps/mcp-server/mcp/sn_mcp_server_default`)

---

### STEP 3 — Create Custom Connector in M365 Admin Center

1. Go to `https://admin.microsoft.com`
2. Left sidebar → **Copilot** → **Connectors**
3. Click **Gallery** tab → scroll to **Created by your org** → click **Add**
4. Select **Connect to MCP server** (real-time, federated)
5. Fill in:

| Field | Value |
|-------|-------|
| Display name | `NathCorp ServiceNow MCP` |
| MCP endpoint URL | `https://dev249650.service-now.com/sncapps/mcp-server/mcp/sn_mcp_server_default` |
| Authentication type | OAuth 2.0 |
| Client ID | `d18b020ea85841079e001bfc71da7d22` |
| Client Secret | (saved from ServiceNow OAuth setup) |

6. Check the **Notice** checkbox → click **Create**

---

### STEP 4 — Test in Cowork

1. Go to `https://m365.cloud.microsoft`
2. Start a new conversation
3. Type: `VPN not working` → Cowork calls ServiceNow MCP live → real-time answer
4. Type: `My issue is not resolved, please create a ticket` → Cowork creates incident in ServiceNow

> **Note:** Ticket creation depends on whether Now Assist write tools are enabled in the MCP Server Console.

---

### Important Notes for Approach 3

- **MCP Server Console** is a **new application in Australia release** — confirmed for Vishal's instance ✓
- Requires **Now Assist plugin** — check if available in trial instance
- If Now Assist not available → use Approach 1 for demo, plan Approach 3 for production with licensed instance
- No SKILL.md or plugin (.zip) needed — connector handles everything
- Data is **never stored in Microsoft** — stays in ServiceNow (federated access)

---

## What the Demo Will Look Like for Raj Sir

**In Cowork at `https://m365.cloud.microsoft`:**

> **User:** VPN not working
>
> **Cowork:** Here are the resolution steps for **VPN not working**:
>
> 1. **Check your internet connection** — Ensure you are connected before launching VPN.
> 2. **Verify your credentials** — Use your NathCorp domain username and password. Ensure CAPS LOCK is off.
> 3. **Restart the VPN client** — Close the application completely and reopen it.
> 4. **Check the VPN server address** — Confirm it is set to `vpn.nathcorp.com`.
> 5. **Disable antivirus/firewall temporarily** — Some tools block VPN. Disable and retry.
> 6. **Restart your device** — A full restart resolves many connectivity issues.
>
> *(Source: ServiceNow KB — VPN Troubleshooting Guide + AI)*
>
> Did this resolve your issue? Please reply Yes or No.
>
> **User:** No
>
> **Cowork:** I understand. I will raise a support ticket for you. Our IT team will get back to you shortly.

---

## Nidhi's Responsibility — System Prompt / SKILL.md Instructions

Nidhi needs to refine the SKILL.md instructions (Step 2 of Approach 2) and the system-level prompt. Here is the final version for her:

```
You are an IT support assistant for NathCorp.
When a user reports an IT problem or asks a technical question:

1. Search the ServiceNow knowledge base for a relevant resolution article.
2. Combine the KB article content with your own AI knowledge to form the best answer.
3. Always respond with clear, numbered resolution steps.
4. Keep the tone friendly and professional.
5. After giving the resolution steps, always ask:
   "Did this resolve your issue? Please reply Yes or No."
6. If the user says No — respond with:
   "I understand. I will raise a support ticket for you.
    Our IT team will get back to you shortly."

If no relevant KB article is found, still use your AI knowledge to
provide the best possible resolution steps, and mention:
"Note: This answer is based on general knowledge.
Our IT team will verify if needed."
```

---

## Ticket Creation — Via MCP (Part of Approach 2)

When user says "No" → future full flow:

```
User says "No"
      │
      ▼
Cowork custom skill triggers ticket creation
      │
      ▼
Calls ServiceNow REST API
POST https://dev249650.service-now.com/api/now/table/incident
      │
      ▼
Creates incident with:
- short_description: user's original question
- description: conversation summary
- priority: 3 (Medium)
- assignment_group: IT Support
      │
      ▼
Returns ticket number to user:
"Your ticket INC0012345 has been created."
```

**Needs (implement after demo):**
- Add `create_incident` tool to the MCP connector
- Add ticket creation workflow to SKILL.md
- Handle user confirmation before creating ticket

---

## Production vs Non-Production

| | Non-Production (Demo Today) | Production (After Demo) |
|---|---|---|
| ServiceNow | Trial: `https://dev249650.service-now.com` | Licensed production instance |
| Integration method | Approach 1: M365 Knowledge Connector | Approach 2: Custom Plugin (SKILL.md + MCP) |
| Authentication | Basic Auth | OAuth 2.0 via OAuthPluginVault |
| KB Articles | 4 manually created sample articles | All existing published IT KB articles |
| Data freshness | 15-min indexed | Real-time live API |
| Cowork access | Frontier preview | Generally Available when released |
| Ticket creation | Not configured | MCP tool: `create_incident` |
| Plugin deployment | Sideloaded (test only) | Deployed org-wide via M365 Admin Center |
| Monitoring | Not needed | Microsoft Purview audit logs |
| Users | Test users only | All NathCorp employees |

---

## Prerequisites Checklist

### For Demo Today (Approach 1)
- [x] Frontier enabled in NathCorp tenant (Richa + Chandan sir) — Done ✓
- [x] Cowork configured at `https://m365.cloud.microsoft` (Sonalika) — Done ✓
- [x] ServiceNow trial ready: `https://dev249650.service-now.com` (Vishal) — Done ✓
- [x] Cowork access received by Rajesh — Done ✓
- [ ] Knowledge API plugin installed in ServiceNow (Step 2.1)
- [ ] 4 KB articles published in ServiceNow (Step 2.2)
- [ ] `cowork_kb_reader` service account created (Step 2.3)
- [ ] M365 admin access to deploy connector (Step 3)
- [ ] Connector status shows **Ready** before testing (Step 3)

### For Production (Approach 2)
- [ ] Developer available to build and host MCP server
- [ ] ServiceNow OAuth endpoint configured (Step 1)
- [ ] `referenceId` obtained from Microsoft Partner Center for OAuth
- [ ] SKILL.md written and tested (Step 2)
- [ ] Plugin packaged and sideloaded for testing (Steps 3–6)
- [ ] Deployed org-wide via M365 Admin Center (Step 7)

---

## References

- [Copilot Cowork Overview — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/)
- [Get Started with Cowork — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/get-started)
- [Available Plugins for Cowork — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-available-plugins)
- [Build Plugins for Cowork — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development)
- [Manage Plugins for Cowork — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-manage-plugins)
- [Deploy ServiceNow Knowledge Connector — Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-deployment)
- [Cowork Plugin Template for Enterprise APIs — Troy Taylor](https://troystaylor.com/power%20platform/mcp/2026-05-06-cowork-plugin-template.html)
- [ServiceNow MCP Connector for Power Platform — Troy Taylor](https://troystaylor.com/power%20platform/custom%20connectors/2026-02-12-servicenow-mcp-connector.html)
- [Copilot Cowork: Now Available in Frontier — Microsoft Blog](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/30/copilot-cowork-now-available-in-frontier/)
- [Copilot Cowork Plugins & Integrations — Microsoft Blog](https://www.microsoft.com/en-us/microsoft-365/blog/2026/05/05/copilot-cowork-from-conversation-to-action-across-skills-integrations-and-devices/)

---

*NathCorp Internal — ServiceNow + Copilot Cowork Integration | Presentation to Raj Sir: 2026-05-21*
