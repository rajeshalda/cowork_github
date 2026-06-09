# NathCorp MCP Server — All Possible Tool Operations
**MCP Server:** https://nathcorp-mcp-server.azurewebsites.net
**ServiceNow Instance:** dev249650.service-now.com
**Based on:** ServiceNow Table API + Knowledge API + ServiceNow REST APIs

---

## Currently Built ✅

| Tool | Method | ServiceNow Endpoint | What it does |
|------|--------|-------------------|-------------|
| `search_kb_articles` | GET | `/api/now/table/kb_knowledge` | Search KB articles by keyword |
| `create_incident` | POST | `/api/now/table/incident` | Create a new support ticket |

---

## Section 1 — Incident / Ticket Management

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `get_open_incidents` | GET | `/api/now/table/incident?state=1` | Fetch all open tickets |
| `get_incident_by_number` | GET | `/api/now/table/incident?number=INC001` | Fetch a specific ticket by INC number |
| `get_my_incidents` | GET | `/api/now/table/incident?caller_id=` | Fetch tickets raised by a specific user |
| `update_incident` | PATCH | `/api/now/table/incident/{sys_id}` | Update ticket — comment, status, assignee |
| `close_incident` | PATCH | `/api/now/table/incident/{sys_id}` | Close/resolve a ticket with resolution notes |
| `assign_incident` | PATCH | `/api/now/table/incident/{sys_id}` | Assign ticket to a user or group |
| `add_comment_to_incident` | PATCH | `/api/now/table/incident/{sys_id}` | Post a work note or comment on ticket |
| `get_incident_comments` | GET | `/api/now/table/sys_journal_field` | Fetch all comments/notes on a ticket |
| `delete_incident` | DELETE | `/api/now/table/incident/{sys_id}` | Delete a ticket (admin only) |

---

## Section 2 — Knowledge Base (KB)

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `search_kb_articles` | GET | `/api/now/table/kb_knowledge` | Already built ✅ |
| `get_kb_article_by_id` | GET | `/api/now/table/kb_knowledge/{sys_id}` | Fetch full article by sys_id or KB number |
| `get_kb_categories` | GET | `/api/now/table/kb_category` | List all KB categories |
| `create_kb_article` | POST | `/api/now/table/kb_knowledge` | Create a new KB article |
| `update_kb_article` | PATCH | `/api/now/table/kb_knowledge/{sys_id}` | Update existing KB article content |
| `get_kb_by_category` | GET | `/api/now/table/kb_knowledge?category=` | Fetch articles filtered by category |

---

## Section 3 — User Management

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `get_user_by_email` | GET | `/api/now/table/sys_user?email=` | Fetch user details by email |
| `get_user_by_id` | GET | `/api/now/table/sys_user/{sys_id}` | Fetch user by sys_id |
| `get_all_users` | GET | `/api/now/table/sys_user` | List all users in ServiceNow |
| `get_user_groups` | GET | `/api/now/table/sys_user_grmember` | Get groups a user belongs to |
| `create_user` | POST | `/api/now/table/sys_user` | Create a new user in ServiceNow |
| `update_user` | PATCH | `/api/now/table/sys_user/{sys_id}` | Update user details |

---

## Section 4 — Asset / Configuration Management (CMDB)

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `get_user_assets` | GET | `/api/now/table/cmdb_ci?assigned_to=` | Fetch assets assigned to a user |
| `get_asset_by_name` | GET | `/api/now/table/cmdb_ci?name=` | Fetch a specific asset/device |
| `get_all_assets` | GET | `/api/now/table/cmdb_ci` | List all configuration items |
| `update_asset` | PATCH | `/api/now/table/cmdb_ci/{sys_id}` | Update asset details |
| `get_asset_incidents` | GET | `/api/now/table/incident?cmdb_ci=` | Get all incidents linked to an asset |

---

## Section 5 — Change Requests

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `get_open_change_requests` | GET | `/api/now/table/change_request?state=open` | List all open change requests |
| `create_change_request` | POST | `/api/now/table/change_request` | Create a new change request |
| `update_change_request` | PATCH | `/api/now/table/change_request/{sys_id}` | Update a change request |
| `approve_change_request` | PATCH | `/api/now/table/change_request/{sys_id}` | Approve a change request |
| `close_change_request` | PATCH | `/api/now/table/change_request/{sys_id}` | Close a change request |

---

## Section 6 — Service Catalog

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `get_catalog_items` | GET | `/api/sn_sc/servicecatalog/items` | List all service catalog items |
| `get_catalog_item_by_id` | GET | `/api/sn_sc/servicecatalog/items/{sys_id}` | Get a specific catalog item |
| `submit_catalog_request` | POST | `/api/sn_sc/servicecatalog/items/{sys_id}/order_now` | Submit a service catalog request |
| `get_my_requests` | GET | `/api/sn_sc/servicecatalog/requests` | Get catalog requests raised by user |

---

## Section 7 — Notifications & Communication

| Tool to Add | How | What it does |
|-------------|-----|-------------|
| `send_teams_notification` | Microsoft Graph API | Notify IT team on Teams when ticket created or unresolved |
| `send_email_notification` | Microsoft Graph API / ServiceNow Email API | Send email alert to user or IT team |
| `get_servicenow_notifications` | GET `/api/now/table/sys_notification` | Fetch ServiceNow system notifications |

---

## Section 8 — Reporting & Analytics

| Tool to Add | HTTP | ServiceNow Endpoint | What it does |
|-------------|------|-------------------|-------------|
| `get_incident_stats` | GET | `/api/now/stats/incident` | Get count/stats of incidents by state |
| `get_open_incident_count` | GET | `/api/now/stats/incident?state=1` | Count of open tickets |
| `get_incidents_by_category` | GET | `/api/now/table/incident?category=` | Filter incidents by category |
| `get_incidents_by_priority` | GET | `/api/now/table/incident?priority=` | Filter incidents by priority |
| `get_resolved_this_week` | GET | `/api/now/table/incident?resolved_at=` | Tickets resolved in a time range |

---

## Priority Build Order for Phase 2

| Priority | Tool | Why |
|----------|------|-----|
| 1 | `get_open_incidents` | Core of Phase 2 — needed first |
| 2 | `update_incident` | Post KB steps + close ticket |
| 3 | `add_comment_to_incident` | Post resolution notes cleanly |
| 4 | `get_incident_by_number` | Useful for demo verification |
| 5 | `send_teams_notification` | Notify IT team for unresolved tickets |
| 6 | `get_incident_stats` | Manager/CEO dashboard view |

---

*NathCorp Internal — MCP Tool Reference | Rajesh (rajesh.alda@nathcorp.com)*
*Version: 1.0 | Created: 2026-05-28*
