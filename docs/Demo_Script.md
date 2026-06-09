# NathCorp Cowork + ServiceNow — Demo Script
**Presenter:** Rajesh (rajesh.alda@nathcorp.com)
**This is your word-for-word speaking script. Read naturally — do not rush.**

---

## BEFORE MANAGER WALKS IN — SCREEN SETUP

```
LEFT HALF OF SCREEN          RIGHT HALF OF SCREEN
─────────────────────         ─────────────────────
Microsoft Cowork              ServiceNow — Incidents
m365.cloud.microsoft          dev249650.service-now.com
                              All → Incident → All
New conversation open         Sorted: Newest first
Plugin toggle ON ✅            Note last INC number
```

**Windows shortcut:**
- Cowork window → `Windows key + Left Arrow`
- ServiceNow window → `Windows key + Right Arrow`

**Checklist before manager enters:**
- [ ] Plugin toggle ON (Sources & Skills → NathCorp ServiceNow KB → green)
- [ ] ServiceNow Incidents list open, sorted newest first
- [ ] Font size 125% (Ctrl + Plus) — so manager can read
- [ ] Do Not Disturb ON — no popups, no notifications
- [ ] Fresh new conversation open in Cowork — do not use test conversation

---

## THE SCRIPT

---

### OPENING — WHAT WE HAVE BUILT

> **"Good evening, sir."**

> **"Today, I am going to present on Cowork and its integration with ServiceNow. We implemented this integration with the help of MCP connectors and plugins."**

> **"Let me quickly explain what that means in simple terms."**

> **"Currently, when any NathCorp employee has an IT problem — say their VPN is not working, or they cannot login to their laptop — they have two options: call the IT helpdesk, or raise a ticket manually in ServiceNow. Both take time. The helpdesk gets flooded with basic queries. The employee waits. Productivity drops."**

> **"What we have built —"** *(pause)* **"— solves this completely. The employee just opens Microsoft Cowork, types their problem in the chat — and Cowork automatically searches our ServiceNow knowledge base, gives them step-by-step resolution, and if the problem is still not solved — it raises a ServiceNow support ticket on their behalf. No phone call. No form. No waiting."**

---

### HOW TO ENABLE — ONE TIME STEP
*(Show on left screen while speaking)*

> **"Let me first show you how an employee activates this — it is a one-time step."**

*(Point to Cowork on left screen)*

> **"The employee opens Cowork at m365.cloud.microsoft and starts a new conversation. At the top of the chat there is a '+' button. They click it — select 'Manage plugins' — find our plugin NathCorp ServiceNow KB in the list — and toggle it ON."**

*(Toggle ON if not already done)*

> **"That is it. Once toggle. It stays ON permanently. After this the employee just types — they never need to touch any settings again."**

---

### LIVE DEMO — SCENE 1: ISSUE RESOLVED
*(Left screen active — copy paste the prompt)*

> **"Let me show you the first scenario — where an employee has an IT issue and Cowork resolves it completely on its own, without any IT helpdesk involvement."**

> **"Let me paste a prompt for this scenario."**

*(PASTE in Cowork:)*
```
I am unable to connect to WiFi
```

*(Cowork shows "Thought process ▶" — this is the thinking gap — do NOT stay silent — say:)*

> **"You can see Cowork is thinking right now — that Thought process indicator means it is actively working in the background. It is connecting to our ServiceNow system, running the search, reading the KB articles, and preparing the response."**

> **"This is real-time — not from any cache, not from any static document — directly from our live ServiceNow system."**

*(When response appears — point to left screen:)*

> **"As we can see — Cowork has given complete, numbered resolution steps. The employee reads these steps, tries them, and in most cases the issue is resolved — without involving IT at all."**

*(PASTE in Cowork:)*
```
Yes, issue resolved
```

*(When Cowork responds — say:)*

> **"The employee confirms — yes, resolved. Cowork closes the conversation. IT helpdesk never involved. The entire thing took under 30 seconds."**

---

### LIVE DEMO — SCENE 2: TICKET CREATED
*(Start a new conversation in Cowork — click compose/pencil icon)*

> **"Now let us look at another scenario — what happens when the employee has tried everything but still could not resolve the issue. In that case, Cowork does not just stop — it automatically raises a support ticket in ServiceNow on behalf of the employee."**

> **"Starting a fresh conversation now — same issue, but this time the employee could not resolve it."**

> **"Let me again copy the same prompt as we used earlier."**

*(PASTE in Cowork:)*
```
I am unable to connect to WiFi
```

*(Cowork shows "Thought process ▶" again — fill the gap — say:)*

> **"Again the Thought process is running — Cowork is going back to ServiceNow, fetching the same KB article, and preparing the response. Every time an employee asks, it searches live — it never uses old or cached data."**

*(When steps appear — say:)*

> **"The employee receives the steps. Let us assume they tried all of them — but the issue is still not resolved. So they reply No."**

*(PASTE in Cowork:)*
```
No, I tried everything but still facing same issue
```

*(Cowork shows "Thought process ▶" one more time — say:)*

> **"Cowork is now thinking about how to respond — it understood the employee said No, so it is preparing to raise a ticket. It is automatically writing the ticket description, capturing the user details, and summarising all the steps that were tried."**

*(A dialog box appears — "TOOL APPROVAL — Create Support Ticket" — point to it calmly:)*

> **"Cowork is asking for approval before raising the ticket — this is a built-in safety feature. The employee is always in control. No ticket is created without the employee's permission."**

> **"Let me show you what Cowork has already prepared."**

*(Click "Show parameters":)*

> **"Look at this — Cowork has automatically written the entire ticket. My name, my email, my designation, my department — all captured from my Microsoft 365 account. And below that — a complete description of the problem, every step that was tried, and the conclusion that the issue needs IT attention. The employee has not written a single word of this."**

*(Click APPROVE — then immediately click the dropdown arrow ▼ → select "Always allow Create incident"):*

> **"I approve — and I am also selecting Always Allow so it does not ask again in this session."**

*(When ticket number appears in Cowork — say:)*

> **"Cowork has confirmed the ticket. Now let us verify on the ServiceNow side and see if it actually landed there."**

> **"Let me copy the incident number and paste it in ServiceNow Incidents and see if the ticket has been created or not."**

*(Press F5 on ServiceNow — right screen refreshes — new ticket appears at top)*

*(Point to the new ticket:)*

> **"There it is — the same ticket number, right at the top of the ServiceNow Incidents list. Created 10 seconds ago. Assigned to IT Support. The ticket has the full description — user identity, problem details, every step that was tried — all written automatically by Cowork."**

> **"The employee opened no ServiceNow. Filled no form. Made no phone call. They typed two messages — and a complete, detailed support ticket was raised automatically in ServiceNow."**

> **"The IT team now picks this up and contacts the employee directly."**

> **"Now let us see another scenario where I will run the prompt and my colleague Sonalika will explain it."**

---

*NathCorp Internal — Demo Script | Rajesh (rajesh.alda@nathcorp.com)*
*Version: Final | Updated: 2026-05-25*
