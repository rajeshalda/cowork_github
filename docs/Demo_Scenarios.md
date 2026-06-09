# NathCorp Cowork Demo — Scenarios & Prompts
**Prepared by:** Rajesh (rajesh.alda@nathcorp.com)
**Date:** 2026-05-25
**Based on:** Live KB articles from ServiceNow (dev249650.service-now.com)

---

## How to Use This File

Each scenario has two parts:
- **SCENARIO A** — Issue resolved by KB → user replies **Yes** → conversation ends cleanly
- **SCENARIO B** — Issue NOT resolved → user replies **No** → ServiceNow ticket created automatically

Use Scenario A first to show the happy path, then Scenario B to show the ticket creation.

---

## SCENARIO 1 — VPN Not Working
**KB Article:** KB0010001 — VPN Configuration and Troubleshooting Guide
**Best for:** CEO demo (most relatable IT issue)

---

### SCENARIO 1A — VPN Issue Resolved ✅

**Type in Cowork:**
```
VPN not working, I cannot connect
```

**Cowork will respond with:**
> Here are the resolution steps for **VPN not working**:
>
> 1. Check your internet connection is active
> 2. Verify your VPN credentials (username: yourname@nathcorp.com)
> 3. Confirm VPN server address is: **vpn.nathcorp.com**
> 4. Restart the VPN client completely
> 5. Clear cached credentials and try again
> 6. Restart your system if issue persists
>
> *(Source: ServiceNow KB — VPN Configuration and Troubleshooting Guide + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes
```

**Cowork will respond:**
> Great! Glad the issue is resolved. Feel free to reach out if you need further assistance.

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 1B — VPN Issue NOT Resolved → Ticket Created 🎫

**Type in Cowork:**
```
VPN not working, I cannot connect
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No
```

**Cowork will:**
1. Call `create_incident` tool on MCP server
2. MCP server calls ServiceNow `POST /api/now/table/incident`
3. Ticket created with:
   - short_description: "VPN not connecting"
   - description: "User reported VPN not working. Resolution steps provided (check internet, restart VPN client, verify credentials for vpn.nathcorp.com). Steps did not resolve the issue."
   - priority: 3 (Medium)
   - assignment_group: IT Support

**Cowork will respond:**
> I have raised a support ticket **INC00XXXXX** for you. Our IT Support team will contact you shortly. Thank you for your patience.

**Result:** Real ticket visible in ServiceNow Incidents list. ✅

---

## SCENARIO 2 — Cannot Login / Password Issue
**KB Article:** KB0010002 — Unable to Login
**Best for:** Second demo scenario — very common IT issue

---

### SCENARIO 2A — Login Issue Resolved ✅

**Type in Cowork:**
```
I cannot login to my computer, it says wrong password
```

**Cowork will respond with:**
> Here are the resolution steps for **unable to login**:
>
> 1. Verify your username format: **firstname.lastname@nathcorp.com**
> 2. Check that **Caps Lock** is OFF
> 3. Reset your password via the self-service portal
> 4. Complete MFA verification when prompted
> 5. Retry login after password reset
>
> *(Source: ServiceNow KB — Unable to Login + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes, it worked after resetting my password
```

**Cowork will respond:**
> Great! Glad the issue is resolved. Feel free to reach out if you need further assistance.

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 2B — Login Issue NOT Resolved → Ticket Created 🎫

**Type in Cowork:**
```
I cannot login to my computer, it says wrong password
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No, I tried everything but still cannot login
```

**Result:** Ticket created with IT Support → **Identity Team** will handle. ✅

---

## SCENARIO 3 — Laptop Running Slow
**KB Article:** KB0010007 — Laptop Running Slow
**Best for:** Quick demo — everyone relates to slow laptop

---

### SCENARIO 3A — Performance Issue Resolved ✅

**Type in Cowork:**
```
My laptop is very slow, it takes forever to open anything
```

**Cowork will respond with:**
> Here are the resolution steps for **laptop running slow**:
>
> 1. **Restart your machine** — clears memory and temporary files
> 2. **Check storage** — ensure at least 10% free disk space (Settings → Storage)
> 3. **Close unused apps** — check Task Manager for high CPU/RAM usage
> 4. **Run antivirus scan** — malware can slow performance significantly
> 5. **Install Windows updates** — pending updates can cause slowdowns
>
> *(Source: ServiceNow KB — Laptop Running Slow + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes, after restarting it is much faster now
```

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 3B — Performance Issue NOT Resolved → Ticket Created 🎫

**Type in Cowork:**
```
My laptop is very slow, it takes forever to open anything
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No, I tried restarting, running antivirus, nothing helped
```

**Result:** Ticket created → **Desktop Support** will investigate hardware/software issue. ✅

---

## SCENARIO 4 — Camera Not Working in Teams
**KB Article:** KB0010003 — Camera not detected in Teams
**Best for:** Post-pandemic relatable issue — hybrid work

---

### SCENARIO 4A — Camera Issue Resolved ✅

**Type in Cowork:**
```
My camera is not working in Microsoft Teams, no one can see me
```

**Cowork will respond with:**
> Here are the resolution steps for **camera not detected in Teams**:
>
> 1. **Check camera permissions** — Windows Settings → Privacy → Camera → Allow Teams
> 2. **Close Teams completely** — right-click Teams icon in taskbar → Quit
> 3. **Reopen Teams** — launch fresh
> 4. **Check camera in Windows** — Settings → Devices → ensure camera is listed and enabled
> 5. **Restart your laptop** if the above steps don't work
>
> *(Source: ServiceNow KB — Camera not detected in Teams + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes, I allowed camera permission and it works now
```

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 4B — Camera Issue NOT Resolved → Ticket Created 🎫

**Type in Cowork:**
```
My camera is not working in Microsoft Teams, no one can see me
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No, camera not showing in Device Manager either, I think hardware issue
```

**Result:** Ticket created → **Desktop Support** will inspect hardware. ✅

---

## SCENARIO 5 — Cannot Access Shared Drive
**KB Article:** KB0010008 — Access Denied Shared Folder
**Best for:** Shows real enterprise scenario — permissions + VPN dependency

---

### SCENARIO 5A — Shared Drive Access Resolved ✅

**Type in Cowork:**
```
I am getting access denied when trying to open the shared drive
```

**Cowork will respond with:**
> Here are the resolution steps for **access denied on shared folder**:
>
> 1. **Check VPN is connected first** — shared drives only work when on VPN
> 2. **Verify you have permissions** — ask your manager to confirm you have access
> 3. **Remap the network drive** — disconnect and reconnect:
>    - Right-click This PC → Disconnect network drive
>    - Map Network Drive again with the correct path
> 4. **Clear cached credentials** — Control Panel → Credential Manager → remove old entries
>
> *(Source: ServiceNow KB — Access Denied Shared Folder + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes, it was VPN disconnected, connected VPN and now it works
```

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 5B — Shared Drive NOT Accessible → Ticket Created 🎫

**Type in Cowork:**
```
I am getting access denied when trying to open the shared drive
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No, VPN is connected but still access denied even after remapping
```

**Result:** Ticket created → **Infrastructure Team** will check permissions. ✅

---

## SCENARIO 6 — WiFi Not Connecting
**KB Article:** KB0010005 — WiFi Connection Issue
**Best for:** Quick and simple scenario

---

### SCENARIO 6A — WiFi Issue Resolved ✅

**Type in Cowork:**
```
I cannot connect to WiFi at the office
```

**Cowork will respond with:**
> Here are the resolution steps for **WiFi connection issue**:
>
> 1. **Forget the WiFi network** — right-click WiFi → Forget
> 2. **Reconnect** — select network again, enter credentials
> 3. **Restart network adapter** — Device Manager → Network Adapters → right-click → Disable, then Enable
> 4. **Run Windows network troubleshooter** — Settings → Troubleshoot → Internet Connections
> 5. **Restart your machine** as a final step
>
> *(Source: ServiceNow KB — WiFi Connection Issue + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes, I forgot the network and reconnected and it works now
```

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 6B — WiFi NOT Fixed → Ticket Created 🎫

**Type in Cowork:**
```
I cannot connect to WiFi at the office
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No, nothing worked, still cannot see any networks
```

**Result:** Ticket created → **Network Team** will check office access point. ✅

---

## SCENARIO 7 — Locked Out of Computer
**KB Article:** KB0005012 — Locked out of computer
**Best for:** Shows Cowork even handles account lockout scenarios

---

### SCENARIO 7A — Account Unlocked After Waiting ✅

**Type in Cowork:**
```
I am locked out of my laptop, I cannot login at all
```

**Cowork will respond with:**
> Here are the resolution steps for **locked out of computer**:
>
> 1. This typically happens after 5 incorrect password attempts in 30 minutes
> 2. **Option 1:** Wait 30 minutes — the account automatically unlocks itself
> 3. **Option 2:** Contact IT Support immediately:
>    - IT Support USA: 1858 436 3350
>    - IT Support EMEA/APAC: 3120 565 1111
>
> *(Source: ServiceNow KB — Locked out of computer + AI)*
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
Yes, I waited 30 minutes and it unlocked automatically
```

**Result:** Conversation ends. No ticket created. ✅

---

### SCENARIO 7B — Still Locked Out → Ticket Created 🎫

**Type in Cowork:**
```
I am locked out of my laptop, I cannot login at all
```

*(Wait for resolution steps)*

**Type in Cowork:**
```
No, I waited 30 minutes and still locked out
```

**Result:** Ticket created → **Identity Team** will unlock account manually. ✅

---

## SCENARIO 8 — Issue Not in KB (No Article Found)
**Best for:** Shows Cowork handles unknown issues gracefully too

---

### SCENARIO 8 — Issue With No KB Article

**Type in Cowork:**
```
My keyboard is not working, some keys are stuck
```

**Cowork will respond with:**
> Here are the resolution steps for **keyboard not working**:
>
> 1. Restart your computer — keyboard drivers may need reset
> 2. Check USB connection (for wired keyboard — unplug and replug)
> 3. Try connecting keyboard to a different USB port
> 4. Go to Device Manager → Keyboards → right-click → Update Driver
> 5. If wireless keyboard — replace batteries or re-pair via Bluetooth
>
> **Note: No specific KB article was found for this issue. This answer is based on general IT knowledge.**
>
> Did this resolve your issue? Please reply **Yes** or **No**.

**Type in Cowork:**
```
No, the keyboard is physically broken I think
```

**Result:** Ticket created → IT will arrange hardware replacement. ✅

---

## Recommended Demo Order for CEO

| Order | Scenario | Why |
|-------|---------|-----|
| 1st | Scenario 1B — VPN → No → Ticket | Most relatable + shows full flow end-to-end with ticket proof |
| 2nd | Scenario 3A — Laptop Slow → Yes | Shows happy path (resolved without ticket) |
| 3rd | Scenario 4B — Camera Teams → No → Ticket | Shows hybrid work scenario + second ticket creation |

**Total demo time:** ~5 minutes for all three scenarios

---

## Quick Prompt Reference Card
*(Print and keep beside laptop during demo)*

```
SCENARIO 1 — VPN (Full flow — most important)
  Prompt 1: "VPN not working, I cannot connect"
  Prompt 2: "No"
  → Ticket created ✅

SCENARIO 2 — Laptop Slow (Happy path)
  Prompt 1: "My laptop is very slow"
  Prompt 2: "Yes, after restarting it is much faster"
  → Resolved, no ticket ✅

SCENARIO 3 — Camera Teams (Second ticket)
  Prompt 1: "My camera is not working in Microsoft Teams"
  Prompt 2: "No, camera not showing in Device Manager"
  → Ticket created ✅

BONUS — No KB article
  Prompt 1: "My keyboard is not working, some keys are stuck"
  Prompt 2: "No"
  → AI knowledge used + ticket created ✅
```

---

*NathCorp Internal — Demo Scenarios | Rajesh (rajesh.alda@nathcorp.com)*
