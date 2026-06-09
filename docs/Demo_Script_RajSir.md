# NathCorp Cowork Demo — Raj Sir
**Author:** Rajesh (rajesh.alda@nathcorp.com)
**Demo Date:** 2026-06-10
**Repo:** rajeshaldanathcorp/cowork-demo

---

## What This Demo Shows

Microsoft Cowork delegates a real GitHub task to an Azure AI Foundry Agent via A2A protocol.
The Foundry Agent autonomously reads code, finds a bug, fixes it, raises a PR, and merges it.
**Zero human code written at any step.**

```
You (Cowork)
    ↓  types a plain English instruction
NathCorp MCP Bridge  (Azure App Service)
    ↓  A2A v1.0 protocol
Azure AI Foundry github-agent  (MPN-MTT-APP-5)
    ↓  GitHub MCP tool
GitHub API  →  cowork-demo repo
```

---

## One-Time Setup (Do Before Demo)

### Step 1 — Create the repo on GitHub

1. Go to https://github.com/new
2. Owner: **rajeshaldanathcorp**
3. Repo name: **cowork-demo**
4. Visibility: **Public**
5. Check **"Add a README file"**
6. Click **Create repository**

### Step 2 — Add the file with the bug

Create file `src/calculator.js` in the repo with this content:

```javascript
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b + 1; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

module.exports = { add, subtract, multiply, divide };
```

> The bug is on line 2: `return a - b + 1` — the `+ 1` makes every subtraction wrong.
> For example: `subtract(5, 3)` returns `3` instead of `2`.

Commit message: `"initial commit: add calculator module"`

---

## Demo Prompts — Paste Into Cowork

---

### Prompt 1 — Confirm the system is working

```
List all GitHub repositories under the rajeshaldanathcorp account.
```

**What Raj Sir sees:**
- Cowork calls the bridge → Foundry lists all repos including cowork-demo
- Proves the full pipeline is live

---

### Prompt 2 — Read the file and find the bug

```
In GitHub repo rajeshaldanathcorp/cowork-demo, read the file src/calculator.js on the master branch and review it for any bugs or logic errors. Default branch is master.
```

**What Raj Sir sees:**
- Foundry agent reads the file via GitHub MCP
- Agent identifies the bug: `subtract returns a - b + 1` instead of `a - b`
- No human had to look at the code

---

### Prompt 3 — Fix the bug, raise a PR (the main demo)

```
In GitHub repo rajeshaldanathcorp/cowork-demo, there is a bug in src/calculator.js — the subtract function returns a - b + 1 instead of a - b, which gives wrong results. Default branch is master. Create branch fix/subtract-off-by-one from master, fix the subtract function to return a - b, commit with message "fix: correct subtract off-by-one error", and raise a Pull Request against master with title "Fix: subtract function off-by-one error" and a clear description of what was wrong and what was fixed.
```

**What Raj Sir sees:**
- Foundry agent creates a branch automatically
- Edits the file, fixes the bug
- Raises a PR with a proper title and description
- All done in under 60 seconds

---

### Prompt 4 — Merge the PR

```
In GitHub repo rajeshaldanathcorp/cowork-demo, find the open PR for branch fix/subtract-off-by-one and merge it into master.
```

**What Raj Sir sees:**
- Foundry agent finds the PR and merges it
- Fix is now live on master
- Full cycle complete: bug found → fixed → merged

---

### Optional Prompt 5 — Verify the fix (bonus)

```
In GitHub repo rajeshaldanathcorp/cowork-demo, read the latest commit on master and confirm the subtract bug has been fixed in src/calculator.js.
```

**What Raj Sir sees:**
- Agent reads master after the merge
- Confirms `subtract` now returns `a - b` correctly
- End-to-end verification without opening GitHub

---

## What To Say During Each Step

| Prompt | What to say to Raj Sir |
|--------|----------------------|
| Prompt 1 | "I'm just asking Cowork in plain English — no commands, no code." |
| Prompt 2 | "The agent is reading our actual GitHub file right now through the Microsoft AI pipeline." |
| Prompt 3 | "Watch — it will create a branch, fix the code, and raise a PR. Fully autonomous." |
| Prompt 4 | "Now I'll ask it to merge. One sentence." |
| Prompt 5 | "Let's verify the fix is actually on master now." |

---

## Key Points To Highlight

- **No Azure portal open** — everything through Cowork chat
- **No GitHub open** — agent handles it all
- **Two AI systems talking** — Cowork (Microsoft) + Foundry Agent (Azure) via A2A protocol
- **Production grade** — running on Azure App Service with Managed Identity, no hardcoded credentials
- **Traceable** — every call is logged in App Insights (MPN-MTT-APP-5)

---

## If Something Goes Wrong

| Problem | What to do |
|---------|-----------|
| "An internal error occurred" | Wait 10 seconds, send the same prompt again — usually a cold start |
| Agent does wrong thing | Say "that's not right, let me rephrase" — shows the system is interactive |
| Timeout | Rephrase with simpler task — complex multi-step sometimes needs 2 tries |

---

## Infrastructure (For Reference Only — Don't Show)

| Resource | Value |
|----------|-------|
| MCP Bridge | https://nathcorp-mcp-server.azurewebsites.net |
| Foundry Project | MPN-MTT-APP-5 (subscription ab16955e) |
| A2A Version | 1.0 |
| Model | gpt-5.4-2026-03-05 |

---

*NathCorp Internal — Demo Script | Rajesh (rajesh.alda@nathcorp.com)*
*Version: 1.0 | Created: 2026-06-09*
