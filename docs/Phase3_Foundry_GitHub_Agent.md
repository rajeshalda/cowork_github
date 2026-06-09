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

## Official References

- [Enable incoming A2A on Foundry agent — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/enable-agent-to-agent-endpoint)
- [A2A Protocol v1.0 Specification](https://a2a-protocol.org/latest/specification/)
- [Connect to A2A agent endpoint — Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/agent-to-agent)
- [GitHub MCP Tool on Foundry — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)
- [Agent Factory: MCP and A2A — Azure Blog](https://azure.microsoft.com/en-us/blog/agent-factory-connecting-agents-apps-and-data-with-new-open-standards-like-mcp-and-a2a/)
- [Foundry RBAC roles — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)

---

*NathCorp Internal — Phase 3 | Rajesh (rajesh.alda@nathcorp.com)*
*Version: 2.1 | Updated: 2026-06-09*
