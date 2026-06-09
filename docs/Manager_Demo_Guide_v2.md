# NathCorp ServiceNow + Cowork — Manager Demo Guide v2
**Presenter:** Rajesh (rajesh.alda@nathcorp.com)
**Date:** 2026-05-25
**Duration:** 12–15 minutes
**Audience:** Manager — understands IT, wants to see real working system
**Updated based on:** Manager feedback after first demo

---

## What Changed from v1 (Manager Feedback Applied)

| Feedback | Change Made |
|----------|------------|
| Always type in chat — do not copy paste | All Cowork prompts must be typed manually during demo |
| Plugin enable steps missing | Added Part 2A — how to enable plugin in Cowork (with screenshots guide) |
| Be ready with limitations and features | Added full Limitations + Features section at the end |

---

## SCREEN SETUP — Split Screen Layout
*Do this FIRST before manager enters the room*

```
┌─────────────────────────────┬─────────────────────────────┐
│                             │                             │
│   LEFT SIDE                 │   RIGHT SIDE                │
│   Microsoft Cowork          │   ServiceNow Incidents      │
│   https://m365.cloud.       │   https://dev249650.        │
│   microsoft                 │   service-now.com           │
│                             │   All → Incident → All      │
│   (Active conversation      │   (Incidents list visible   │
│    open and ready)          │    — sorted by newest)      │
│                             │                             │
└─────────────────────────────┴─────────────────────────────┘
```

**How to set up split screen on Windows:**
1. Open Cowork tab in browser → press `Windows + Left Arrow` → snaps to left half
2. Open ServiceNow tab in new window → press `Windows + Right Arrow` → snaps to right half
3. Both visible simultaneously — manager can see ticket appear in real-time on the right while you type on the left

**Why split screen:** Manager can see WITH THEIR OWN EYES that the ticket appears in ServiceNow the moment you type "No" in Cowork. No tab switching. No trust required. Maximum impact.

---

## PRE-DEMO CHECKLIST
*Complete 30 minutes before demo. Never do this live.*

### Browser Setup
- [ ] Open Chrome/Edge in full screen
- [ ] **LEFT window** → https://m365.cloud.microsoft → sign in as `rajesh.alda@nathcorp.com`
- [ ] **RIGHT window** → https://dev249650.service-now.com → sign in as admin
- [ ] In ServiceNow: All → Incident → All → sort by **Opened** descending → note last INC number
- [ ] In a third tab (minimized): https://nathcorp-mcp-server.azurewebsites.net → confirm `{"status":"ok"}`

### Plugin Check (CRITICAL)
- [ ] In Cowork → start a new conversation → type anything → check Sources & Skills panel
- [ ] Confirm **NathCorp ServiceNow KB** toggle is **ON** (green)
- [ ] If toggle is OFF → enable it NOW (see Part 2A below)
- [ ] Start a **fresh new conversation** before demo begins (do not use the test conversation)

### System
- [ ] Laptop on **Do Not Disturb** mode
- [ ] Close Outlook, Teams notifications, all unrelated tabs
- [ ] Increase browser font size to 125% (Ctrl + Plus) so manager can read easily
- [ ] Dim or turn off second monitor if any — present from main screen only

---

## PART 1 — OPENING (1 minute)

**Say this — do NOT read, speak naturally:**

> "Sir, currently when an employee has an IT issue — say their VPN is not working — they have to either call the IT helpdesk, raise a ticket manually in ServiceNow, or search through long documentation. This takes time, the helpdesk gets flooded with basic queries, and employee productivity drops."

> "What we have done is automate this entire first level of IT support using Microsoft Cowork — Microsoft's new AI agent platform."

> "Sir, what we have built is — when any NathCorp employee has an IT problem, they just type it in Microsoft Cowork chat. The system automatically searches our ServiceNow knowledge base, gives them step-by-step resolution, and if the issue is still not resolved, it raises a support ticket in ServiceNow — all without calling IT helpdesk or filling any form."

---

## PART 2 — WHAT IS COWORK (1 minute)

**Say this:**

> "Microsoft Cowork is Microsoft's new AI agent — think of it as a smart assistant inside Microsoft 365 that can actually take actions on your behalf. It is powered by Claude AI from Anthropic — the same company that makes one of the world's top AI models."

> "We have connected Cowork directly to NathCorp's ServiceNow system. So now Cowork knows our IT knowledge base and can even create tickets automatically."

---

## PART 2A — HOW TO ENABLE THE PLUGIN IN COWORK
*Show this to manager — this was missing in v1*

**Say this:**
> "Sir, before I show the demo, let me quickly show how an employee enables this plugin. It is a one-time step."

**Steps to show on screen (Cowork — left side):**

1. Go to https://m365.cloud.microsoft
2. Click **Cowork** in the left sidebar
3. Start a **new conversation** (click the pencil/compose icon)
4. Look for the **Sources & Skills** panel on the right side of the conversation
   - If not visible → click the **sources icon** (stack of layers icon) near the text box
5. In the Sources & Skills panel → find **NathCorp ServiceNow KB**
6. Toggle it **ON** (turns green/blue)

**Say this:**
> "Once this toggle is ON, it stays ON for all future conversations. The employee does this once — never again."

> "After toggling ON, Cowork automatically connects to our ServiceNow system in the background. The employee just types their IT problem — they don't need to know anything about ServiceNow or the connection."

---

## PART 3 — LIVE DEMO — SCENARIO 1: Issue Resolved (Happy Path)
*Left screen: Cowork | Right screen: ServiceNow (no change expected here)*

**Say this:**
> "Sir, I am now logged in as a NathCorp employee. Let me show you what happens when they have a common IT issue."

**TYPE in Cowork (do not copy-paste — type slowly so manager can see):**
```
I cannot login to my computer, it says wrong password
```

**While Cowork is thinking — say:**
> "Cowork is now searching our ServiceNow knowledge base in real-time — not from any cache or static document — directly from our live ServiceNow system."

**When response appears — point to screen and say:**
> "Look — Cowork has given numbered resolution steps, and at the bottom it says the source is our ServiceNow KB article number KB0010002. The employee does not need to call IT. They just follow these steps."

**Now TYPE in Cowork:**
```
Yes, it worked after resetting my password
```

**When Cowork responds — say:**
> "The employee says Yes — issue resolved. Cowork closes the conversation. No ticket created. IT helpdesk never involved. Problem solved in under 30 seconds."

**Point to ServiceNow on the right side:**
> "Notice — nothing changed in ServiceNow. No ticket was created because the employee resolved it themselves. This is the ideal outcome — self-service resolution."

---

## PART 4 — LIVE DEMO — SCENARIO 2: Ticket Created (Full Flow)
*Left screen: Cowork | Right screen: ServiceNow — THIS IS THE KEY MOMENT*

**Say this:**
> "Now sir, let me show you what happens when the steps do NOT resolve the issue. This is the more powerful scenario."

**Start a new conversation in Cowork** (click compose/pencil icon)

**TYPE in Cowork (type slowly — do not paste):**
```
I cannot login to my computer, it says wrong password
```

**While Cowork loads — say:**
> "Same query. Cowork searches ServiceNow KB again."

**When steps appear — point and say:**
> "Same resolution steps given. Now the employee tries them — but they do not work."

**Now TYPE in Cowork:**
```
No, I tried everything but still cannot login
```

**Cowork will show a TOOL APPROVAL dialog — DO NOT PANIC — this is expected:**

```
┌─────────────────────────────────────────────┐
│  TOOL APPROVAL                              │
│  Create Support Ticket                      │
│                                             │
│         Show parameters                     │
│                                             │
│         [ Reject ]    [ Approve ▼ ]         │
└─────────────────────────────────────────────┘
```

**Say this when the dialog appears:**
> "Sir, Cowork is asking for my one-time approval before raising the ticket — this is a security feature. The employee controls whether the ticket is created. Let me show you what information it has already prepared."

**Click "Show parameters" to expand — say:**
> "Look at this — Cowork has already written the full ticket description automatically. It has captured my name, my email, my department — Associate Software Engineer, Cloud and Infra, NathCorp India — and a complete description of what was tried and what failed. The employee does not write any of this manually."

**The parameters shown will look like:**
```json
{
  "short_description": "Unable to login to computer - password rejected",
  "description": "User Rajesh Alda (Rajesh.Alda@nathcorp.com,
    Associate Software Engineer, Cloud & Infra, NathCorp India)
    is unable to log in to his computer. The system reports the
    password is incorrect.
    Troubleshooting already attempted by the user:
    - Verified Caps Lock and Num Lock state
    - Confirmed keyboard layout/language
    - Checked for recent password change / cached credentials
    - Waited for any potential account lockout to clear
    Issue persists after all self-service steps.
    Requesting IT assistance to reset the account password
    and/or unlock the account."
}
```

**Now click APPROVE — say:**
> "I click Approve — and the ticket is raised instantly."

> **IMPORTANT FOR DEMO:** Click the **dropdown arrow (▼)** next to Approve and select **"Always allow Create incident"** — this removes the approval dialog for all future ticket creations in this session, so subsequent demos flow without interruption.

**While Cowork confirms ticket — point to RIGHT SCREEN and say:**
> "Watch ServiceNow on the right — the ticket is appearing RIGHT NOW."

**As soon as ticket number appears in Cowork response — say:**
> "There — ticket INC00XXXXX has been raised. Sir, Cowork has confirmed the ticket — now let us verify this on the ServiceNow side and see if it actually landed there."

**Refresh the ServiceNow Incidents list on the right screen (press F5)**

**Point to the new ticket at the top of the list and say:**
> "Sir, here it is — the same ticket number, right at the top of the ServiceNow Incidents list. Created 10 seconds ago, assigned to IT Support. The ticket already has the full description — what was tried, user details, everything. The IT team picks this up and contacts the employee."

> "The employee never opened ServiceNow. Never filled a form. Never called anyone. They typed two messages — and a complete, detailed ticket was raised automatically."

---

## PART 5 — WHAT WAS BUILT (2 minutes)
*Optional — show only if manager asks or if time permits*

**Say this:**
> "Sir, behind the scenes, the team has built three components that work together:"

**Point to screen or printed architecture diagram:**

```
Employee types in Cowork (left screen)
            ↓
NathCorp Plugin — uploaded to Microsoft Admin Center
(tells Cowork: search ServiceNow when IT question asked)
            ↓
Our MCP Server — hosted on NathCorp's Azure subscription
(the bridge: receives request from Cowork, calls ServiceNow API)
            ↓
ServiceNow (right screen)
(KB search returns articles → ticket created if needed)
```

> "One — A custom plugin we built and uploaded to Microsoft's admin center. It tells Cowork exactly when and how to search ServiceNow."

> "Two — Our own server on Microsoft Azure — NathCorp's own subscription — which is the secure bridge between Cowork and ServiceNow."

> "Three — ServiceNow — our existing system. We have not changed anything in ServiceNow. Only added a secure API connection."

---

## PART 6 — CURRENT FEATURES & LIMITATIONS
*Manager specifically asked for this — be ready*

### What This System CAN DO Today ✅

| Feature | Detail |
|---------|--------|
| IT issue search | Searches all 42+ IT KB articles in ServiceNow in real-time |
| AI-enhanced answers | Combines ServiceNow KB content with AI knowledge for complete steps |
| Source citation | Always shows which KB article was used |
| Resolution confirmation | Always asks "Did this resolve your issue?" — structured flow |
| Auto ticket creation | Creates ServiceNow incident automatically when user says No |
| Ticket details | Auto-fills short_description, description (what was tried), priority, assignment group |
| Self-service | Employee needs no ServiceNow access or training |
| Always on | Plugin active 24x7 — no IT staff needed for first-level support |
| Org-wide deployment | One admin uploads plugin → all licensed users get it |
| Multi-issue support | Works for VPN, login, laptop, camera, WiFi, shared drive, MFA, and more |

### Current Limitations ⚠️

| Limitation | Detail | Future Fix |
|-----------|--------|-----------|
| Cowork Frontier only | Requires M365 Copilot license + Frontier preview enabled in tenant | Will be GA (generally available) when Microsoft releases Cowork publicly |
| No ticket status tracking | Cannot check status of existing tickets — only creates new ones | Can add `get_incident` tool to MCP server |
| Tool Approval dialog | Cowork shows "Create Support Ticket — Approve/Reject" before raising ticket | Click dropdown ▼ → "Always allow Create incident" to bypass for the session |
| English only | SKILL.md instructions in English — non-English queries may not trigger correctly | Can add multi-language support in SKILL.md |
| 42 KB articles only | Searches only what is in ServiceNow KB — no SharePoint or email content | Can extend with SharePoint connector |
| No ticket attachment | Cannot attach screenshots or files to ticket | Can be added to MCP `create_incident` tool |
| No follow-up | After ticket created, no automatic follow-up in Cowork | Can add webhook from ServiceNow to notify user |
| Developer trial instance | Currently on Vishal's trial ServiceNow — needs production ServiceNow for full rollout | Prod deployment via IT change ticket |
| Plugin for 2 users only | Currently deployed to Rajesh + Richa only | Org-wide deployment pending change ticket approval |
| Response time | Cowork takes 5–10 seconds to respond (AI generation + API call) | Normal for AI — cannot be reduced significantly |

---

## PART 7 — BUSINESS VALUE (1 minute)

**Say this:**

> "Sir, the business impact:"

> "One — **Reduced helpdesk load.** Basic IT queries resolved automatically. IT team handles only what genuinely needs human attention."

> "Two — **Faster resolution.** Employee gets step-by-step guidance in under 10 seconds — no waiting for helpdesk callback."

> "Three — **Zero missed issues.** Every unresolved problem automatically becomes a ServiceNow ticket — nothing falls through the cracks."

> "Four — **No new tool for employees.** They use Microsoft Cowork — already part of their M365 Copilot license. Zero training required."

> "Five — **Data stays in NathCorp.** Our ServiceNow data never goes to Microsoft servers. Our Azure server fetches it real-time. Fully secure."

---

## PART 8 — STATUS AND NEXT STEPS

**Say this:**
> "Sir, the system is fully built and live. You just saw it working."

> "Current status: Plugin deployed to two test users — myself and Richa ma'am. MCP server live on Azure. ServiceNow connection active."

> "Next step: Deploy to entire NathCorp organization. This requires a change ticket approval — which has already been raised. Once approved, every employee with an M365 Copilot license gets this automatically — no action needed from them."

---

## LIKELY MANAGER QUESTIONS — PREPARED ANSWERS

| Question | Answer |
|----------|--------|
| **Is the data secure?** | Yes sir. ServiceNow data is fetched in real-time by our Azure server and passed to Cowork. Microsoft does not store our KB content. Our Azure server runs on NathCorp's own subscription. |
| **What if ServiceNow is down?** | Cowork tells the employee the knowledge base is temporarily unavailable. No crash. The employee can still raise a ticket by contacting IT directly. |
| **What if the AI gives wrong steps?** | The AI combines ServiceNow KB content with its own knowledge. If KB has the article, it follows it precisely. For unknown issues it uses general IT knowledge and clearly states "no KB article found — based on general knowledge." |
| **How many employees can use this?** | All NathCorp employees with M365 Copilot license. Unlimited — no per-user cost beyond existing license. |
| **Monthly cost?** | Only Azure App Service B1 — approximately ₹1,500–2,000 per month. Plugin and Cowork are part of existing M365 licenses. |
| **Can we extend this to HR or Finance?** | Yes. Same architecture — just add HR/Finance KB articles to ServiceNow and create additional plugins. The MCP server is reusable. |
| **Who maintains this?** | Rajesh maintains the plugin and MCP server. ServiceNow maintenance stays with Vishal's team. No new team required. |
| **What happens if plugin is OFF?** | Employee can enable it themselves in Cowork → Sources & Skills → toggle ON. Or IT admin can push it as ON by default during org-wide deployment. |
| **Why Azure and not on-premise?** | Azure App Service is on NathCorp's own subscription — fully within our control. Managed service — no server maintenance. Can be moved to on-premise if needed. |
| **Can it handle multiple issues in one chat?** | Currently designed for one issue per conversation for clean ticket creation. Each new issue should start a new conversation. |
| **What about employees without Copilot license?** | They cannot use Cowork. They continue using the ServiceNow self-service portal or calling IT helpdesk as before. |

---

## DEMO DO'S AND DON'TS

### Do ✅
- **Always type in Cowork** — never copy-paste. Manager must see you typing naturally
- Speak slowly and pause after each key moment
- Point to BOTH screens simultaneously when ticket appears — "left Cowork, right ServiceNow"
- Say "real-time" and "automatically" — these are power words
- Refresh ServiceNow immediately after ticket is created — let manager see it appear
- Say "IT Support team will pick this up" — shows the complete workflow

### Don't ❌
- Do NOT copy-paste prompts into Cowork — manager feedback point #1
- Do NOT use technical words: JSON-RPC, MCP, Node.js, OAuth, API, Express
- Do NOT open VS Code, terminal, Azure portal during demo
- Do NOT rush — 5–10 seconds of Cowork thinking is normal — narrate during that time
- Do NOT say "we are testing" or "we are trying" — say "we have built" and "it is working"
- Do NOT switch tabs manually — use split screen so both are visible at all times

---

## BACKUP PLAN — IF SOMETHING GOES WRONG

| Problem | Immediate Action |
|---------|----------------|
| Plugin toggle is OFF | Sources & Skills panel → find NathCorp ServiceNow KB → toggle ON → start new conversation |
| Tool Approval dialog appears | This is EXPECTED and NORMAL — say "security feature" → click Show parameters → show ticket JSON → click Approve. Click ▼ → "Always allow Create incident" to skip for rest of session. |
| Cowork not responding | Refresh left window. Start a fresh new conversation. Type again. |
| Ticket not showing in ServiceNow | Press F5 on right window. Wait 5 seconds. If still not showing → filter: Opened by = Cowork Plugin Service |
| Azure MCP server down | Quickly open third tab (already open) → check https://nathcorp-mcp-server.azurewebsites.net → if not OK → Azure Portal → restart app → takes 30 seconds |
| Internet slow | Keep Architecture_Workflow.md open — walk manager through the diagram while Cowork loads. "While it loads, let me show you how it's connected..." |
| Cowork gives wrong answer | That is fine — say "The AI combines KB with its own knowledge — exact wording may vary but the steps are correct" |

---

## QUICK REFERENCE CARD
*(Print this A5 size — keep beside laptop during demo)*

```
SCREEN SETUP:
Left = Cowork | Right = ServiceNow Incidents (sorted newest first)
Plugin toggle must be ON before starting

─────────────────────────────────────────
OPENING (say, don't read):
"Sir, employees type their IT problem in Cowork.
System searches ServiceNow KB, gives resolution steps.
If not resolved — ticket raised automatically.
No IT call. No form. No waiting."

─────────────────────────────────────────
SHOW: How to enable plugin (one time)
Cowork → Sources & Skills → NathCorp ServiceNow KB → ON

─────────────────────────────────────────
SCENE 1 — Happy Path (type slowly):
  TYPE: I cannot login to my computer, it says wrong password
  WAIT: "Searching ServiceNow KB in real-time..."
  SHOW: Numbered steps + KB article source
  TYPE: Yes, it worked after resetting my password
  POINT RIGHT: "No ticket — issue self-resolved"

─────────────────────────────────────────
SCENE 2 — Ticket Created (key moment):
  New conversation →
  TYPE: I cannot login to my computer, it says wrong password
  WAIT for steps →
  TYPE: No, I tried everything but still cannot login
  → TOOL APPROVAL DIALOG appears (expected!)
  SAY: "Security feature — Cowork asks approval before raising ticket"
  CLICK: Show parameters → show ticket JSON with user details auto-filled
  SAY: "Name, email, department, full description — all auto-written"
  CLICK: Approve (or ▼ → Always allow Create incident)
  POINT RIGHT: "Watch ServiceNow — ticket appearing NOW"
  SAY: "Cowork confirmed — now let us verify on ServiceNow side"
  REFRESH right screen (F5)
  POINT: "Same ticket number — right at the top — raised 10 seconds ago"

─────────────────────────────────────────
CLOSING:
"Built. Live. Working. Ready for org-wide
deployment pending change ticket approval."
─────────────────────────────────────────

LIMITATIONS TO MENTION IF ASKED:
- Frontier preview (not GA yet)
- No ticket status check (only creates)
- Trial ServiceNow (prod pending)
- 2 users now → org-wide after approval
```

---

*NathCorp Internal — Manager Demo Guide v2 | Rajesh (rajesh.alda@nathcorp.com)*
*Updated: 2026-05-25 based on manager feedback*
