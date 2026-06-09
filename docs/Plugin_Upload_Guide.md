# NathCorp ServiceNow Cowork Plugin — Upload Guide
**Prepared by:** Rajesh (rajesh.alda@nathcorp.com)
**Date:** 2026-05-21
**Plugin File:** NathCorpServiceNowPlugin.zip

---

## Prerequisites

| Requirement | Detail |
|-------------|--------|
| Admin URL | https://admin.cloud.microsoft |
| Role Required | AI Administrator (M365) |
| Plugin File | NathCorpServiceNowPlugin.zip |
| One-time upload | No modifications required after upload |

---

## Step 1 — Login to Admin Center

1. Open browser and go to: **https://admin.cloud.microsoft**
2. Sign in with your NathCorp admin account

---

## Step 2 — Navigate to Agents

1. In the left sidebar click **Agents**
2. Click **All agents**

---

## Step 3 — Upload the Plugin

1. Click the **`...`** (three dots) button in the top right corner
2. Click **+ Add agent**
3. Click **Upload** and select the file: `NathCorpServiceNowPlugin.zip`
4. Wait for upload to complete — wizard opens automatically

---

## Step 4 — Publish to Users

In the wizard:

1. **Step 1 — Upload agent** → completes automatically ✓
2. **Step 2 — Publish agent to selected users:**
   - Under **Publish to users** → select **Specific users/groups**
   - Search and add the following users:
     - `Rajesh.Alda@nathcorp.com`
     - `richa.kumari@nathcorp.com`
   - Under **Install (optional)** → select **None**
3. Click **Next**
4. **Apply template** → leave everything as default (do not change anything) → click **Next**
5. Click **Accept permissions**
5. Click **Next**
6. Click **Review & finish**
7. Click **Publish**

---

## Step 5 — Deploy to Organization

After publishing, the plugin status will show **Not deployed**. To push it to all users:

1. Go to **https://admin.microsoft.com**
2. Left sidebar → **Settings** → **Integrated apps**
3. Click the **Available apps** tab
4. Search: `NathCorp ServiceNow KB`
5. Click on it → details panel opens on the right
6. Click **Deploy app**
7. Deployment status changes to **Deployed** ✓

---

## Step 6 — Verify Plugin is Active

Ask a test user to:

1. Open Cowork at **https://m365.cloud.microsoft**
2. Start a new conversation
3. Open the **Sources & Skills** panel (visible during active conversation)
4. Confirm **NathCorp ServiceNow KB** toggle is **ON**
5. Type: `VPN not working`
6. Cowork should return numbered resolution steps from ServiceNow KB
7. Reply **No** → Cowork should create a ServiceNow ticket automatically

---

## What This Plugin Does

| Feature | Detail |
|---------|--------|
| KB Search | Searches NathCorp ServiceNow Knowledge Base in real-time |
| AI Answer | Combines KB articles with Cowork AI for complete resolution steps |
| Ticket Creation | Automatically creates ServiceNow incident when user says issue is not resolved |
| MCP Server | Hosted on Azure — `https://nathcorp-mcp-server.azurewebsites.net` |
| ServiceNow Instance | `https://dev249650.service-now.com` |

---

## Support

For any issues during upload contact: **Rajesh (rajesh.alda@nathcorp.com)**
