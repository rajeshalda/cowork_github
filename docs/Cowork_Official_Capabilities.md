# Microsoft Copilot Cowork — Official Capabilities & Limitations
**Source:** Microsoft Learn (Frontier Preview)
**Last updated by Microsoft:** 2026-05-26
**Links verified:**
- https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/
- https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-faq

> **Important:** Cowork is a Frontier preview feature. It is prerelease documentation and subject to change. You must be part of the Frontier preview program to access it.

---

## What Cowork IS (Official Definition)

Cowork is an **agentic AI** inside Microsoft 365 Copilot that **carries out tasks on your behalf** across your Microsoft 365 environment. You describe what you need — Cowork takes action. You approve each sensitive action before it happens.

---

## What Cowork CAN Do (Officially Confirmed)

### Communication
- Draft and send emails
- Reply, forward, and send messages through Outlook
- Manage inbox — sort emails into folders, delete emails, respond inline
- Post updates in Teams channels or send direct messages (1:1 or group chats)
- Create and send HTML newsletters via email
- Prepare stakeholder communications — status updates, announcements, follow-ups

### Documents & Files
- Create Word documents, Excel spreadsheets, PowerPoint presentations, PDFs from scratch
- Edit and refine existing documents shared in the conversation
- Browse Work IQ to pull in content
- Create SharePoint and OneDrive folders
- Reorganize existing files into new or existing folders

### Calendar & Meetings
- Schedule meetings using natural language (e.g. "set up a 30-minute check-in with Alex tomorrow at 2 PM")
- Manage calendar — add events, move things, decline meetings (with message to organiser)
- Get meeting intelligence and insights
- Start day with a daily briefing

### Research & Search
- Search across the organisation — documents, messages, information
- Perform deep research synthesising information from multiple sources into reports
- Browse SharePoint and OneDrive folders

### Automation
- **Run prompts on a schedule** so recurring tasks happen automatically
- Manage scheduled prompts from the **Scheduled** tab in Tasks view
- Example: "Send me a daily briefing every morning at 9 AM"

### Plugins & Custom Skills
- Supports plugins from Microsoft 365 App Store — adds new skills and connectors
- Admin can deploy plugins org-wide
- Users can create up to **50 custom skills** via `SKILL.md` files in OneDrive `/Documents/Cowork/skills/`
- Custom skills are discovered automatically at the start of each conversation

### Control & Approval
- Before sensitive actions (send email, post in Teams, schedule meeting) — Cowork **pauses and asks for approval**
- Risk level indicator shown for medium and high risk actions
- Options: **Approve once** / **Don't ask again (for this session)** / **Cancel**
- **Show parameters** — see technical details before deciding
- **Pause** (soft or hard) / **Resume** / **Cancel** at any point
- Automatically reconnects and picks up where it left off if connection drops

### Other
- Works in browser (m365.cloud.microsoft), desktop app (Windows/Mac), mobile app (iOS/Android)
- Voice input supported (browser dependent)
- Attach files up to 200 MB by drag-and-drop or file picker
- Up to **250,000 characters** in a single prompt
- Download all output files at once as a zip archive

---

## What Cowork CANNOT Do (Officially Confirmed Limitations)

| Limitation | Official Source |
|------------|----------------|
| Cannot access or edit files stored **locally on your device** | FAQ — Known Limitations |
| Cannot **delete** files or folders in OneDrive or SharePoint | FAQ — Known Limitations |
| Cannot read **encrypted files** even if user has access | FAQ — Known Limitations |
| Attached files must be **less than 200 MB** | FAQ — Known Limitations |
| Custom skills are **not validated by Microsoft** — review outputs carefully | FAQ — Known Limitations |
| Only works in **Anthropic supported regions** — not available in all countries | FAQ — Unsupported regions |
| **No real-time event triggers** — scheduling is the automation mechanism, not queue monitoring | Overview — Automation section |

---

## What Microsoft Does NOT Say (Correcting Earlier Assumptions)

| Claim | Correct Status |
|-------|---------------|
| "Maximum 5 scheduled prompts" | ❌ NOT mentioned anywhere in official docs |
| "Minimum 1 hour schedule interval" | ❌ NOT mentioned anywhere in official docs |
| "Real-time queue monitoring" | ❌ NOT a Cowork feature — only scheduled prompts |
| "Background autonomous without any human" | ❌ Scheduled prompts need a human to set them up first |

---

## How Cowork Connects to External Systems (Our Integration)

- Cowork supports **plugins** that connect to external data sources and services
- Our NathCorp ServiceNow KB plugin is exactly this — a custom plugin connecting Cowork to ServiceNow
- Cowork uses **Anthropic models as a subprocessor** for AI processing
- Every action is authorised through the user's Microsoft 365 account
- Cowork accesses only services and data the user is already permitted to use

---

## Cowork vs Copilot Chat (Official Comparison)

| Feature | Copilot Chat | Cowork |
|---------|-------------|--------|
| What it is | Always-on AI for drafting, summarising, answering | Agentic AI that completes multi-step work |
| Best for | Fast, focused, single-task support | End-to-end work across multiple apps |
| Speed | Seconds to minutes | Minutes to hours |
| Task complexity | Single-step, single-session | Multi-step workflows across tasks and sources |

---

## Built-in Skills (Official List)

Word, Excel, PowerPoint, PDF, Email, Scheduling, Calendar Management, Meetings, Daily Briefing, Enterprise Search, Communications, Deep Research, Adaptive Cards

---

## Relevance to Our NathCorp Cowork + ServiceNow Integration

### Phase 1 — What We Have Built (DONE ✅)

| Feature | Status | How |
|---------|--------|-----|
| Employee types IT issue in Cowork | ✅ Done | Chat trigger |
| Cowork searches ServiceNow KB live | ✅ Done | MCP tool: `search_kb_articles` |
| Cowork returns numbered resolution steps | ✅ Done | SKILL.md v2.0 |
| Employee says No → Cowork raises ServiceNow ticket | ✅ Done | MCP tool: `create_incident` |
| Ticket has full user identity + steps tried | ✅ Done | M365 user captured automatically |
| Approval dialog before ticket creation | ✅ Done | Cowork built-in safety feature |

---

### Phase 2 — CEO's Ask (PLANNED)

| Feature | Possible in Cowork? | How |
|---------|-------------------|-----|
| Paste one prompt → Cowork checks all open tickets | ✅ Yes | Add MCP tool: `get_open_incidents` |
| Cowork reads each ticket and searches KB | ✅ Yes | Existing `search_kb_articles` tool |
| Cowork posts KB resolution steps on ticket | ✅ Yes | Add MCP tool: `update_incident` |
| Cowork closes resolved tickets | ✅ Yes | Add MCP tool: `update_incident` with closed status |
| Scheduled prompt — runs every hour automatically | ✅ Yes | Cowork scheduled prompts feature |
| Real-time monitoring — triggers when new ticket arrives | ❌ No | Not a Cowork feature — needs Copilot Studio |

---

### What Cowork Can NEVER Do (Hardware/Network Issues)

| IT Issue | Why Cowork Cannot Fix It |
|----------|-------------------------|
| WiFi not connecting | Network infrastructure — outside M365 |
| VPN not working | Network/firewall — outside M365 |
| Laptop not booting | Hardware — outside M365 |
| Password reset (Active Directory) | Needs AD access — outside M365 |
| Software installation | Needs device access — outside M365 |

**For these issues** — Cowork searches KB and posts resolution steps on the ticket so the IT support person has a starting point. It cannot fix them automatically.

---

## What Cowork CAN Actually Fix — Tickets That Make Sense

These are real M365 actions Cowork can take — so ServiceNow tickets for these are valid for Phase 2:

| Task | Cowork Can Do? |
|------|---------------|
| Schedule a meeting | ✅ |
| Send an email on behalf | ✅ |
| Create a Word/Excel/PPT document | ✅ |
| Post in Teams | ✅ |
| Calendar management | ✅ |
| Daily briefing setup | ✅ |
| Deep research / summarise documents | ✅ |
| SharePoint file search | ✅ |

---

## CEO's Flow — Is It Possible? (Full Analysis)

| Step | Possible? | How |
|------|-----------|-----|
| Cowork monitors the queue | ✅ Via scheduled prompt | Cowork checks every hour automatically |
| Reads ticket and decides if it can work on it | ✅ Cowork can reason and decide | SKILL.md instructs Cowork how to classify |
| Assigns ticket to itself | ✅ Via `update_incident` MCP tool | Updates assignee field in ServiceNow |
| Works on the ticket (M365 tasks) | ✅ For M365 tasks only | Uses built-in Cowork skills |
| Updates comment with details | ✅ Via `update_incident` MCP tool | Posts work notes on ticket |
| Marks ticket as verified and closes | ✅ Via ServiceNow API | `update_incident` sets state = closed |
| For tickets it can't fix — reads KB, posts steps in comment | ✅ Already built | `search_kb_articles` + `update_incident` |

---

## What Needs to Be Built for Phase 2

1. **2 new MCP tools** — `get_open_incidents` + `update_incident`
2. **Updated SKILL.md** — teach Cowork how to decide which tickets it can handle vs which need IT
3. **Scheduled prompt** — Cowork checks ServiceNow queue every hour automatically

---

*NathCorp Internal — Cowork Official Reference | Rajesh (rajesh.alda@nathcorp.com)*
*Verified: 2026-05-28 | Source: Microsoft Learn official documentation*
