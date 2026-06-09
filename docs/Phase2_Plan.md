# NathCorp Cowork + ServiceNow — Phase 2 Plan
**Author:** Rajesh (rajesh.alda@nathcorp.com)
**Created:** 2026-05-29
**Updated:** 2026-05-31

---

## What We Confirmed During Testing ✅

| Test | Result |
|------|--------|
| Claude Desktop → Azure MCP (remote URL) | ✅ Working |
| Claude Desktop → search_kb_articles | ✅ Working |
| Claude Desktop → create_incident | ✅ INC0010015 created |
| Claude Desktop → get_open_incidents | ✅ 56 tickets fetched with caller_name + caller_email |
| Claude Desktop → graph_user_read_write (READ) | ✅ Adele Vance profile fetched |
| Claude Desktop → graph_user_read_write (WRITE) | ✅ Business phone updated to +1 425 555 0100 |
| Claude Desktop → update_incident (comment) | ✅ Work note posted on INC0010013 |
| Claude Desktop → update_incident (state=6 Resolved) | ✅ INC0010016 resolved with close_code |
| Claude Desktop → update_incident (assignment_group) | ✅ Tickets escalated to Service Desk |
| Phase 1 full flow on Claude Desktop | ✅ Working end-to-end |
| Phase 2 full flow on Claude Desktop | ✅ INC0010016 — Adele's phone updated + ticket resolved |
| server-local.js | ✅ Deleted — not needed |

---

## MCP Server — What Is Built (v3.0.0)

| Tool | Status | What it does |
|------|--------|-------------|
| `search_kb_articles` | ✅ Built + tested | Search ServiceNow KB |
| `create_incident` | ✅ Built + tested | Create ServiceNow ticket |
| `get_open_incidents` | ✅ Built + tested | Fetch all open tickets — includes caller_name + caller_email |
| `update_incident` | ✅ Built + tested | Update comment, state, assigned_to, assignment_group. Auto adds close_code when state=6 |
| `graph_user_read_write` | ✅ Built + tested | Read/write Entra ID user via Graph API (User.ReadWrite.All) |

---

## Bugs Fixed During Testing

| Bug | Root Cause | Fix Applied |
|-----|-----------|------------|
| `caller_email` always empty | Missing `caller_id.email` field + missing `sysparm_display_value=true` | Added both to `get_open_incidents` query |
| Graph API failing on Azure | Azure container crashing — certificate update timeout | Added `WEBSITES_INCLUDE_CLOUD_CERTS=true` app setting |
| State 6 (Resolved) failing | ServiceNow requires `close_code` + `close_notes` — was missing | Auto-set `close_code: "Solution provided"` when state=6 |
| KB returning empty in Claude Desktop | Cached old tools list | Disconnect + reconnect azure-mcp connector in Claude Desktop settings |

---

## ServiceNow Groups (Confirmed in Dev Instance)

| Group | Used For |
|-------|---------|
| **Service Desk** | Default escalation group — tickets with no KB match |
| **Incident Management** | Major incident escalation |
| **ITSM Engineering** | Higher authority escalation |
| **Help Desk** | General helpdesk queries |
| **Network** | Network related issues |

---

## Phase 2 — Full Flow

### Step 1 — Cowork Monitors the Queue
- Cowork runs on a scheduled prompt every hour (Microsoft Cowork only — not Claude Desktop)
- Calls `get_open_incidents` → fetches all tickets where state != Resolved and state != Closed

---

### Step 2 — Cowork Reads Each Ticket and Decides

| Category | Example | What Cowork Does |
|----------|---------|-----------------|
| M365 task — Cowork CAN fix | Update phone, schedule meeting, create document, send email, Teams post, SharePoint folder | Identify user → resolve → close |
| Non-M365 IT issue — KB available | WiFi, VPN, login issue | Search KB → post steps in comment |
| Non-M365 IT issue — No KB found | Unknown/complex issue | Post comment → assign to Service Desk |

---

### Step 3 — For Tickets Cowork CAN Work On (M365 Tasks)

1. **Identify the user**
   - Read `caller_email` from ticket (now correctly returned by API)
   - Call `graph_user_read_write` → get full user profile (name, email, department, job title)

2. **Assign ticket to Cowork**
   - Calls `update_incident` → sets state to "2" (In Progress)
   - Posts work note: "Ticket assigned to Cowork for automated resolution"

3. **Cowork works on the ticket**
   - Uses built-in M365 skills — email, Teams, calendar, SharePoint, documents, Graph API
   - Uses user details from Graph API for personalized actions

4. **Update comment with details**
   - Calls `update_incident` → posts work notes with exactly what was done and for whom

5. **Mark ticket as Resolved**
   - Calls `update_incident` → sets state to "6" (Resolved)
   - `close_code` and `close_notes` auto-populated by server
   - Posts closing comment: "Issue resolved automatically by Cowork"

---

### Step 4 — For Tickets Cowork CANNOT Work On (Non-M365)

#### If KB article found:
1. Calls `search_kb_articles` → finds matching KB article
2. Calls `update_incident` → posts KB resolution steps in work notes
3. Work note: "Suggested resolution from NathCorp KB: [steps]. Please follow these steps."
4. Ticket remains open for employee to follow steps

#### If NO KB article found:
1. Calls `update_incident` → posts work note: "No KB article found. Escalating to Service Desk."
2. Calls `update_incident` → sets `assignment_group` to "Service Desk"
3. Service Desk team picks it up manually

---

## Complete Flow Diagram

```
Cowork checks queue every hour (scheduled prompt — Microsoft Cowork only)
                ↓
        get_open_incidents
        (all non-resolved tickets + caller_name + caller_email)
                ↓
    Read each ticket description
                ↓
    ┌───────────────────────────┐
    │   Is it an M365 task?     │
    └───────────────────────────┘
           ↓                    ↓
          YES                   NO
           ↓                    ↓
  graph_user_read_write    search_kb_articles
  (get user profile)              ↓              ↓
           ↓               KB found?       KB NOT found
  update_incident               ↓                ↓
  (In Progress)          Post KB steps     update_incident
           ↓              in comment      (assign to
  Do M365 work                            Service Desk)
           ↓
  update_incident
  (work notes — what was done)
           ↓
  update_incident
  (state=6 Resolved — close_code auto added)
```

---

## Azure Deployment Commands

### Deploy Updated server.js to Azure
```powershell
cd "C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\nathcorp-mcp-server"
az webapp up --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg --runtime "NODE:22-lts"
```

### Restart Azure App Service
```powershell
az webapp restart --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg
```

### Add/Update Environment Variables in Azure
```powershell
az webapp config appsettings set `
  --name nathcorp-mcp-server `
  --resource-group nathcorp-cowork-rg `
  --settings `
  AZURE_CLIENT_ID="<value>" `
  AZURE_TENANT_ID="<value>" `
  AZURE_CLIENT_SECRET="<value>" `
  WEBSITES_INCLUDE_CLOUD_CERTS=true
```

### View Live Azure Logs
```powershell
az webapp log tail --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg
```

### Download Azure Logs
```powershell
az webapp log download --name nathcorp-mcp-server --resource-group nathcorp-cowork-rg --log-file "azure-logs.zip"
```

### Verify Azure Server is Running
```powershell
curl -s https://nathcorp-mcp-server.azurewebsites.net/
# Expected: {"status":"ok","service":"NathCorp MCP Server","version":"3.0.0"}
```

---

## Plugin Update Process — How To Upload New Version

### Important Findings
- **Microsoft 365 Admin Center → Integrated Apps** — No update button for custom uploaded plugins. Only "Block app" available. ❌
- **Microsoft 365 Admin Center → Agents → Upload custom agent** — Shows "The agent you are uploading has already been deployed" if same ID. ❌
- **Microsoft Teams Admin Center** — Has **"Upload file"** under "New version" ✅ This is the correct place.

### Method 1 — Upload Fresh Plugin (First Time)

**Via Microsoft 365 Admin Center:**
```
admin.microsoft.com
→ Settings → Integrated apps
→ Upload custom apps
→ Select NathCorpCoworkPlugin.zip
→ Deploy to users
```

**Via Microsoft Teams Admin Center (also works for fresh upload):**
```
admin.teams.microsoft.com
→ Teams apps (left menu)
→ Manage apps
→ Actions (top right) → Upload new app
→ Select NathCorpCoworkPlugin.zip
→ Upload
```

---

### Method 2 — Update Existing Plugin to New Version ✅ Confirmed Working

**Via Microsoft Teams Admin Center only:**
```
admin.teams.microsoft.com
→ Teams apps (left menu)
→ Manage apps
→ Search: "NathCorp ServiceNow KB"
→ Click on the app
→ Right side panel → "New version" → "Upload file"
→ Select NathCorpCoworkPlugin.zip
→ Upload
```

> **Note:** Microsoft 365 Admin Center → Integrated Apps does NOT have an update button for custom uploaded plugins. Microsoft 365 Admin Center → Agents shows "already been deployed" error. **Teams Admin Center is the only confirmed way to update.**

### How To Repackage Plugin Before Upload

```powershell
cd "C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\NathCorpCoworkPlugin"
Remove-Item "NathCorpCoworkPlugin.zip"
Compress-Archive -Path manifest.json, color.png, outline.png, skills -DestinationPath NathCorpCoworkPlugin.zip
```

### Important Rules When Packaging

| Rule | Detail |
|------|--------|
| No extra files in skills folder | Only `SKILL.md` allowed — no backup files like `SKILL_v2_backup.md` |
| Same ID = update | Keep `id` in manifest.json same to update existing plugin |
| Different ID = new plugin | Changing ID creates a duplicate — avoid unless intentional |
| Version must be higher | Bump version in manifest.json e.g. `2.0.0` → `3.0.0` |

### Plugin File Location
```
C:\Users\Rajesh.alda\OneDrive\Downloads\co-work\NathCorpCoworkPlugin\NathCorpCoworkPlugin.zip
```

### Plugin ID (keep same for updates)
```
49402c59-c65f-444c-99e1-ee02174e1067
```

---

## Claude Desktop — Troubleshooting

| Problem | Fix |
|---------|-----|
| KB returning empty results | Disconnect + reconnect azure-mcp connector in Settings → Connectors |
| Server disconnected error | Remove `nathcorp-servicenow` entry from `claude_desktop_config.json` (server-local.js deleted) |
| Tools not showing new tools | Disconnect + reconnect azure-mcp connector to force fresh tools/list |
| Graph API internal error | Check Azure env vars — restart Azure App Service |

### Claude Desktop Config File Location
```
C:\Users\Rajesh.alda\AppData\Roaming\Claude\claude_desktop_config.json
```

### Connect Azure MCP in Claude Desktop
```
Claude Desktop → Settings → Connectors → + (add)
→ URL: https://nathcorp-mcp-server.azurewebsites.net
→ Name: azure-mcp
```

---

## Already Done ✅

| Task | Status |
|------|--------|
| `get_open_incidents` — added caller_name + caller_email | ✅ Done |
| `get_open_incidents` — added sysparm_display_value=true | ✅ Done |
| `update_incident` — added assignment_group support | ✅ Done |
| `update_incident` — auto close_code when state=6 | ✅ Done |
| `graph_user_read_write` — added WRITE (PATCH) support | ✅ Done |
| SKILL.md v3.0 — Mode 2 only, Graph API for user identity | ✅ Done |
| SKILL_v2_backup.md — Phase 1 backup | ✅ Done |
| manifest.json — bumped to v3.0.0 | ✅ Done |
| NathCorpCoworkPlugin.zip — repackaged | ✅ Done |
| ServiceNow groups verified — Service Desk confirmed | ✅ Done |
| Adele Vance added as user in ServiceNow | ✅ Done |
| Azure env vars updated — AZURE_CLIENT_ID/TENANT_ID/SECRET | ✅ Done |
| WEBSITES_INCLUDE_CLOUD_CERTS=true — Azure App Service | ✅ Done |
| Phase 2 end-to-end test on Claude Desktop | ✅ Done — INC0010016 resolved |
| server.js v3.0.0 deployed to Azure | ✅ Done |
| Plugin v3.0.0 uploaded via Teams Admin Center | ✅ Done — Published version: 3.0.0 |
| SKILL_v2_backup.md removed from plugin zip | ✅ Done — was causing validation issues |

---

## Pending Tasks

| Task | Owner | Status |
|------|-------|--------|
| Remove duplicate plugin (ID: 53264ec1) from Integrated Apps | Rajesh | ⏳ Pending |
| End-to-end test on Microsoft Cowork | Rajesh + Sonalika | ⏳ Pending |

---

## Plugin Upload — How Microsoft Detects New vs Replace

Microsoft uses the **`id` field in manifest.json** to identify a plugin — not the filename or zip name.

| Field | Old Plugin | New Plugin |
|-------|-----------|-----------|
| ID | `49402c59-c65f-444c-99e1-ee02174e1067` | `49402c59-c65f-444c-99e1-ee02174e1067` |
| Version | `2.0.0` | `3.0.0` |
| Name | NathCorp ServiceNow KB | NathCorp ServiceNow KB |
| Result when uploaded | — | **Replaces existing — no duplicate** |

Since both plugins have the **same ID** — uploading v3.0.0 will **update the existing plugin in place**. Users do not need to re-enable it.

### Plugin Files

| File | Version | Status |
|------|---------|--------|
| `NathCorpCoworkPlugin\NathCorpCoworkPlugin.zip` | v3.0.0 | ✅ Upload this to Admin Center |
| `NathCorpServiceNowPlugin.zip` | v2.0.0 | 📦 Old backup — keep for reference |

---

## Testing Setup

| Client | How to connect | Status |
|--------|---------------|--------|
| Claude Desktop | Settings → Connectors → azure-mcp → https://nathcorp-mcp-server.azurewebsites.net | ✅ Connected |
| Microsoft Cowork | Plugin toggle ON in Sources & Skills | ✅ Connected |

---

*NathCorp Internal — Phase 2 Plan | Rajesh (rajesh.alda@nathcorp.com)*
*Version: 4.0 | Updated: 2026-05-31*
