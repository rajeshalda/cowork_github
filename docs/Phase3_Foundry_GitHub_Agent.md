# NathCorp Phase 3 — Azure AI Foundry Agent + GitHub MCP
**Author:** Rajesh (rajesh.alda@nathcorp.com)
**Created:** 2026-06-04
**Completed:** 2026-06-06
**Status:** ✅ LIVE — End-to-end working

---

## What We Built

A fully autonomous multi-agent code fix system where Microsoft Cowork delegates GitHub operations to an Azure AI Foundry Agent via the **A2A (Agent-to-Agent) protocol**. The Foundry Agent autonomously reads repos, fixes bugs, creates branches, commits code, and raises/merges pull requests.

```
Microsoft Cowork
      ↓  MCP tool call (delegate_to_github_agent)
NathCorp MCP Bridge (nathcorp-mcp-server — Azure App Service)
      ↓  A2A v1.0 protocol (JSONRPC / SendMessage)
Azure AI Foundry github-agent (MPN-MTT-APP-5 project)
      ↓  GitHub MCP tool (auto-approved)
GitHub API → repos, branches, commits, PRs
```

---

## Why The Bridge Exists

Microsoft Cowork only supports **MCP tools** natively — it cannot call A2A endpoints directly. The bridge (`nathcorp-mcp-server`) is a thin MCP server that:
1. Receives the task from Cowork as an MCP tool call
2. Gets an Azure token via Managed Identity
3. Calls the Foundry Agent via A2A v1.0
4. Returns the agent's response back to Cowork

This is confirmed by Microsoft's own blog — Cowork supports MCP, not A2A natively:
- [Agent Factory: Connecting agents with MCP and A2A — Azure Blog](https://azure.microsoft.com/en-us/blog/agent-factory-connecting-agents-apps-and-data-with-new-open-standards-like-mcp-and-a2a/)

---

## Microsoft Blog References (Proof)

| Concept | Microsoft Reference |
|---------|-------------------|
| A2A protocol on Foundry agents | [Enable incoming A2A — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint) |
| A2A v1.0 method names (SendMessage, GetTask) | [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/) |
| Foundry User role for calling agents | [RBAC in Foundry — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry) |
| GitHub MCP tool on Foundry agents | [MCP Tool — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol) |
| MCP approval — Always auto-approve | [MCP best practices — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol) |
| A2A authentication via Managed Identity | [A2A authentication — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint#configure-authentication-for-incoming-requests) |

---

## Key Technical Discoveries

| Discovery | Detail |
|-----------|--------|
| A2A v1.0 method names are PascalCase | `SendMessage` not `message/send`, `GetTask` not `tasks/get` |
| A2A v1.0 role field is integer | `role: 1` for user, not `role: "user"` |
| Response shape | `result.task.artifacts[].parts[].text` |
| Task state values | `TASK_STATE_COMPLETED`, `TASK_STATE_FAILED`, `TASK_STATE_INPUT_REQUIRED` |
| Managed Identity token endpoint | `IDENTITY_ENDPOINT` + `IDENTITY_HEADER` (not IMDS `169.254.169.254`) |
| Required RBAC role | `Foundry User` on the Foundry resource group (not `Azure AI Developer`) — see below |
| GitHub MCP approval | Must set to **Always auto-approve all tools** in Foundry portal |

---

## Why Each Key Technical Decision Was Made

### 1. A2A v1.0 PascalCase method names (`SendMessage` not `message/send`)
A2A v0.3 used slash-style methods (`message/send`, `tasks/get`). v1.0 changed to PascalCase (`SendMessage`, `GetTask`) to align with standard JSONRPC naming conventions. Foundry only accepts v1.0 — sending v0.3 method names returns "Method not found" immediately. We discovered this by trial and error during integration.

### 2. `role: 1` as integer (not `role: "user"` as string)
The A2A v1.0 spec defines the role field as an **enum integer** — `1` means user, `2` means agent. Sending the string `"user"` causes Foundry to return "Invalid parameters" and reject the message entirely. This is a breaking difference from v0.3 which accepted strings.

### 3. Response shape `result.task.artifacts[].parts[].text`
Foundry wraps the agent's reply inside a nested structure: `result → task → artifacts → parts → text`. We cannot read `result.text` directly — the full path must be traversed. We also added fallbacks (`outputs[].parts[]` and `status.message.parts[]`) because different task states return text in different locations.

### 4. Task states `TASK_STATE_COMPLETED`, `TASK_STATE_FAILED`, `TASK_STATE_INPUT_REQUIRED`
Foundry A2A tasks are **asynchronous** — `SendMessage` returns a task ID, not the final answer. We must poll using `GetTask` until the state becomes terminal. `TASK_STATE_INPUT_REQUIRED` means the agent is waiting for approval (e.g. MCP tool confirmation) — we fixed this by setting "Always auto-approve" in the Foundry portal so it never blocks.

### 5. Managed Identity via `IDENTITY_ENDPOINT` + `IDENTITY_HEADER` (not `169.254.169.254`)
The Foundry A2A endpoint requires a valid Azure Bearer token — anonymous calls are rejected with 401. We use **Managed Identity** so no credentials are stored anywhere in code or config. Azure App Service exposes `IDENTITY_ENDPOINT` and `IDENTITY_HEADER` environment variables automatically when Managed Identity is enabled. The older IMDS endpoint (`169.254.169.254`) is for VMs — App Service uses its own internal identity endpoint instead. Using the wrong URL caused `ECONNREFUSED` errors.

### 6. `Foundry User` RBAC role (not `Azure AI Developer`)
See full explanation in the section below.

### 7. GitHub MCP "Always auto-approve all tools"
By default, Foundry asks for user confirmation before each GitHub MCP tool call (read file, create branch, commit, etc.). This causes the task to enter `TASK_STATE_INPUT_REQUIRED` and wait indefinitely — which our bridge cannot respond to. Setting "Always auto-approve" in the Foundry portal bypasses confirmation for all GitHub tools, allowing the agent to complete multi-step operations fully autonomously.

---

## Why Foundry User Role (Not Azure AI Developer)

The Managed Identity on `nathcorp-mcp-server` needs permission to call the Foundry Agent via A2A. There are two candidate roles:

| Role | What it allows | Works for A2A? |
|------|---------------|----------------|
| `Azure AI Developer` | Create/manage agents, deployments, fine-tuning | ❌ No — write/admin role, not for runtime calls |
| `Foundry User` | **Invoke** agents and use Foundry endpoints at runtime | ✅ Yes — this is the correct runtime role |

**Why we hit this problem:** The initial instinct was to assign `Azure AI Developer` because it sounds like the right "developer" role. But Foundry separates management permissions (developer) from runtime invocation permissions (user). Calling an agent via A2A is a runtime operation — so `Foundry User` is required.

**Reference:** [RBAC in Foundry — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)

---

## Infrastructure

| Resource | Value |
|----------|-------|
| MCP Bridge URL | https://nathcorp-mcp-server.azurewebsites.net |
| App Service RG | nathcorp-cowork-rg (subscription ab16955e, East Asia) |
| Foundry Project | MPN-MTT-APP-5 (subscription ab16955e, East US) |
| A2A Endpoint | https://MPN-MTT-APP-5.services.ai.azure.com/api/projects/MPN-MTT-APP-5/agents/github-agent/endpoint/protocols/a2a |
| A2A Version | 1.0 |
| GitHub Account | rajeshaldanathcorp |
| Test Repo | rajeshaldanathcorp/beta-test (default branch: master) |
| Managed Identity | d1f791c6-6815-4a51-a0f1-36c81be14443 |
| Role Assignment | Foundry User on MPN-MTT-APP-5 resource group |
| Model Used | gpt-5.4-2026-03-05 |

---

## Proven Working — 2026-06-06

All tested end-to-end from Microsoft Cowork:

| Operation | Result |
|-----------|--------|
| List GitHub repos | ✅ Returned all 4 repos under rajeshaldanathcorp |
| Fix bug + create branch + commit + raise PR | ✅ PR #2 raised on beta-test |
| Merge open PR | ✅ PR #2 merged, commit SHA: 36986f08 |

---

## Trace Proof (App Insights)

Connected App Insights to MPN-MTT-APP-5 Foundry project. Trace captured from A2A call:

```
Conversation: conv_ea43b63f4370313d...  (7 seconds total)
  └── invoke_agent github-agent:4       [Ok]
        ├── execute_tool mcp_GitHub.search_repositories  [Ok]
        │     └── query: org:rajeshaldanathcorp → 4 repos returned
        └── chat gpt-5.4-2026-03-05    [Ok]
              └── 11,289 tokens used, formatted response returned
```

This confirms:
- Cowork → Bridge → A2A → Foundry agent invoked ✅
- Foundry agent called GitHub MCP tool automatically ✅
- GitHub API returned real repo data ✅
- Agent formatted and returned response to Cowork ✅

---

## MCP Server Code (server.js v4.5.0)

Key implementation:
```javascript
// A2A v1.0 — PascalCase methods, role as integer
method: 'SendMessage',
params: {
    message: {
        kind: 'message',
        role: 1,              // integer, not string "user"
        parts: [{ kind: 'text', text: task }],
        messageId: `msg-${Date.now()}`
    }
}
// Header: 'A2A-Version': '1.0'
// Auth: Managed Identity via IDENTITY_ENDPOINT + IDENTITY_HEADER
```

---

## Build Steps — Completed

| Step | Task | Status |
|------|------|--------|
| 1 | Foundry project MPN-MTT-APP-5 identified (subscription ab16955e) | ✅ Done |
| 2 | github-agent created with GitHub MCP tool | ✅ Done |
| 3 | GitHub Classic PAT with full scopes connected | ✅ Done |
| 4 | A2A protocol enabled on github-agent (agent card set up) | ✅ Done |
| 5 | MCP bridge (nathcorp-mcp-server) updated to v4.5.0 | ✅ Done |
| 6 | Managed Identity assigned Foundry User role on MPN-MTT-APP-5 | ✅ Done |
| 7 | GitHub MCP tool set to Always auto-approve | ✅ Done |
| 8 | NODE_ENV=production set on App Service | ✅ Done |
| 9 | App Insights connected to Foundry for tracing | ✅ Done |
| 10 | End-to-end test from Cowork — list, fix, PR, merge | ✅ Done |

---

## Demo Script For Manager

**Rajesh types in Cowork:**
> "In the beta-test repo, there is a bug in src/lib/utils.ts — the formatUserName function is missing a space. Fix it, raise a PR, then merge it."

**What happens autonomously:**
1. Cowork skill triggers → calls `delegate_to_github_agent` MCP tool
2. Bridge gets Managed Identity token → calls Foundry Agent via A2A v1.0
3. Foundry Agent (gpt-5.4) reads the file via GitHub MCP
4. Creates branch `fix/format-user-name-space` from `master`
5. Fixes the bug, commits, raises PR
6. On next command, merges the PR
7. Cowork reports back: "PR #2 merged successfully"

**Manager sees:** Two AI agents (Cowork + Foundry) collaborating across Microsoft and GitHub — zero human code written.

---

## How SKILL.md Works & Why It Matters

### What SKILL.md Is

SKILL.md is the **brain of the Cowork orchestrator**. It is a markdown file inside the NathCorp Cowork plugin that tells Cowork:
- When to trigger the GitHub skill (what user phrases to detect)
- How to classify the user's intent
- What to write inside the `task` parameter sent to `delegate_to_github_agent`

It does **not** call GitHub directly. It does **not** connect to the Foundry agent directly. It is pure instruction text that shapes how the orchestrator builds the task string.

### Why It Is Useful

Without a good SKILL.md, the orchestrator has no guidance — it defaults to whatever pattern the example shows. This is what caused the original bug: the old SKILL.md had one example that always created a branch and raised a PR, so even "add a file called rajesh.txt" ended up creating `feature/add-rajesh-txt` and PR #8 instead of a direct commit.

With a production SKILL.md the orchestrator:
- Classifies intent (read-only vs direct commit vs branch+PR vs PR operation)
- Asks the user which repo before proceeding if no repo is named
- Resolves the default branch dynamically instead of assuming `master`
- Respects explicit user overrides ("no PR", "commit directly")

### The Full Flow

```
User types in Cowork
      ↓
SKILL.md — orchestrator reads this to classify intent and build the task string
      ↓
delegate_to_github_agent({ task: "..." })   ← MCP tool call
      ↓
nathcorp-mcp-server (Azure App Service bridge)
      ↓  A2A v1.0 SendMessage
Azure AI Foundry github-agent
      ↓  GitHub MCP tool call (e.g. create_or_update_file)
GitHub API → actual change on the repo
```

### Why We Added Official GitHub MCP Tool Names To SKILL.md

The Foundry `github-agent` is connected to the **official GitHub MCP server** (`github/github-mcp-server`). That server exposes 114 tools with exact names like `create_or_update_file`, `create_branch`, `merge_pull_request`, `list_issues`, etc.

When the orchestrator writes the task string vaguely (e.g. "add a file"), the Foundry agent has to guess which tool to use — and it may guess wrong (e.g. choosing to create a branch first). When the task string explicitly says **"use `create_or_update_file` to commit directly to master"**, the Foundry agent has no ambiguity and executes the right tool immediately.

**Examples of official tool names referenced in SKILL.md:**

| Tool Name | Used For |
|-----------|---------|
| `create_or_update_file` | Add or edit a single file, commit directly to a branch |
| `push_files` | Commit multiple files in one operation |
| `delete_file` | Delete a file from a branch |
| `create_branch` | Create a new branch before a code change |
| `create_pull_request` | Open a PR after committing to a branch |
| `merge_pull_request` | Merge an existing PR |
| `list_branches` | Resolve the default branch dynamically (never assume master/main) |
| `search_repositories` | List user's repos when no repo is specified — ask before acting |
| `list_issues` / `issue_write` | Read or create issues |

These are **not called by SKILL.md** — they are guidance text so the orchestrator writes precise instructions in the task string, and the Foundry agent picks the right tool on the first attempt.

---

## Phase 3.1 — Key Discoveries (2026-06-11)

This section documents everything we discovered during live production testing on 2026-06-11. These are non-obvious findings that are critical to understand before making any future changes.

---

### Discovery 1: Cowork Reads The MCP Server Directly — SKILL.md In The Plugin Is NOT Required

**What we found:**
We had an old plugin version deployed in production (with outdated SKILL.md). We uploaded a new plugin with a new GUID but Cowork was already responding correctly — because Cowork connects to the MCP server URL from `manifest.json` via `agentConnectors → remoteMcpServer` and calls `mcp_list_tools` to read the tool name and description directly from `server.js`.

**What this means:**
- The SKILL.md inside the plugin zip is **not the brain** — it is just a hint
- Cowork reads the **`delegate_to_github_agent` tool description from `server.js`** to understand what the tool does and how to build the task string
- As long as the MCP server URL is present in the plugin manifest, Cowork will always read the latest tool description from the live MCP server
- **The plugin zip never needs to be re-uploaded** for behaviour changes — only update `server.js` and redeploy to Azure App Service

**Proof:**
Old plugin was in production. We updated `server.js` tool description and redeployed. Cowork immediately reflected the new behaviour without any plugin re-upload.

**Flow confirmed:**
```
Cowork plugin manifest.json
  ↓  agentConnectors → remoteMcpServer → https://nathcorp-mcp-server.azurewebsites.net
  ↓  mcp_list_tools (reads tool name + description from server.js)
  ↓  orchestrator builds task string based on tool description
delegate_to_github_agent({ task: "natural language instruction" })
  ↓
nathcorp-mcp-server bridge
  ↓  A2A v1.0 SendMessage
Azure AI Foundry github-agent (gpt-5.4)
  ↓  decides which GitHub MCP tools to call autonomously
GitHub API
```

---

### Discovery 2: The Task String Must Be Natural Language — NOT Technical Tool Instructions

**What we found:**
When the task string sent to Foundry via A2A contained explicit tool names and parameters like:
```
"Use create_repository tool with autoInit:true in rajeshaldanathcorp account..."
```
Foundry returned a **500 Internal Error** immediately. The same operation with simple natural language:
```
"create a new private GitHub repo called X"
```
Completed in **9.9 seconds** with `TASK_STATE_COMPLETED`.

**Why:**
The official Microsoft A2A documentation confirms the message content should be plain text:
```python
# From Microsoft Learn — Enable incoming A2A on a Foundry agent
message = new_text_message("Hello, what can you do?", role=Role.ROLE_USER)
```
The Foundry agent passes the incoming message through **gpt-5.4** (the LLM) which autonomously decides which GitHub MCP tools to call. Over-specifying tool names and parameters confuses the LLM and causes Foundry to fail internally with a 500.

**Rule:** Always send natural language to the Foundry agent. Never include JSON, tool names, or structured parameters in the task string.

**Reference:** [Enable incoming A2A — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint)

---

### Discovery 3: The MCP Server Tool Description IS The New SKILL.md

**What we found:**
Since Cowork reads the tool description from `server.js` to understand intent, the `delegate_to_github_agent` tool description is now the single source of truth for all behaviour — replacing SKILL.md entirely.

**Current production description in `server.js`** contains:
- 7 intent categories (READ-ONLY, DIRECT COMMIT, REPO MANAGEMENT, BRANCH+PR, PR/ISSUE OPERATION, WORKFLOW/ACTIONS, EXPLICIT OVERRIDE)
- Natural language task format rules
- Default behaviour for each category (e.g. direct commit vs branch+PR)
- Repo resolution rule — always ask if repo not specified

**What changed vs old SKILL.md approach:**

| | Old Approach (SKILL.md in plugin) | New Approach (server.js description) |
|---|---|---|
| Where intent logic lives | SKILL.md in plugin zip | `delegate_to_github_agent` description in `server.js` |
| How to update | Re-upload plugin zip to admin portal | Redeploy `server.js` to Azure App Service |
| Plugin re-upload needed | ✅ Yes every time | ❌ Never |
| Takes effect | After admin approves new plugin version | Immediately on App Service restart |
| Task format sent to Foundry | Explicit tool names + structured params | Natural language only |

---

### Discovery 4: Foundry Agent Card — A2A Discovery Metadata

**What we found:**
The Azure AI Foundry portal has an **"Edit agent card"** option on the A2A protocol endpoint. This agent card is the A2A discovery metadata — when any A2A client calls the endpoint, it can read this card to understand what the agent can do.

**Agent card fields:**
- **Name** — agent name
- **Description** — what the agent does overall
- **Skills** — array of skill objects, each with name, tags, description, and example prompts (max 5 tags, max 5 example prompts per skill)

**What we configured:**
```
Name: github-agent
Description: NathCorp GitHub agent — autonomously performs GitHub operations...
Skill name: github-agent
Tags: github, code, bugfix, pullrequest, repository
Skill description: Full intent classification (READ-ONLY, DIRECT COMMIT, BRANCH+PR, etc.)
Example prompts: 5 key prompts covering all major categories
```

**Important:** The agent card is A2A protocol metadata — it helps the Foundry agent understand its own capabilities. It is separate from the MCP tool description that Cowork reads. Both work together.

---

### Discovery 5: Foundry "Allowed GitHub Tools" Field — Do Not Use

**What happened:**
During debugging of `create_repository` failures, we added `create_repository` to the "Allowed GitHub tools" field in the Foundry GitHub MCP configuration. This **restricted the agent to only that one tool**, breaking all other operations (list repos returned "I can only create repositories").

**Root cause of original `create_repository` failure:**
Was NOT a tool permission issue. Was the **task string format** — over-specified instructions caused a 500. Once task string was changed to natural language (`"create a new private GitHub repo called X"`), it worked in 9.9 seconds.

**Rule:** Leave the "Allowed GitHub tools" field **completely empty** — empty means all 114 GitHub MCP tools are available. Never add specific tool names to this field unless you intentionally want to restrict the agent.

---

### Discovery 6: Foundry A2A Returns TASK_STATE_COMPLETED Inline — Polling Not Always Needed

**What we found:**
For most operations, Foundry returns `TASK_STATE_COMPLETED` directly in the `SendMessage` response — no polling via `GetTask` is needed at all. The task completes synchronously within the SendMessage call.

**Timing data from live tests:**

| Operation | Time to complete | Method |
|---|---|---|
| List repositories | ~8s | Inline in SendMessage response |
| Add a file (direct commit) | ~10s | Inline in SendMessage response |
| Create repository | ~9.9s | Inline in SendMessage response |
| Fix code + branch + PR | ~15-20s | Inline in SendMessage response |
| List open PRs | ~8s | Inline in SendMessage response |

All operations complete well within the **60 second Cowork MCP timeout**.

**What was causing the original `create_repository` 500 error:**
Over-specified task string (explicit tool names + parameters) → Foundry LLM confused → 500 returned before task even starts. Nothing to do with timeouts or polling.

---

### Discovery 7: `inputSchema` Task Parameter Description Also Shapes The Task String

**What we found:**
The `server.js` MCP tool has two places that influence how Cowork builds the task string:
1. The **tool description** (top level) — tells Cowork what the tool does and intent categories
2. The **`task` parameter description** in `inputSchema` — tells Cowork how to format the task string itself

The old `inputSchema` task description said:
```
"Always include: full repo path as rajeshaldanathcorp/<repo>, branch name to create, default branch is master..."
```
This caused the orchestrator to add technical details that over-specified the task and triggered Foundry 500 errors.

**Fixed to:**
```
"Natural language instruction for the GitHub agent. Write exactly what you want done — the agent decides which tools to use."
```

**Rule:** Both the tool description AND the inputSchema parameter description must be kept consistent and aligned with natural language intent.

---

### Updated Key Technical Discoveries Table

| Discovery | Detail |
|-----------|--------|
| Cowork reads MCP tool description directly | Plugin SKILL.md is irrelevant as long as MCP URL is in manifest |
| Task string must be natural language | Explicit tool names/params cause Foundry 500 errors |
| TASK_STATE_COMPLETED returned inline | Most operations complete in SendMessage, no polling needed |
| inputSchema task description shapes task string | Must also be natural language guidance, not structured instructions |
| Allowed GitHub tools field | Leave empty — any value restricts the agent to only those tools |
| Agent Card | A2A discovery metadata — configurable in Foundry portal, supplements MCP description |
| `create_repository` working phrase | `"create a new private GitHub repo called X"` — 9.9 seconds end-to-end |

---

### Proven Working — 2026-06-11 (Full Re-test)

All tested end-to-end from Microsoft Cowork with updated `server.js` description:

| Operation | Result | Time |
|-----------|--------|------|
| List all GitHub repositories | ✅ 7 repos returned | ~8s |
| Add file directly to master (no PR) | ✅ Committed directly, no branch created | ~10s |
| Create new repository | ✅ mcp-description-test created | ~9.9s |
| Fix README + raise PR | ✅ Branch created, PR #9 raised | ~17s |
| List open PRs | ✅ PR #8 and #9 returned | ~8s |

---

## Official References

- [Enable incoming A2A on Foundry agent — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint)
- [A2A Protocol v1.0 Specification](https://a2a-protocol.org/latest/specification/)
- [Connect to A2A agent endpoint — Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/agent-to-agent)
- [GitHub MCP Tool on Foundry — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)
- [Agent Factory: MCP and A2A — Azure Blog](https://azure.microsoft.com/en-us/blog/agent-factory-connecting-agents-apps-and-data-with-new-open-standards-like-mcp-and-a2a/)
- [Foundry RBAC roles — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)

---

*NathCorp Internal — Phase 3 | Rajesh (rajesh.alda@nathcorp.com)*
*Version: 3.0 | Updated: 2026-06-11*
