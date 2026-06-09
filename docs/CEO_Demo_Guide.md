# NathCorp ServiceNow + Cowork Integration — CEO Demo Guide
**Presenter:** Rajesh (rajesh.alda@nathcorp.com)
**Date:** 2026-05-24
**Duration:** 10–12 minutes
**Audience:** CEO — non-technical, business-focused

---

## Before You Start — Pre-Demo Checklist

Do this **30 minutes before** the demo. Do NOT do this live in front of CEO.

- [ ] Open browser → go to https://m365.cloud.microsoft → sign in as `rajesh.alda@nathcorp.com`
- [ ] Open Cowork → start a new conversation → confirm **NathCorp ServiceNow KB** skill is toggled **ON** in Sources & Skills panel
- [ ] Open a second browser tab → https://dev249650.service-now.com → sign in as admin
- [ ] In ServiceNow → go to **Incidents** list → note current last ticket number (e.g. INC0010006)
- [ ] Open a third tab → https://nathcorp-mcp-server.azurewebsites.net → confirm `{"status":"ok"}` shows
- [ ] Have the Architecture diagram from `Architecture_Workflow.md` open (or printed) to show during explanation
- [ ] Close all unrelated tabs, notifications, and Outlook popups
- [ ] Put laptop on **Do Not Disturb** mode

---

## The One-Line Pitch (Say This First)

> **"Sir, what we have built is — when any NathCorp employee has an IT problem, they just type it in Microsoft Cowork. The system automatically searches our ServiceNow knowledge base, gives them step-by-step resolution, and if the issue is still not resolved, it raises a support ticket in ServiceNow — all without calling IT helpdesk or filling any form."**

---

## Demo Flow — Step by Step

---

### PART 1 — THE PROBLEM (1 minute)
*Set the context. Make CEO feel the pain before showing the solution.*

**Say this:**
> "Sir, currently when an employee has an IT issue — say their VPN is not working — they have to either call the IT helpdesk, raise a ticket manually in ServiceNow, or search through long documentation. This takes time, the helpdesk gets flooded with basic queries, and employee productivity drops."

> "What we have done is automate this entire first level of IT support using Microsoft Cowork — Microsoft's new AI agent platform."

---

### PART 2 — WHAT IS COWORK (1 minute)
*One sentence explanation. CEO does not need technical details.*

**Say this:**
> "Microsoft Cowork is Microsoft's new AI agent — think of it as a smart assistant inside Microsoft 365 that can actually take actions on your behalf. It is powered by Claude AI from Anthropic — the same company that makes one of the world's top AI models."

> "We have connected Cowork directly to NathCorp's ServiceNow system. So now Cowork knows our IT knowledge base and can even create tickets automatically."

---

### PART 3 — LIVE DEMO (5–6 minutes)
*This is the main part. Do it slowly. Let the CEO watch.*

---

#### Demo Scene 1 — Employee Types IT Issue

**Open Cowork at https://m365.cloud.microsoft**

**Say this:**
> "Sir, I am now logged in as a NathCorp employee. Let me show you what happens when they have a common IT issue."

**Type in Cowork:**
```
VPN not working
```

**Wait for response. While it loads, say:**
> "Cowork is now searching our ServiceNow knowledge base in real-time — not from any cache or static document — directly from our ServiceNow system."

**When response appears, point to it and say:**
> "Look — Cowork has given numbered resolution steps, and at the bottom it says the source is our ServiceNow KB article. The employee does not need to call IT. They just follow these steps."

---

#### Demo Scene 2 — Issue Not Resolved → Ticket Created Automatically

**Say this:**
> "Now sir, let us say the employee followed all the steps but the issue is still not resolved. Watch what happens."

**Type in Cowork:**
```
No
```

**Wait for response. While it loads, say:**
> "Cowork is now automatically creating a ServiceNow incident ticket on behalf of the employee — no form, no phone call."

**When ticket number appears (e.g. INC0010007), say:**
> "You can see the ticket number — INC0010007. This has been created in our ServiceNow system right now."

---

#### Demo Scene 3 — Show Ticket in ServiceNow (Proof)

**Switch to the ServiceNow tab (already open)**

**Go to: All → Incident → All**

**Point to the new ticket and say:**
> "Sir, here it is — INC0010007, just created by Cowork, 30 seconds ago. The ticket has the full description of the issue, what steps were tried, and is assigned to the IT Support group. The IT team will now pick this up and contact the employee."

> "The employee never had to open ServiceNow, never had to fill a form, never had to call anyone."

---

#### Demo Scene 4 — Try Another Issue (Optional — if CEO is interested)

**Go back to Cowork → start a new conversation**

**Type:**
```
I forgot my password and cannot login
```

**When response appears:**
> "Sir, same flow — whether it is VPN, password reset, Outlook issue, slow laptop — any IT problem. Cowork searches our KB and responds instantly."

---

### PART 4 — WHAT WAS BUILT (2 minutes)
*Keep it simple. Use the architecture diagram if printed.*

**Say this:**
> "Sir, let me briefly explain what the team has built behind the scenes."

**Point to each part as you explain:**

```
Employee types in Cowork
        ↓
Our custom plugin (NathCorp ServiceNow KB) — deployed on Microsoft admin center
        ↓
Our MCP Server — hosted on Azure (Microsoft cloud) — NathCorp's own subscription
        ↓
ServiceNow — searches KB articles in real-time + creates tickets
```

> "We have three components:"

> **"One — A custom plugin** uploaded to Microsoft's admin center. This tells Cowork to connect to our ServiceNow system whenever an employee asks an IT question."

> **"Two — Our own server hosted on Azure** — NathCorp's Azure subscription — which acts as the bridge between Cowork and ServiceNow. It handles authentication, searches the knowledge base, and creates tickets."

> **"Three — ServiceNow** — our existing IT system. We have not changed anything in ServiceNow. We only created a service account and OAuth connection for secure access."

---

### PART 5 — BUSINESS VALUE (1 minute)
*This is what CEO actually cares about.*

**Say this:**
> "Sir, the business impact of this is:"

> **"One — Reduced helpdesk load.** Basic IT queries are resolved automatically. IT team only gets tickets for issues that genuinely need human attention."

> **"Two — Faster resolution for employees.** Instead of waiting for a helpdesk callback, the employee gets step-by-step guidance in under 10 seconds."

> **"Three — Automatic ticket creation.** Every unresolved issue is tracked in ServiceNow automatically — nothing falls through the cracks."

> **"Four — No new app for employees.** They use Microsoft Cowork which is already part of their M365 Copilot license. Zero training needed."

> **"Five — Data stays in NathCorp.** Our ServiceNow data never goes to Microsoft servers. Our Azure server fetches it real-time and passes it to Cowork. Fully secure."

---

### PART 6 — CURRENT STATUS + NEXT STEP (1 minute)

**Say this:**
> "Sir, the entire integration is built and working. You just saw it live."

> "Currently it is deployed for testing with two users — myself and Richa ma'am. The next step is to deploy it to the entire NathCorp organization through the IT admin center — which requires a change ticket approval."

> "Once approved, every NathCorp employee with an M365 Copilot license will automatically have this capability — no installation needed on their side."

---

## Likely CEO Questions — Prepared Answers

| Question | Answer |
|----------|--------|
| **Is our data safe? Does Microsoft see our ServiceNow data?** | No sir. Our Azure server fetches data from ServiceNow and passes it to Cowork in real-time. Microsoft does not store our KB articles or ticket data. Our Azure server is on NathCorp's own subscription. |
| **What happens if ServiceNow is down?** | Cowork will inform the employee that the knowledge base is temporarily unavailable. The system fails gracefully — no crash. |
| **How many employees can use this?** | All NathCorp employees who have an M365 Copilot license. No limit. No extra cost beyond the existing license. |
| **Did we pay anything extra for this?** | Only the Azure App Service — B1 plan — approximately ₹1,500–2,000 per month. No other cost. The plugin and Cowork are part of existing M365 licenses. |
| **Can this work for HR or Finance queries too?** | Yes sir. The same architecture can be extended to connect other knowledge bases — HR policies, finance guidelines — by adding more KB articles in ServiceNow or creating additional plugins. |
| **Who built this?** | Rajesh built the integration — plugin, MCP server, Azure deployment, ServiceNow OAuth. Vishal set up the ServiceNow instance. Richa and Chandan sir enabled Cowork in our tenant. Sonalika configured tenant access. |
| **How long did this take?** | Approximately 4–5 days from concept to working production integration. |
| **What is Frontier? Is this a stable product?** | Frontier is Microsoft's early access program for new M365 features. Cowork is an official Microsoft product — not a beta or experiment. It will be generally available to all M365 Copilot users when Microsoft releases it. |
| **Can employees use this from Teams or Outlook?** | Currently Cowork runs at https://m365.cloud.microsoft. Microsoft is rolling out Cowork integration into Teams and Outlook as part of the Frontier program. |

---

## Demo Do's and Don'ts

### Do
- Speak slowly — CEO does not need to understand the technology, only the business value
- Let the response fully load before talking — silence is fine while AI generates
- Point to the ticket number in ServiceNow — it is the most powerful proof moment
- Say "real-time" and "automatically" — these are the key words that impress

### Don't
- Do not use words like JSON-RPC, MCP, Node.js, Express, OAuth in front of CEO
- Do not open VS Code or any code editor during demo
- Do not show the Azure portal — not needed for CEO demo
- Do not rush — if Cowork takes 5 seconds to respond, that is normal — just narrate while waiting
- Do not say "we are trying" or "we are testing" — say "we have built" and "it is working"

---

## Backup Plan — If Something Goes Wrong

| Problem | What to Do |
|---------|-----------|
| Cowork does not respond | Refresh the page. Start a new conversation. Try again. |
| Plugin toggle is OFF | Click Sources & Skills panel → toggle NathCorp ServiceNow KB ON |
| Ticket not visible in ServiceNow | Refresh the Incidents list. Filter by Opened by = Cowork Plugin Service |
| Azure server is down | Open https://nathcorp-mcp-server.azurewebsites.net — if not `{"status":"ok"}`, go to Azure Portal → nathcorp-mcp-server → Restart |
| Internet is slow | Have the Architecture_Workflow.md open and walk CEO through the diagram while Cowork loads |

---

## Demo Script — Quick Reference Card
*(Print this and keep it in front of you)*

```
OPENING:
"Sir, we have built an AI-powered IT support assistant using
Microsoft Cowork connected to our ServiceNow system."

SCENE 1 — Type: "VPN not working"
Say: "Searching our ServiceNow KB in real-time..."
Point: "Numbered steps + KB source citation"

SCENE 2 — Type: "No"
Say: "Now watch — ticket created automatically..."
Point: "Ticket number in Cowork response"

SCENE 3 — Switch to ServiceNow
Say: "Here is the ticket — created 30 seconds ago"
Point: "INC number, description, IT Support assignment"

CLOSING:
"Built and working. Ready for org-wide deployment
pending change ticket approval."
```

---

*NathCorp Internal — CEO Demo Preparation | Rajesh (rajesh.alda@nathcorp.com)*
