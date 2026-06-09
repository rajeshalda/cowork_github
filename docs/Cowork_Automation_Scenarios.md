# NathCorp Cowork + ServiceNow — Automation Scenarios (Phase 2)
**Author:** Rajesh (rajesh.alda@nathcorp.com)
**Created:** 2026-05-28

---

## Scenario 1 — Automatic Incident Triage & Priority Assignment

**Problem:** New incidents coming in unassigned with no priority set.

**Prompt to Cowork:**
```
Check all unassigned open tickets in ServiceNow, analyse each one, set the correct priority, assign to the right IT group, and notify the team.
```

**What Cowork Does:**
1. Calls `get_open_incidents` — fetches all unassigned tickets
2. Reads each ticket description and analyses issue type, affected system, number of users impacted
3. Automatically sets priority (P1/P2/P3) based on impact
4. Assigns ticket to correct IT group (Network team, Desktop team, Security team)
5. Posts triage summary in ticket comment
6. Sends Teams notification to assigned group
7. Updates ticket status to "In Progress"

**MCP Tools Required:**
- `get_open_incidents`
- `update_incident`
- `send_teams_notification`

**Trigger:** Scheduled prompt — runs every hour automatically

---

## Scenario 2 — SLA Breach Detection & Escalation

**Problem:** Tickets are breaching SLA without anyone noticing.

**Prompt to Cowork:**
```
Check all open ServiceNow tickets, identify any that are breaching or approaching SLA, escalate them, and generate a breach report.
```

**What Cowork Does:**
1. Calls `get_open_incidents` — fetches all open tickets
2. Checks `opened_at` timestamp of each ticket
3. Calculates how long each ticket has been open
4. Identifies tickets approaching or breaching SLA (P1 > 4 hours, P2 > 8 hours)
5. For breaching tickets — sends escalation email to IT manager
6. Posts escalation warning comment on the ticket
7. Updates ticket priority to Critical
8. Generates SLA breach report in Excel and saves to SharePoint

**MCP Tools Required:**
- `get_open_incidents`
- `update_incident`
- `add_comment_to_incident`

**Trigger:** Scheduled prompt — runs every hour automatically

---

## Scenario 3 — Duplicate Ticket Detection & Merging

**Problem:** Multiple employees raising the same ticket for the same issue.

**Prompt to Cowork:**
```
Check all open ServiceNow tickets, find any duplicates or similar issues, link them to the parent ticket, and close the duplicates.
```

**What Cowork Does:**
1. Fetches all open tickets via `get_open_incidents`
2. Reads descriptions of all tickets
3. Uses AI reasoning to identify duplicate or similar tickets (e.g. 5 people all reporting VPN down)
4. Identifies the original/parent ticket
5. Posts comment on duplicate tickets: *"This is a known issue — linked to INC0010023"*
6. Updates duplicate tickets with reference to parent ticket
7. Closes duplicate tickets automatically
8. Posts summary report of duplicates found in SharePoint

**MCP Tools Required:**
- `get_open_incidents`
- `update_incident`
- `add_comment_to_incident`
- `close_incident`

**Trigger:** Scheduled prompt — runs every hour automatically

---

## Scenario 4 — Automated Post-Incident Report Generation

**Problem:** Resolved tickets have no post-incident documentation.

**Prompt to Cowork:**
```
For all recently resolved P1 and P2 tickets, generate a formal Post-Incident Report, save it to SharePoint, and email it to the IT manager.
```

**What Cowork Does:**
1. Calls `get_incident_by_number` for recently resolved P1/P2 tickets
2. Reads full ticket history — description, comments, resolution notes, time taken
3. Generates a formal Post-Incident Report (PIR) Word document containing:
   - Incident summary
   - Root cause
   - Impact analysis
   - Resolution steps taken
   - Prevention recommendations
4. Saves PIR to SharePoint IT documentation folder
5. Sends PIR to IT manager and stakeholders via email
6. Posts PIR link in ticket comment

**MCP Tools Required:**
- `get_incident_by_number`
- `add_comment_to_incident`

**Cowork Built-in Skills Used:**
- Word (document creation)
- SharePoint (file storage)
- Email (send to stakeholders)

**Trigger:** Scheduled prompt — runs every day after business hours

---

## Scenario 5 — KB Gap Detection & Article Creation

**Problem:** Tickets keep coming in for issues not covered in the Knowledge Base.

**Prompt to Cowork:**
```
Check all tickets resolved in the last 30 days, find issues with no matching KB article, and create new KB articles for those gaps.
```

**What Cowork Does:**
1. Fetches all resolved tickets from last 30 days
2. For each resolved ticket — searches KB via `search_kb_articles`
3. Identifies tickets where NO matching KB article was found
4. Groups similar unresolved ticket types together
5. Drafts a new KB article for each gap using the resolution from the ticket
6. Creates the KB article in ServiceNow via `create_kb_article`
7. Posts notification in IT Teams channel: *"3 new KB articles created based on recent incidents"*
8. Sends summary report to IT manager

**MCP Tools Required:**
- `get_open_incidents`
- `search_kb_articles`
- `create_kb_article`
- `send_teams_notification`

**Trigger:** Scheduled prompt — runs every week (Monday morning)

---

## Scenario 6 — Automated IT Health Dashboard Report

**Problem:** Management needs a weekly IT health report every Monday.

**Prompt to Cowork:**
```
Every Monday at 9 AM, generate a full IT health report with ticket stats, SLA breaches, top issues, and email it to management with an Excel dashboard and PowerPoint summary.
```

**What Cowork Does (every Monday 9 AM automatically):**
1. Calls `get_incident_stats` — total tickets this week
2. Calls `get_open_incidents` — current open count
3. Calls `get_resolved_this_week` — resolved count
4. Fetches SLA breach count
5. Fetches top 5 most reported issue categories
6. Compiles all data into an Excel dashboard with charts
7. Creates a PowerPoint presentation summary for management
8. Saves both to SharePoint
9. Emails report to CEO, IT Manager, and Department Heads
10. Posts summary in IT Teams channel

**MCP Tools Required:**
- `get_incident_stats`
- `get_open_incidents`

**Cowork Built-in Skills Used:**
- Excel (dashboard with charts)
- PowerPoint (management summary)
- SharePoint (file storage)
- Email (send to management)
- Communication (Teams post)

**Trigger:** Scheduled prompt — every Monday 9 AM automatically

---

## Scenario 7 — Onboarding Automation for New Employee IT Setup

**Problem:** New employee IT setup requires multiple manual steps across different systems.

**Prompt to Cowork:**
```
A new employee is joining. Read the onboarding ticket, complete all IT setup tasks automatically — folder creation, meeting scheduling, welcome email, and follow-up reminders.
```

**What Cowork Does:**
1. Reads ticket — extracts new employee name, department, start date, manager
2. Creates SharePoint onboarding folder for the employee
3. Creates IT onboarding checklist Word document
4. Schedules IT orientation meeting with new employee and IT team
5. Sends welcome email to new employee with IT setup instructions
6. Posts Teams message to IT team with onboarding task list
7. Creates follow-up tickets in ServiceNow for each onboarding step (laptop setup, access provisioning, software installation)
8. Sets reminder for Day 3 and Day 7 follow-up checks

**MCP Tools Required:**
- `get_incident_by_number`
- `create_incident`
- `update_incident`
- `add_comment_to_incident`

**Cowork Built-in Skills Used:**
- Word (onboarding checklist)
- SharePoint (folder creation)
- Scheduling (IT orientation meeting)
- Email (welcome email)
- Communication (Teams message)

**Trigger:** Chat triggered — when new onboarding ticket is detected

---

## Summary Table

| # | Scenario | Complexity | Trigger | New MCP Tools Needed |
|---|----------|-----------|---------|---------------------|
| 1 | Incident Triage & Priority | High | Hourly scheduled | `get_open_incidents`, `update_incident`, `send_teams_notification` |
| 2 | SLA Breach Detection | High | Hourly scheduled | `get_open_incidents`, `update_incident` |
| 3 | Duplicate Ticket Detection | Very High | Hourly scheduled | `get_open_incidents`, `close_incident` |
| 4 | Post-Incident Report | High | Daily scheduled | `get_incident_by_number` |
| 5 | KB Gap Detection & Creation | Very High | Weekly scheduled | `create_kb_article` |
| 6 | IT Health Dashboard | High | Weekly scheduled (Mon 9 AM) | `get_incident_stats` |
| 7 | Employee Onboarding | Very High | Chat triggered | `create_incident` |

---

*NathCorp Internal — Cowork Automation Scenarios | Rajesh (rajesh.alda@nathcorp.com)*
*Version: 1.0 | Created: 2026-05-28*
