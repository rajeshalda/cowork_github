# Microsoft Cowork Plugin — Complete Reference Guide

> Source: Microsoft Learn — Copilot Cowork (Frontier) documentation  
> Compiled: 2026-06-12  
> Covers: Use plugins, Available plugins, Manage plugins, Build plugins

---

## Table of Contents

1. [What Is a Cowork Plugin?](#1-what-is-a-cowork-plugin)
2. [Plugin Components](#2-plugin-components)
3. [Package Structure](#3-package-structure)
4. [manifest.json — Full Reference](#4-manifestjson--full-reference)
5. [Skills (SKILL.md)](#5-skills-skillmd)
6. [Connectors (MCP Servers)](#6-connectors-mcp-servers)
7. [Authentication Options](#7-authentication-options)
8. [MCP Annotations & Confirmations](#8-mcp-annotations--confirmations)
9. [Limits & Constraints](#9-limits--constraints)
10. [Validation Rules](#10-validation-rules)
11. [Deploying & Managing Plugins (Admin)](#11-deploying--managing-plugins-admin)
12. [Using Plugins (End User)](#12-using-plugins-end-user)
13. [Available Microsoft Plugins](#13-available-microsoft-plugins)
14. [Build From Scratch — Step by Step](#14-build-from-scratch--step-by-step)
15. [Convert Claude Code Plugin to M365](#15-convert-claude-code-plugin-to-m365)
16. [Packaging Commands](#16-packaging-commands)
17. [Cross-Platform Compatibility](#17-cross-platform-compatibility)
18. [Common Questions & Answers](#18-common-questions--answers)
19. [What's NOT Supported Yet (Roadmap)](#19-whats-not-supported-yet-roadmap)
20. [NathCorp Current Plugin — Mapping to This Reference](#20-nathcorp-current-plugin--mapping-to-this-reference)

---

## 1. What Is a Cowork Plugin?

A Cowork plugin is a `.zip` package distributed through the Microsoft 365 App Store that extends Copilot Cowork (Frontier) with new capabilities.

- Uses the **same M365 app package format** as Teams apps, Copilot agents, and Office add-ins
- Managed with the **same admin tools** as other M365 apps
- Can contain **Skills** (prompt workflows), **Connectors** (MCP servers), or both
- Deployed once by an admin — users get it automatically

---

## 2. Plugin Components

| Component | What it is | Max per plugin |
|---|---|---|
| **Skills** | SKILL.md files — prompt-based workflows, domain expertise | 20 |
| **Connectors** | Remote MCP servers — live data, external APIs | 10 |
| **Sub-agents** | ❌ NOT YET SUPPORTED (roadmap) | — |
| **Slash commands** | ❌ NOT YET SUPPORTED (roadmap) | — |
| **Event hooks** | ❌ NOT YET SUPPORTED (roadmap) | — |

### Skills vs Connectors

| Aspect | Skills | Connectors |
|---|---|---|
| **Purpose** | Teach Cowork new workflows and domain expertise | Link Cowork to external data sources and APIs |
| **Type** | Prompt-based, defined in Markdown (SKILL.md) | Remote MCP servers (JSON-RPC 2.0) |
| **Activation** | Automatic (context-based) or manual via Sources & Skills panel | Manual via Sources & Skills panel; requires auth setup |
| **Data flow** | Process instructions, work with user context | Retrieve/act on live external data |
| **Structure** | Folder with SKILL.md + optional companion files | HTTPS endpoints (tools/list, tools/call) |
| **Examples** | Contract analysis, legal research, HR workflows | CRM access, database queries, GitHub operations |
| **Max per package** | 20 | 10 |

---

## 3. Package Structure

### Skills Only
```
my-skills-pack.zip
├── manifest.json
├── color.png          (192×192 px)
├── outline.png        (32×32 px)
└── skills/
    ├── skill-one/
    │   └── SKILL.md
    └── skill-two/
        └── SKILL.md
```

### Skills + Connector
```
my-data-skills.zip
├── manifest.json
├── color.png
├── outline.png
└── skills/
    ├── analysis-workflow/
    │   └── SKILL.md
    └── reporting-workflow/
        └── SKILL.md
```
> Connector defined in manifest.json `agentConnectors[]` — no connector files in ZIP.

### Connector Only (no custom skills)
```
my-connector.zip
├── manifest.json
├── color.png
└── outline.png
```

### With Companion Reference Files
```
my-skills-pack.zip
├── manifest.json
├── color.png
├── outline.png
└── skills/
    └── contract-analysis/
        ├── SKILL.md
        └── references/
            ├── clause-taxonomy.md
            └── risk-scoring.md
```

---

## 4. manifest.json — Full Reference

### Schema
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.28/MicrosoftTeams.schema.json",
  "manifestVersion": "1.28",
  "version": "1.0.0",
  "id": "YOUR-GUID-HERE",
  "developer": {
    "name": "Company Name",
    "websiteUrl": "https://example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsOfUseUrl": "https://example.com/terms"
  },
  "name": {
    "short": "App Short Name",
    "full": "App Full Name for Copilot Cowork"
  },
  "description": {
    "short": "Short description (80 chars max)",
    "full": "Full description (4000 chars max)"
  },
  "icons": {
    "color": "color.png",
    "outline": "outline.png"
  },
  "accentColor": "#2B579A",
  "agentSkills": [
    { "folder": "./skills/skill-one" },
    { "folder": "./skills/skill-two" }
  ],
  "agentConnectors": [
    {
      "id": "connector-unique-id",
      "displayName": "My MCP Server",
      "description": "Description of what this connector does",
      "toolSource": {
        "remoteMcpServer": {
          "mcpServerUrl": "https://api.example.com/mcp",
          "authorization": {
            "type": "None"
          }
        }
      }
    }
  ]
}
```

### Field Reference

**Required top-level fields:**

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `$schema` | string | Fixed URL | Teams v1.28 schema |
| `manifestVersion` | string | `"1.28"` | Must be exactly `1.28` |
| `version` | string | Semantic version | e.g. `"1.0.0"` |
| `id` | string | Valid GUID | Unique per plugin; keep stable across versions |
| `developer.name` | string | Required | Company/author name |
| `developer.websiteUrl` | string | HTTPS URL | |
| `developer.privacyUrl` | string | HTTPS URL | |
| `developer.termsOfUseUrl` | string | HTTPS URL | |
| `name.short` | string | Max 30 chars | Shown in store and plugin list |
| `name.full` | string | Max 100 chars | |
| `description.short` | string | Max 80 chars | Shown in store cards |
| `description.full` | string | Max 4000 chars | Full store description |
| `icons.color` | string | PNG path | 192×192 px |
| `icons.outline` | string | PNG path | 32×32 px |

**Optional top-level fields:**

| Field | Type | Notes |
|---|---|---|
| `accentColor` | string | Hex color e.g. `"#2B579A"` |
| `agentSkills` | array | Required if plugin has skills |
| `agentConnectors` | array | Required if plugin has connectors |

**agentSkills array item:**

| Field | Required | Constraints |
|---|---|---|
| `folder` | Yes | Relative path, max 256 chars e.g. `"./skills/my-skill"` |

**agentConnectors array item:**

| Field | Required | Notes |
|---|---|---|
| `id` | Yes | Unique string within manifest |
| `displayName` | Yes | User-facing name |
| `description` | No | What the connector does |
| `toolSource.remoteMcpServer.mcpServerUrl` | Yes | Valid HTTPS URL |
| `toolSource.remoteMcpServer.authorization.type` | Yes | `None`, `OAuthPluginVault`, or `ApiKeyPluginVault` |
| `toolSource.remoteMcpServer.authorization.referenceId` | Conditional | Required unless type is `None`; must NOT be present when type is `None` |

---

## 5. Skills (SKILL.md)

### SKILL.md Structure
```markdown
---
name: skill-name           # REQUIRED — kebab-case, must match folder name exactly
description: |             # REQUIRED — 1-1024 characters, include trigger phrases
  What this skill does.
  Use when user asks to "X", "Y", or "Z".
license: MIT               # Optional
metadata:                  # Optional
  author: "Company Name"
  version: "1.0"
---

# Skill Title

## What This Skill Does
...

## Workflow
1. Step one
2. Step two
3. Step three

## Output Format
...
```

### Naming Rules (kebab-case)

| Example | Valid? | Issue |
|---|---|---|
| `github-agent` | Yes | Lowercase with hyphens |
| `contract-analysis` | Yes | Lowercase with hyphens |
| `email` | Yes | Single word |
| `MySkill` | No | PascalCase not allowed |
| `my_skill` | No | Underscores not allowed |
| `--my-skill--` | No | Leading/trailing hyphens |
| `my--skill` | No | Consecutive hyphens |

### Folder Name Must Match `name` Field

| Folder path | `name` field | Valid? |
|---|---|---|
| `skills/github-agent/SKILL.md` | `github-agent` | Yes |
| `skills/contract-analysis/SKILL.md` | `ContractAnalysis` | No |
| `skills/my-skill/SKILL.md` | `contract-analysis` | No |

### Skill Loading Layers

| Layer | When loaded | Target size |
|---|---|---|
| Frontmatter (`name` + `description`) | Always — at startup | ~100 tokens |
| SKILL.md body | When skill triggers | < 5,000 tokens (1,500–2,000 words ideal) |
| `references/` companion files | On demand by the agent | Unlimited |
| `scripts/` executables | Executed, not loaded into context | N/A |

### Companion Files

Up to 20 companion files alongside SKILL.md:
```
skills/
└── contract-analysis/
    ├── SKILL.md
    ├── references/
    │   ├── clause-taxonomy.md
    │   └── risk-scoring.md
    └── scripts/
        └── extract-clauses.py
```

**Companion file rules:**
- Relative paths only (no absolute)
- No `..` path traversal
- No backslashes or null bytes
- No hidden files (starting with `.`)
- No Windows reserved names (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`)
- Safe characters only: alphanumeric, hyphens, underscores, dots, spaces, `!`

### Skill Authoring Best Practices

**Good description (specific trigger phrases):**
```yaml
description: |
  Analyzes bond relative value using Z-spreads, ASW spreads, and butterfly analysis.
  Use when user asks to "analyze bond spreads", "compare bonds",
  "rich-cheap analysis", "relative value", or "Z-spread calculation".
```

**Bad description (vague, no triggers):**
```yaml
description: Provides bond analytics capabilities.
```

**Best practices:**
- Keep SKILL.md lean — it's a workflow, not an encyclopedia
- Move detailed content to `references/` subdirectory if exceeding ~3,000 words
- Reference connector tool names explicitly: `"Use the search_case_law tool to..."`
- Structure as numbered workflow steps
- Define exact output format (tables, lists, document structure)
- Don't embed secrets in SKILL.md — use `agentConnectors` with auth
- Don't duplicate built-in Cowork skills
- Be specific — separate skills for "contract analysis", "clause extraction", "legal research"
- Don't hardcode file paths or system commands

### How Skills Activate

- **Automatic**: Cowork reads all skill descriptions at startup and selects the right skill based on conversation context
- **Manual**: User enables via Sources & Skills panel
- **Built-in priority**: Built-in Cowork skills override plugin skills of the same name
- **Conversation scope**: Skills read attachments, reference earlier messages, coordinate with other active skills

---

## 6. Connectors (MCP Servers)

### How Cowork Calls MCP Servers

1. At conversation start: Cowork calls `initialize` + `tools/list` → discovers all available tools
2. When agent needs a tool: Cowork calls `tools/call` with tool name + arguments
3. Tool result returned to agent as JSON

### Connector Technical Requirements

| Requirement | Details |
|---|---|
| Transport | Streamable HTTP (HTTPS required, TLS 1.2+) |
| Protocol | JSON-RPC 2.0 |
| Tool discovery | Support `tools/list` (recommended for dynamic discovery) |
| Tool execution | Support `tools/call` |
| Availability | 99.9% uptime SLA recommended for store-published apps |
| Response time | < 30 seconds per tool call |

### Tool Design Guidelines

| API size | Pattern | Example tools |
|---|---|---|
| Small (< 15 operations) | One tool per action | `search_case_law`, `get_ruling`, `cite_precedent` |
| Large (50+ operations) | Search + execute | `search_actions` + `execute_action` |

**Good tool naming:** `get_bond_price`, `search_repositories`, `create_issue`  
**Bad tool naming:** `getData`, `doThing`, `process`

**Tool design checklist:**
- Descriptive names with verb + noun
- `description` field on every tool
- `description` field on every parameter in `inputSchema`
- Return structured JSON that agent can format for user

### MCP Annotations

Cowork reads standard MCP `annotations` on tools from `tools/list`:

```json
{
  "name": "send_email",
  "description": "Send an email message.",
  "annotations": {
    "title": "Send Email",
    "readOnlyHint": false,
    "destructiveHint": true
  },
  "inputSchema": { }
}
```

| Annotation field | Type | Effect |
|---|---|---|
| `readOnlyHint` | bool | `false` → confirmation required before tool runs |
| `destructiveHint` | bool | `true` → confirmation required before tool runs |
| `title` | string | Label shown on confirmation dialog; falls back to tool name |

Tools without annotations → **no confirmation prompt** (safe-by-default).

---

## 7. Authentication Options

### For MCP Connectors

| Type | Use case | User experience |
|---|---|---|
| `None` | Public/anonymous APIs, internal services with server-side auth (e.g. Managed Identity) | Transparent — no auth prompt |
| `OAuthPluginVault` | OAuth 2.0 APIs (recommended for production) | User completes OAuth consent once |
| `OAuthPluginVault` (Entra SSO) | Seamless Microsoft Entra ID SSO | Single sign-on with work account |
| `ApiKeyPluginVault` | API key-based services | User provides key once |

> **Note:** `ApiKeyPluginVault` is for API plugins only — NOT supported for MCP plugins.

### None (Your Setup)

```json
"authorization": {
  "type": "None"
}
```
Auth handled server-side (e.g. Azure Managed Identity). No `referenceId` — it must NOT be present.

### OAuthPluginVault

```json
"authorization": {
  "type": "OAuthPluginVault",
  "referenceId": "YOUR-OAUTH-CLIENT-REGISTRATION-ID"
}
```

- `referenceId` = OAuth client registration ID from Teams Developer Portal
- Credentials stored in Microsoft Enterprise Token Store (never in manifest)
- Redirect URI: `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect`
- Set usage by organization to **Any Microsoft 365 Organization** for cross-tenant use

### ApiKeyPluginVault

```json
"authorization": {
  "type": "ApiKeyPluginVault",
  "referenceId": "YOUR-API-KEY-REGISTRATION-ID"
}
```

---

## 8. MCP Annotations & Confirmations

```json
{
  "name": "delete_file",
  "annotations": {
    "title": "Delete File",
    "readOnlyHint": false,
    "destructiveHint": true
  }
}
```

**Confirmation logic:**
- Confirmation shown if: `readOnlyHint == false` OR `destructiveHint == true`
- No confirmation if: no annotations, or `readOnlyHint == true` and `destructiveHint != true`
- Microsoft's own tools (Graph, Dataverse) are gated by Cowork's built-in policy regardless of annotations
- Annotation-driven confirmation for third-party MCP servers is being rolled out progressively
- Setting hints now is forward-compatible

**Safe read (no confirmation):**
```json
{
  "name": "search_docs",
  "annotations": {
    "title": "Search Documents",
    "readOnlyHint": true
  }
}
```

**Write action (confirmation required):**
```json
{
  "name": "create_file",
  "annotations": {
    "title": "Create File",
    "readOnlyHint": false,
    "destructiveHint": false
  }
}
```

---

## 9. Limits & Constraints

| Item | Limit |
|---|---|
| Skills per plugin package | 20 |
| Connectors per plugin package | 10 |
| SKILL.md body (recommended) | 1,500–2,000 words |
| SKILL.md body (hard limit) | < 5,000 tokens (~1 MB file) |
| Companion files per skill | 20 (excluding SKILL.md) |
| Companion file size | 5 MB each |
| Companion files total per skill | 10 MB |
| Companion download timeout | 15 seconds |
| Skill name length | 1–64 characters |
| Skill description length | 1–1,024 characters |
| Folder path in manifest | Max 256 characters |
| MCP tool call response time | < 30 seconds |
| icon color.png size | 192×192 px |
| icon outline.png size | 32×32 px |
| Custom skills per user (OneDrive) | 50 |

---

## 10. Validation Rules

### Manifest-Level

| Code | Rule | Severity |
|---|---|---|
| ASKILL-M001 | `folder` required on each `agentSkills` entry | Error |
| ASKILL-M002 | Max 20 items in `agentSkills` array | Error |
| ASKILL-M003 | `folder` path max 256 characters | Error |

### Package-Level

| Code | Rule | Common Fix | Severity |
|---|---|---|---|
| ASKILL-P001 | Folder referenced in manifest exists in ZIP | Check ZIP structure | Error |
| ASKILL-P002 | Folder contains a `SKILL.md` file | Add missing `SKILL.md` | Error |
| ASKILL-P003 | `SKILL.md` has valid YAML frontmatter between `---` delimiters | Fix YAML syntax | Error |
| ASKILL-P004 | Frontmatter includes `name` field | Add `name:` to frontmatter | Error |
| ASKILL-P005 | Frontmatter includes `description` field | Add `description:` | Error |
| ASKILL-P006 | `name` matches folder name (last path segment) | Rename folder or fix `name:` | Error |
| ASKILL-P007 | `name` is kebab-case | Use `my-skill` not `MySkill` | Error |
| ASKILL-P008 | No duplicate `folder` values | Remove duplicates | Error |

### Connector Validation

| Rule | Severity |
|---|---|
| `id` and `displayName` required on each connector | Error |
| All connector `id` values unique within manifest | Error |
| Exactly one of `plugin` or `remoteMcpServer` | Error |
| `mcpServerUrl` must be valid HTTPS URL | Error |
| `authorization.referenceId` required unless type is `None` | Error |
| `authorization.referenceId` must NOT be present when type is `None` | Error |

### Companion File Validation

| Rule | Severity |
|---|---|
| Max 20 companion files per skill (excluding SKILL.md) | Error |
| Each companion file ≤ 5 MB | Error |
| Total companion files ≤ 10 MB per skill | Error |
| Relative paths only (no absolute paths) | Error |
| No `..` path traversal | Error |
| No backslashes or null bytes in file names | Error |
| No hidden files (names starting with `.`) | Error |
| No Windows reserved names (CON, PRN, AUX, NUL, COM1–9, LPT1–9) | Error |
| Safe characters only (alphanumeric, `-`, `_`, `.`, spaces, `!`) | Error |

---

## 11. Deploying & Managing Plugins (Admin)

### Prerequisites
- Microsoft 365 admin center access
- Tenant Administrator or Copilot Administrator role
- Users must have Microsoft 365 Copilot licenses

### Deploy to Organization

1. Sign in to **Microsoft 365 admin center**
2. Go to **Copilot > Agents > All agents**
3. Find the plugin
4. Select deployment scope:
   - **Entire organization** — all licensed Copilot users
   - **Specific users/groups** — targeted deployment
5. Click **Deploy**

### Deployment Types

| Type | Who gets it | User can remove? |
|---|---|---|
| Deployed to entire org | All licensed Copilot users — acquired automatically | No |
| Deployed to specific groups | Target users — acquired automatically | No |
| Available in App Store | Users acquire themselves | Yes |

### Control Plugin Availability

Three availability settings in admin center:

| Setting | Effect |
|---|---|
| Available to all users | All licensed users can find and acquire |
| Available to specific users/groups | Only specified security groups see it |
| Blocked | No users can access |

> Country/region-based scoping not supported — use security groups instead.

### Admin-Deployed Plugin Behavior
- Shows **"Managed by your organization"** label
- Users can enable/disable but **cannot remove**
- Preferences saved per device
- Admin **cannot** sign in on behalf of users for connector auth
- Each user must complete connector sign-in themselves on first use

### Monitor Usage
- Microsoft Purview audit logs → "Copilot activities"
- Audit Standard provides logs at no extra cost

### Disable Plugin System Entirely
- Work with service administrator
- When disabled: "Browse plugins" button disappears, all plugin skills/connectors stop loading

### Sideloading (Dev/Test Only)
- M365 Admin Center > Manage Apps > **Upload custom app**
- Bypasses store validation
- Control who can sideload via custom app policies

---

## 12. Using Plugins (End User)

### Browse & Add Plugins
1. Open Cowork → click **"Browse plugins"**
2. Search by name or category
3. Two tabs: **All Plugins** (marketplace + org) and **Added Plugins** (acquired)
4. Select plugin → **"Add to Cowork"**

### Enable/Disable Plugins
- Open **Sources & Skills** panel
- Toggle switch next to plugin name
- When enabled: skills appear as chips, connectors visible
- When disabled: hidden from conversations until re-enabled
- Preferences saved per device

### Connect to Plugin Services (Connectors with Auth)
- On first use, Cowork prompts to sign in
- One-time authorization per connector
- Cowork remembers unless revoked

### Remove a Plugin
- Browse plugins dialog → find plugin → **"Remove from Cowork"**
- Removes skills and connectors from future conversations
- Active conversations continue until end
- Can re-acquire anytime

---

## 13. Available Microsoft Plugins

| Plugin | Description | Auth |
|---|---|---|
| Dynamics 365 Customer Service | Query/manage customer service cases, knowledge articles, support workflows | Microsoft Entra ID |
| Dynamics 365 ERP | Financial data, supply chain, operations workflows | Microsoft Entra ID |
| Dynamics 365 Sales | Leads, opportunities, accounts, sales pipeline | Microsoft Entra ID |
| Fabric IQ | Query Power BI datasets, generate reports, BI insights across Fabric workspace | Microsoft Entra ID |

- Dynamics 365 Customer Service and Sales **enabled by default**
- Can be disabled in Microsoft 365 admin center
- Users select Dynamics 365 environment on initial sign-in
- Single environment: Cowork selects automatically; multiple: Cowork prompts user to choose

---

## 14. Build From Scratch — Step by Step

### Step 1: Create Skill Folder Structure
```
my-extension/
└── skills/
    └── my-skill/
        └── SKILL.md
```

### Step 2: Write SKILL.md
```markdown
---
name: my-skill
description: |
  What this skill does.
  Use when user asks to "do X", "help with Y", or "Z related request".
license: MIT
metadata:
  author: Your Company
  version: "1.0"
---

# My Skill

## What This Skill Does
Brief description.

## Workflow
1. First step
2. Second step
3. Third step — output result

## Output Format
Present results as a table with columns: Column1 | Column2 | Column3
```

### Step 3: Add Reference Files (Optional)
```
skills/my-skill/
├── SKILL.md
└── references/
    └── detailed-guide.md
```

### Step 4: Create manifest.json
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.28/MicrosoftTeams.schema.json",
  "manifestVersion": "1.28",
  "version": "1.0.0",
  "id": "GENERATE-A-NEW-GUID-HERE",
  "developer": {
    "name": "Your Company",
    "websiteUrl": "https://yourcompany.com",
    "privacyUrl": "https://yourcompany.com/privacy",
    "termsOfUseUrl": "https://yourcompany.com/terms"
  },
  "name": {
    "short": "Your Plugin Name",
    "full": "Your Plugin Name for Copilot Cowork"
  },
  "description": {
    "short": "Short description under 80 chars",
    "full": "Full description of what the plugin does."
  },
  "icons": {
    "color": "color.png",
    "outline": "outline.png"
  },
  "accentColor": "#2B579A",
  "agentSkills": [
    { "folder": "./skills/my-skill" }
  ]
}
```

### Step 5: Add Icons
- `color.png` — 192×192 px, full color
- `outline.png` — 32×32 px, single-color outline

### Step 6: Package (ZIP)

**Windows PowerShell (correct — forward slashes):**
```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open("my-plugin.zip", 'Create')
foreach ($file in @("manifest.json","color.png","outline.png")) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, $file)
}
Get-ChildItem -Recurse skills | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $entry = $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entry)
}
$zip.Dispose()
```

> **Important:** Use `System.IO.Compression` directly — `Compress-Archive` creates backslash paths which Cowork rejects.

**macOS/Linux:**
```bash
zip -r my-plugin.zip manifest.json color.png outline.png skills/
```

### Step 7: Test (Sideload)
1. M365 Admin Center > Manage Apps > **Upload custom app**
2. Upload `.zip`
3. Open Cowork > Sources & Skills → verify skills appear

### Step 8: Publish
Submit to Microsoft 365 App Store via [Partner Center](https://partner.microsoft.com).

---

## 15. Convert Claude Code Plugin to M365

If you have an existing Claude Code plugin:

```powershell
.\Convert-ClaudePluginToMOS3.ps1 -PluginPath ./my-claude-plugin -OutputPath ./output
```

### What Gets Converted

| Claude artifact | M365 equivalent | Notes |
|---|---|---|
| `.claude-plugin/plugin.json` | `manifest.json` | Name, description, author mapped; GUID auto-generated (UUID v5) |
| `skills/*/SKILL.md` | `agentSkills[]` + `skills/` folder | Copied verbatim — identical format |
| `.mcp.json` servers | `agentConnectors[]` | URL and auth type autodetected |
| `color.png` / `outline.png` | Icons | Used if present; placeholders generated if missing |

### What's NOT Converted

| Claude feature | Status |
|---|---|
| `commands/` (slash commands) | Not yet supported in Cowork |
| `agents/` (sub-agents) | Not yet supported in Cowork |
| `hooks/` (event handlers) | Not yet supported in Cowork |
| `settings.json` | Not applicable |
| `bin/` executables | Not applicable |

### Conversion Script Options

```powershell
.\Convert-ClaudePluginToMOS3.ps1
    -PluginPath <path>              # Required: Claude plugin directory
    -OutputPath <path>              # Output directory (default: current)
    -AppId <guid>                   # Override auto-generated GUID
    -DefaultAuthType <type>         # Auto | None | OAuthPluginVault | ApiKeyPluginVault
    -DetailedOutput                 # Show step-by-step progress
```

---

## 16. Packaging Commands

### Windows PowerShell (Recommended — avoids backslash issue)
```powershell
# Using System.IO.Compression directly (correct forward slashes)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = Join-Path (Get-Location) "plugin.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
foreach ($file in @("manifest.json","color.png","outline.png")) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, (Join-Path (Get-Location) $file), $file)
}
Get-ChildItem -Recurse skills | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $entryName = $_.FullName.Substring((Get-Location).Path.Length + 1).Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName)
}
$zip.Dispose()
```

### macOS / Linux
```bash
zip -r plugin.zip manifest.json color.png outline.png skills/
```

---

## 17. Cross-Platform Compatibility

The Agent Skills standard (SKILL.md format) is an **open standard** supported across 30+ AI tools:

| Platform | Compatibility |
|---|---|
| Claude Code | Full — same SKILL.md format |
| Claude.ai Projects | Full — skills uploadable as project files |
| VS Code / GitHub Copilot | Full — Agent Skills in agent mode |
| Gemini CLI | Full |
| JetBrains Junie | Full |
| OpenAI Codex | Full |
| Cursor | Full |
| Microsoft Cowork | Full (via plugin ZIP) |

**Build once for both Claude Code and Cowork:**
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Claude plugin manifest
├── skills/
│   ├── skill-one/
│   │   └── SKILL.md         # Works in Claude Code AND M365
│   └── skill-two/
│       └── SKILL.md
└── .mcp.json                # MCP server config
```

Then convert when ready:
```powershell
.\Convert-ClaudePluginToMOS3.ps1 -PluginPath ./my-plugin -OutputPath ./output
```

---

## 18. Common Questions & Answers

**Q: Can I use skills from the M365 package in Claude Code?**  
Yes. Copy skill folders to `.claude/skills/` in your Claude Code project. Same SKILL.md format.

**Q: Do I need a remote connector?**  
No. Skills-only packages work well for prompt-based workflows. Connectors only needed when skill requires live data from an external system.

**Q: How are plugin skills different from built-in Cowork skills?**  
Plugin skills appear with source `"package"` in API. Cannot override built-in skills of same name. Admin-deployed packages show `isAdminDeployed: true`.

**Q: Can IT admins control which plugins are available?**  
Yes. Standard M365 admin controls: tenant-level allow/block lists, admin-managed deployments, compliance policies.

**Q: What happens if a plugin is revoked?**  
On next sync cycle, skills and connectors removed from user's session. Active conversations not interrupted; new sessions lose the plugin's capabilities.

**Q: What's the maximum skills per package?**  
20 skills (ASKILL-M002). Connectors: 10 per package.

**Q: Can skills reference connector tools from the same package?**  
Yes — and they should. Name tools explicitly in SKILL.md workflow: `"Use the search_case_law tool to..."`. Agent connects them at runtime.

**Q: How do I generate a deterministic GUID for my package?**  
Conversion script uses UUID v5 (SHA-1 based) from plugin name — same output on every run. For manual packaging, any GUID generator works; keep it stable across versions.

**Q: Can a plugin have multiple MCP servers?**  
Yes — up to 10 connectors, each pointing to a different MCP server URL.

**Q: Can a plugin call multiple agents (sub-agents)?**  
Not yet — sub-agents are on the roadmap but not currently supported.

---

## 19. What's NOT Supported Yet (Roadmap)

| Feature | Status |
|---|---|
| Sub-agents inside a plugin | Not yet supported |
| Slash commands (`commands/` folder) | Not yet supported |
| Event handlers / hooks (`hooks/` config) | Not yet supported |
| API key auth for MCP connectors | Not supported (API plugins only) |
| Country/region-based plugin scoping | Not supported (use security groups) |
| Admin signing in on behalf of users (connectors) | Not supported by design |

---

## 20. NathCorp Current Plugin — Mapping to This Reference

Our current plugin (`NathCorpCoworkPlugin.zip`) maps to this reference as follows:

| This reference | Our implementation |
|---|---|
| Plugin type | Skills + Connector |
| Skills | 1 skill: `skills/github-agent/SKILL.md` |
| Connectors | 1 connector: `nathcorp-mcp-server` (Azure App Service) |
| Auth type | `None` — Managed Identity handled server-side in `server.js` |
| manifest.json version | 1.28 |
| Plugin version | 5.0.0 |
| Plugin id | 9333fdb2-ae66-489b-8fc3-d725cfb1f12a |
| MCP server URL | `https://nathcorp-mcp-server.azurewebsites.net` |
| Remaining connector slots | 9 of 10 available |
| Remaining skill slots | 19 of 20 available |

### Zero Plugin Re-Upload Architecture

The key insight for our production setup:

1. Cowork calls `tools/list` on `nathcorp-mcp-server` **every conversation**
2. `server.js` returns the tool description live — this IS the new SKILL.md
3. Update `server.js` → redeploy Azure App Service → **instant rollout**
4. Plugin ZIP never needs updating again (it only holds the MCP URL)

**Future expansion options (no plugin re-upload needed):**
- Add more MCP servers → add to `agentConnectors[]` in manifest + re-upload once
- Add more skills → add SKILL.md files + re-upload once
- Change agent behavior → update `server.js` only — zero admin action

---

*Sources: learn.microsoft.com/en-us/microsoft-365/copilot/cowork/*
