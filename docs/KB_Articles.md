# NathCorp ServiceNow — Knowledge Base Articles
**Source:** https://dev249650.service-now.com
**Fetched via:** NathCorp MCP Server (live API)
**Total articles found:** 43 of 49 (6 remaining are likely draft/retired — not searchable via API)
**Date fetched:** 2026-05-25

---

## Summary — Article Categories

| Category | Articles |
|----------|---------|
| NathCorp IT-specific (KB001xxxx) | 7 articles — VPN, Login, Laptop, WiFi, Camera, Access Denied, MFA |
| Outlook / Email | 7 articles |
| Windows / General | 10 articles |
| Security / Tips | 4 articles |
| Other | 3 articles |

---

## SECTION 1 — NathCorp IT Articles (Primary — Used in Demo)

These are the custom NathCorp articles written specifically for IT support resolution. These are the ones Cowork will find for common IT issues.

---

### KB0010001 — VPN Configuration and Troubleshooting Guide

**Short Description:** VPN not getting connected
**Category:** (IT)

**Full Content:**
```
VPN Configuration and Troubleshooting Guide

Issue: VPN not getting connected

VPN Configuration Steps:
1. Open VPN Client
2. Enter VPN Server Address: vpn.nathcorp.com
3. Enter Username (Example: employee@nathcorp.com)
4. Enter Password
5. Click Connect
6. Verify connection established

Troubleshooting Steps:
1. Check internet connection
2. Verify VPN credentials
3. Restart VPN client
4. Clear cached credentials
5. Verify VPN server reachable
6. Restart system

Common Errors:
- Error: Authentication Failed → Verify username and password
- Error: VPN Timeout         → Check network connection
- Error: Unable to reach VPN Server → Contact IT Team

Escalation: If issue persists after troubleshooting, assign ticket to Network Support Team.
```

---

### KB0010002 — Unable to Login

**Short Description:** Unable to login
**Category:** (IT)

**Full Content:**
```
Issue: Unable to login

Resolution:
1. Verify username (format: firstname.lastname@nathcorp.com)
2. Check Caps Lock is OFF
3. Reset password via self-service portal
4. Complete MFA verification
5. Retry login

Escalation: Identity Team
```

---

### KB0010003 — Camera Not Detected in Teams

**Short Description:** Camera not detected in Teams
**Category:** (IT)

**Full Content:**
```
Issue: Camera not detected in Teams

Resolution:
1. Verify camera permissions (Windows Settings → Privacy → Camera)
2. Close Teams completely
3. Reopen Teams
4. Check camera in Windows Settings → Devices
5. Restart laptop

Escalation: Desktop Support
```

---

### KB0010005 — WiFi Connection Issue

**Short Description:** Unable to connect WiFi
**Category:** (IT)

**Full Content:**
```
Issue: Unable to connect WiFi

Resolution:
1. Forget WiFi network
2. Reconnect with correct credentials
3. Restart network adapter (Device Manager → Network Adapters → Disable/Enable)
4. Run Windows network troubleshooter
5. Restart machine

Escalation: Network Team
```

---

### KB0010007 — Laptop Running Slow

**Short Description:** System performance issue
**Category:** (IT)

**Full Content:**
```
Issue: System performance issue / Laptop running slow

Resolution:
1. Restart machine
2. Check storage (ensure at least 10% free disk space)
3. Close unused apps and browser tabs
4. Run antivirus scan
5. Install pending Windows updates

Escalation: Desktop Support
```

---

### KB0010008 — Access Denied Shared Folder

**Short Description:** Unable to access shared drive
**Category:** (IT)

**Full Content:**
```
Issue: Unable to access shared drive / Access denied

Resolution:
1. Verify VPN is connected first
2. Verify you have correct permissions (ask your manager)
3. Remap the drive (disconnect and reconnect network drive)
4. Clear cached credentials (Control Panel → Credential Manager)

Escalation: Infrastructure Team
```

---

### KB0005012 — Locked Out of Computer

**Short Description:** What to do when you are locked out of your computer
**Category:** (IT)

**Full Content:**
```
Symptoms: You can't log in to your laptop at the login screen

Cause: You may have entered your password wrong at least 5 times in the last 30 minutes

Resolutions:
1. Wait 30 minutes — account automatically unlocks itself
2. Contact IT Support for immediate assistance:
   - IT Support USA:       1858 436 3350
   - IT Support EMEA/APAC: 3120 565 1111
```

---

## SECTION 2 — Outlook / Email Articles

---

### KB99999999 — Microsoft Outlook Issues

**Short Description:** Microsoft Outlook Issues
**Category:** (General)

**Full Content:**
```
Microsoft Outlook Issues

Setting Up Automatic Replies (Out of Office):
1. Click the File tab
2. Click Automatic Replies
3. Select "Send automatic replies"
4. Optional: Set a time range (start/end date)
5. On "Inside My Organization" tab — type your reply message
6. On "Outside My Organization" tab — select Auto-reply to people outside organization
7. Choose: My contacts only OR Anyone outside organization

Note: If "My Contacts only" selected, replies go only to contacts in your address book.
```

---

### KB0000030 — Deleted Email Recovery

**Short Description:** Deleted Email Recovery
**Category:** Outlook

**Full Content:**
```
Deleted Email Recovery

Process:
- Deleted email → Deleted Items folder
- Purged from Deleted Items → Dumpster (recoverable for 14 days)
- After 14 days in Dumpster → Permanently deleted (NOT recoverable)

To recover deleted email:
1. Go to Deleted Items folder — check if email is there
2. If not in Deleted Items, go to Recover Deleted Items (OWA or Outlook)
3. Select the email → Recover Selected Items

Note: Desktop clients (Outlook, Apple Mail) may purge faster than 14 days.
Only recoverable via OWA or Outlook — not via mobile app.
```

---

### KB0000024 — Create An Email Signature

**Short Description:** Create An Email Signature
**Category:** Outlook

**Full Content:**
```
To create a personalized email signature in Outlook:
1. Open a new message
2. On the Message tab → Include group → click Signature → Signatures
3. On E-mail Signature tab → click New
4. Type a name for the signature → click OK
5. In Edit Signature box → type your signature text
6. Format text using style/formatting buttons
7. To add a business card: click Business Card
8. To add a hyperlink: click Insert Hyperlink
9. To add a picture: click Picture → browse to image file
10. Click OK to save
```

---

### KB0000026 — Create And Edit A Contact Group

**Short Description:** Create And Edit A Contact Group (Distribution Lists)
**Category:** Outlook

**Full Content:**
```
Outlook 2010 - Create And Edit A Contact Group

A Contact Group (formerly Distribution List) is a grouping of email addresses under one name.
Messages sent to the group go to all recipients.

Create a Contact Group:
1. Go to Contacts
2. On Home tab → New group → click New Contact Group
3. In Name box → type a name for the group
4. On Contact Group tab → Members group → click Add Members
5. Choose: From Outlook Contacts / From Address Book / New E-mail Contact
6. Click Save & Close

No maximum number of names in a Contact Group.
```

---

### KB0000027 — Importing Address Book From CSV File

**Short Description:** Importing Address Book From CSV File
**Category:** Outlook

**Full Content:**
```
Outlook 2010 - Importing Address Book from CSV File:
1. Start Outlook 2010
2. Select File menu → Open → Import
3. Select "Import from another program or file" → Next
4. Select "Comma Separated Values (Windows)" → Next
5. Browse to your .csv file → Open
6. Select Next
7. Choose Contacts as destination folder → Next
8. Click Finish
```

---

### KB0000002 — Email Interruption / Cannot Access Email

**Short Description:** Email Interruption / Cannot access email site
**Category:** (General)

**Full Content:**
```
If the email site is UP but you can't access:

Browser fixes:
- Force full refresh: CTRL + F5
- Try alternative URL: m.outlook.com
- Clear browser cache and cookies

DNS fixes:
- Windows: Start → Command Prompt → type: ipconfig /flushdns → Enter
- This refreshes your DNS cache

If on WiFi but works on mobile data:
- Issue is with your local network/router
- Restart router or connect via VPN
```

---

### KB0000011 — How to Deal with Spam

**Short Description:** How to Deal with Spam
**Category:** (General)

**Full Content:**
```
To reduce spam:
- Don't reply to spam (confirms your address is active)
- Don't release your email address unnecessarily
- Disable auto-reply when possible (verifies address to spammers)
- Mark as Junk/Spam in your email client
- Use a secondary email for sign-ups
- Report phishing to IT Security

Do NOT click links in suspicious emails.
```

---

## SECTION 3 — Windows / General Articles

---

### KB0000016 — About Windows 10

**Short Description:** About Windows 10
**Category:** (General)

**Full Content:**
```
Windows 10 highlights:
- Start menu is back (most used apps + all apps list)
- Microsoft Store for apps, music, games
- Cortana personal assistant (search + voice)
- Microsoft Edge browser
- Virtual desktops
- Improved Task Manager
```

---

### KB0000032 — Getting Around in Windows

**Short Description:** Getting Around in Windows (Windows 8.x)
**Category:** (General)

**Full Content:**
```
Windows 8.x navigation:
- Start screen → Move mouse to bottom left → Start button appears
- Right-click any app → App bar appears at bottom
- Pin to Start: right-click app → Pin to Start
- Desktop mode: press Windows + D
- Charms bar: move mouse to top/bottom right corner
```

---

### KB0000020 — Should I Upgrade to Windows 8.x?

**Short Description:** Windows: Should I upgrade to Windows 8.x?
**Category:** (General)

**Full Content:**
```
Windows 8.x improvements:
- Better performance: faster boot, smaller memory footprint
- Better battery: apps suspended in sleep mode
- Touch-optimized interface
- Requires Microsoft account for Windows Store apps

Consider upgrading if: touch device, need better battery life
Stay on current version if: productivity-focused desktop use
```

---

### KB0000012 — Mac OS X Updates

**Short Description:** Where can I obtain updates for Mac OS X?
**Category:** (General)

**Full Content:**
```
To get Mac OS X updates:
1. Use Software Update: Apple menu → Software Update
2. Mac App Store: search for OS X updates
3. Apple support site: support.apple.com
4. For full OS X 10.9 (Mavericks): available free on Mac App Store
```

---

### KB0000017 — What is the Windows Key?

**Short Description:** What is the Windows key?
**Category:** (General)

**Full Content:**
```
The Windows key (⊞) is between Ctrl and Alt on the left side.

Common shortcuts:
- ⊞ alone          → Open/close Start menu
- ⊞ + D            → Show desktop
- ⊞ + E            → Open File Explorer
- ⊞ + L            → Lock computer
- ⊞ + R            → Open Run dialog
- ⊞ + Tab          → Task view (virtual desktops)
- ⊞ + PrtScn       → Screenshot saved to Pictures
```

---

### KB0000015 — How to Create and Delete Users (Mac)

**Short Description:** How do I create and delete users? (Mac OS X)
**Category:** (General)

**Full Content:**
```
Creating a new user in Mac OS X:
1. Apple menu → System Preferences
2. View menu → Users & Groups (10.7+) or Accounts (10.6)
3. Click the padlock → authenticate as admin
4. Click + (plus sign)
5. Select account type: Administrator / Standard / Managed
6. Fill in name and password → Create User

Types:
- Administrator: can install apps, change system settings
- Standard: basic use
- Managed with Parental Controls: restricted access
```

---

## SECTION 4 — Security / Tips Articles

---

### KB0005001 — Workstation Security Standard

**Short Description:** Workstation Endpoint Security Hardening Standard
**Category:** (Security)

**Full Content:**
```
Mac Security Standard:
- Casper Management Framework Agent installed at first image
- Regular policy check-in: every hour
- Full inventory update: daily

Antivirus:
- Sophos installed on all Macs (auto-update enabled)
- Smart group monitors Macs without Sophos → auto reinstall

Encryption:
- FileVault 2 on all Macs
- Boot drive encryption checked
- Status: not encrypted / encrypting / pending / encrypted

Password:
- All Macs bound to Active Directory
- Password + PIN required
```

---

### KB0000028 — What are Phishing Scams?

**Short Description:** What are phishing scams and how can I avoid them?
**Category:** Tips and Tricks

**Full Content:**
```
Phishing scams = fraudulent emails pretending to be legitimate companies.
They try to steal passwords, credit card numbers, personal info.

Warning signs:
- Creates urgency ("your account will be closed")
- Asks you to click a link and enter credentials
- Sender email looks slightly wrong (micros0ft.com vs microsoft.com)
- Generic greeting ("Dear Customer")

How to avoid:
- Never click links in suspicious emails
- Go directly to the website by typing the URL
- Check sender email address carefully
- Report to IT Security immediately
- Never share passwords via email
```

---

### KB0000029 — What is Spam?

**Short Description:** What is Spam?
**Category:** Tips and Tricks

**Full Content:**
```
Spam = unsolicited commercial email (UCE) or unsolicited bulk email (UBE).

Common spam types:
- Phishing scams
- Foreign bank / advance fee fraud
- Pyramid schemes / MLM
- Get Rich Quick schemes
- Quack health products
- Pornographic site ads

How to protect yourself:
- Don't reply to spam
- Don't unsubscribe from unknown senders (confirms active address)
- Use spam filters
- Report to IT
```

---

### KB0000009 — Copyrighted Files

**Short Description:** Are Copyrighted Files Illegal to Have On My Computer?
**Category:** (Legal/Tips)

**Full Content:**
```
Downloading copyrighted material is legal ONLY if:
1. Material is in the public domain
2. Copyright holder gave you permission
3. It's for criticism, comment, news reporting, or education (fair use)

Most music, films, TV shows, games, and software are NOT in the public domain.
Downloading without permission = copyright infringement.

NathCorp policy: Do not download or store unlicensed software or media on company devices.
```

---

## SECTION 5 — Other Articles

---

### KB0000005 — Excel Functionality

**Short Description:** Excel Functionality
**Category:** (Productivity)

**Full Content:**
```
Copying formulas without changing cell references:
- Use $ to lock a cell reference: $B$2 (locks both row and column)
- B$2 (row locked, column can change)
- $B2 (column locked, row can change)

AutoSum example:
1. Type value in A1
2. Click B1
3. Click Σ (AutoSum) button
4. In formula box, type *1.03 after SUM(A1)
5. Press Enter → B1 shows new value
```

---

### KB0000008 — VPN Configuration for Apple Devices

**Short Description:** How to configure VPN for Apple Devices
**Category:** (IT)

**Full Content:**
```
iPhone / iPad (iOS):
1. Settings → General → VPN
2. Add VPN Configuration
3. Type: L2TP
4. Description: Servicenow VPN
5. Server: vpn-nu.vpn.servicenow.edu
6. Account: your NetID
7. Password: your NetID password
8. Secret: servicenow (case sensitive)
9. Save → toggle VPN to ON

Mac OS X (10.7, 10.8, 10.9):
1. Apple → System Preferences → Network
2. Click + to add connection
3. Interface: VPN
4. VPN Type: L2TP over IPSec
5. Service Name: Servicenow VPN
6. Enter server address and credentials
7. Click Connect
```

---

---

## SECTION 6 — Additional Articles (Found in Second Pass)

---

### KB0010006 — MFA Setup Guide

**Short Description:** MFA Setup Guide
**Category:** (IT — Identity)

**Full Content:**
```
Issue: Need MFA setup

Resolution:
1. Install Microsoft Authenticator app (iOS App Store / Google Play)
2. Open Security Info portal: https://mysignins.microsoft.com/security-info
3. Click Add method → select Authenticator app
4. Scan QR code shown on screen with your phone
5. Enter the 6-digit verification code to confirm
6. Verify next sign-in uses MFA prompt

Escalation: Identity Team
```

---

### KB0000019 — System Restore

**Short Description:** How can I restore my computer to a previous configuration?
**Category:** (Windows)

**Full Content:**
```
System Restore — restores Windows to a previous working configuration.

Windows 10/11:
1. Press Windows + R → type: rstrui → press Enter
2. OR: Start → Settings → System → Recovery → Open System Restore
3. Select a restore point (choose a date before the problem started)
4. Click Next → Finish → Yes to confirm
5. PC will restart and restore — takes 10–15 minutes

Note: System Restore does NOT affect personal files (documents, photos).
It only changes system files, installed apps, and registry settings.

If System Restore fails: Contact IT Desktop Support.
```

---

### KB0000001 — Sales Force Automation / Zoho Outage

**Short Description:** Sales Force Automation is DOWN
**Category:** (Outage Notice)

**Full Content:**
```
Outage Notice — Zoho Services

On Friday January 20th, a widespread outage affected all Zoho services.
- Outage started: 8:13 AM Pacific Time
- Services restored for customers: 3:49 PM Pacific Time
- All services fully restored: later that evening

If you experience issues with Zoho/Salesforce:
1. Check IT announcements for current status
2. Try refreshing after 10 minutes
3. If still down — raise an incident ticket

Escalation: IT Infrastructure Team
```

---

### KB0000006 — Dealing with Spyware and Viruses

**Short Description:** Dealing with Spyware and Viruses
**Category:** (Security)

**Full Content:**
```
Symptoms of spyware/virus infection:
- Computer is unusually slow
- Unexpected pop-up ads
- Browser homepage changed without your action
- Programs opening on their own
- High CPU/RAM usage with no obvious cause

Steps to resolve:
1. Do NOT click on any pop-ups or suspicious links
2. Run a full antivirus scan (corporate antivirus tool)
3. Run Windows Defender Scan: Settings → Update & Security → Windows Security → Virus & threat protection
4. If infected files found → quarantine and delete
5. Restart machine
6. If issue persists → contact IT immediately (do not use the computer for sensitive work)

Prevention:
- Never download software from unofficial sources
- Don't click email attachments from unknown senders
- Keep Windows and antivirus updated
```

---

### KB0000007 — What is a Cookie?

**Short Description:** What is a cookie?
**Category:** (Tips and Tricks)

**Full Content:**
```
A cookie is a small text file stored on your computer by a website.

Purpose of cookies:
- Remember your login session (so you don't re-login every visit)
- Store shopping cart contents
- Remember your preferences (language, theme)
- Track website usage for analytics

Types:
- Session cookies: deleted when browser is closed
- Persistent cookies: remain until expiry date or manually cleared

How to clear cookies:
- Chrome: Settings → Privacy → Clear browsing data → Cookies
- Edge: Settings → Privacy → Clear browsing data → Cookies
- Firefox: Options → Privacy → Clear Data → Cookies

NathCorp policy: Only necessary cookies are used on company sites.
```

---

### KB0000010 — Warranty Coverage Details

**Short Description:** Warranty coverage details for SCI and DeSC computers
**Category:** (Hardware)

**Full Content:**
```
Warranty Coverage for NathCorp Computers:

Standard warranty covers:
- Hardware defects
- Manufacturing faults
- Component failures (screen, keyboard, battery, motherboard)

NOT covered by warranty:
- Physical damage (drops, spills, cracks)
- Accidental damage
- Software issues
- Loss or theft

To claim warranty:
1. Raise an IT support ticket with device serial number
2. IT team verifies warranty status
3. Device sent to manufacturer or service center
4. Loaner device provided if available

Escalation: IT Hardware Team / Desktop Support
```

---

### KB0000013 — Quit Application Not Responding

**Short Description:** How do I quit an application that isn't responding?
**Category:** (Windows / Mac)

**Full Content:**
```
Windows — Force quit a frozen application:

Method 1 — Task Manager:
1. Press Ctrl + Shift + Esc
2. Find the frozen application in the list
3. Right-click → End Task
4. Confirm End Task

Method 2 — Keyboard:
1. Press Ctrl + Alt + Delete
2. Click Task Manager
3. Select frozen app → End Task

Mac — Force quit:
1. Press Command + Option + Escape
2. Select the frozen application
3. Click Force Quit

If application keeps freezing: Restart your computer.
If issue persists: Raise an IT ticket — may need reinstallation.
```

---

### KB0000014 — Operating System Upgrade Requirements

**Short Description:** Can I upgrade my operating system?
**Category:** (Windows / Mac)

**Full Content:**
```
Before upgrading your OS, check system requirements and NathCorp policy.

Windows 11 minimum requirements:
- Processor: 1 GHz or faster, 2+ cores, 64-bit
- RAM: 4 GB minimum (8 GB recommended)
- Storage: 64 GB minimum
- TPM: Version 2.0 required
- Display: 720p or higher

NathCorp OS upgrade policy:
- All OS upgrades must be approved by IT
- Do NOT self-upgrade without IT approval
- Raise an IT service request for OS upgrade
- IT will schedule and perform the upgrade

Escalation: IT Desktop Support Team
```

---

### KB0000018 — About Windows Vista

**Short Description:** About Windows Vista
**Category:** (Windows — Legacy)

**Full Content:**
```
Windows Vista — legacy information (no longer supported by Microsoft).

Key features (historical):
- Aero glass UI
- User Account Control (UAC) — first introduced
- Windows Search improvements
- BitLocker drive encryption introduced

Note: Windows Vista reached end of support in April 2017.
NathCorp does NOT support Vista. If still running Vista, contact IT immediately
for an urgent OS upgrade — security risk.
```

---

### KB0000021 — About Windows 7

**Short Description:** About Windows 7
**Category:** (Windows — Legacy)

**Full Content:**
```
Windows 7 — legacy information (no longer supported by Microsoft).

Key features:
- Taskbar improvements (pinning apps)
- Aero Snap and Peek
- HomeGroup networking
- Improved Device Manager and Action Center

Note: Windows 7 reached end of support in January 2020.
NathCorp does NOT support Windows 7. Contact IT immediately for OS upgrade.
Running an unsupported OS is a security risk.
```

---

### KB0000022 — Set Default Web Browser

**Short Description:** How to set or change your default web browser
**Category:** (Windows)

**Full Content:**
```
Windows 10/11:
1. Start → Settings → Apps → Default apps
2. Scroll to "Web browser"
3. Click current browser → select your preferred browser
4. Confirm change

Supported browsers at NathCorp:
- Microsoft Edge (recommended — fully integrated with M365)
- Google Chrome
- Mozilla Firefox

Note: Internet Explorer is retired. Use Edge instead.
Admin rights may be required on managed devices — contact IT if you can't change.
```

---

### KB0000031 — Find MAC Address

**Short Description:** How can I find the MAC address of my Ethernet or wireless interface?
**Category:** (Networking)

**Full Content:**
```
A MAC address is a unique hardware identifier for your network adapter.

Windows:
Method 1:
1. Press Windows + R → type: cmd → Enter
2. Type: ipconfig /all → Enter
3. Find "Physical Address" under your adapter (format: XX-XX-XX-XX-XX-XX)

Method 2:
1. Settings → Network & Internet → Status
2. Click your connection → Properties
3. Scroll down to "Physical address (MAC)"

Mac:
1. Apple menu → System Preferences → Network
2. Select your connection → Advanced
3. Click Hardware tab → MAC Address shown

Why you need it: IT may ask for MAC address to register your device on the network.
```

---

### KB0000033 — Eclipse for Android Development

**Short Description:** Eclipse configuration for Android development
**Category:** (Developer Tools)

**Full Content:**
```
Eclipse Android Development Setup:

1. Download Eclipse IDE from eclipse.org
2. Install Android Development Tools (ADT) plugin:
   - Help → Install New Software
   - Add repository: https://dl-ssl.google.com/android/eclipse/
   - Select Android DDMS and Android Development Tools
   - Finish installation → Restart Eclipse
3. Download Android SDK from developer.android.com
4. In Eclipse: Window → Preferences → Android → set SDK Location
5. Create Android Virtual Device (AVD) for testing:
   - Window → Android Virtual Device Manager → New

Note: Eclipse ADT is deprecated. Consider Android Studio as the modern alternative.
```

---

### KB0000051 — USB Port Not Working

**Short Description:** USB port is not working on my PC
**Category:** (Hardware)

**Full Content:**
```
Issue: USB port not working / device not recognized

Resolution:
1. Try a different USB port on the same machine
2. Try the same USB device on a different machine (to isolate: device or port issue)
3. Restart the computer — USB drivers may need reset
4. Update USB drivers:
   - Device Manager → Universal Serial Bus controllers
   - Right-click each USB Root Hub → Update Driver
5. Disable and re-enable USB controller:
   - Device Manager → USB Root Hub → right-click → Disable
   - Wait 10 seconds → Enable
6. Check Power Management:
   - Device Manager → USB Root Hub → Properties → Power Management
   - Uncheck "Allow the computer to turn off this device to save power"

If hardware port is physically damaged: Raise IT ticket → hardware repair needed.

Escalation: Desktop Support
```

---

### KB0005010 — Mac Operating System Requirements

**Short Description:** Requirements for Mac Operating System
**Category:** (Mac / Hardware)

**Full Content:**
```
Mac OS minimum requirements (current supported versions):

macOS Ventura (13):
- Mac: 2017 or later (most models)
- RAM: 4 GB minimum
- Storage: 35 GB available space

macOS Monterey (12):
- Mac: 2015 or later (most models)
- RAM: 4 GB minimum
- Storage: 26 GB available space

NathCorp Mac policy:
- Keep macOS updated to latest approved version
- OS updates must be approved by IT
- Raise service request for major OS upgrades
- Casper/Jamf managed — IT pushes updates centrally

Escalation: IT Mac Support / Desktop Support
```

---

### KB0000003 — Internet Explorer 10 Settings

**Short Description:** Managing Settings in Internet Explorer 10 for Windows 8
**Category:** (Browser — Legacy)

**Full Content:**
```
Internet Explorer 10 — Settings (Legacy)

Set Home Page:
1. Tools (gear icon) → Internet Options
2. General tab → Home page → type your URL
3. Click Apply → OK

Connection Settings:
1. Tools → Internet Options → Connections tab
2. LAN Settings → configure proxy if required

Note: Internet Explorer is retired by Microsoft.
Please switch to Microsoft Edge for full M365 compatibility and security support.
NathCorp recommends Microsoft Edge as the default browser.
```

---

### KB0000052 — Cisco WebEx Meetings Server Boot Issue

**Short Description:** Cisco WebEx Meetings Server does not boot up after deployment
**Category:** (Enterprise Software)

**Full Content:**
```
Issue: Cisco WebEx Meetings Server fails to boot after deployment

This is a known issue with certain WebEx Meetings Server versions.

Resolution steps:
1. Verify VM hardware requirements are met (check Cisco documentation)
2. Check VMware/Hyper-V event logs for boot errors
3. Verify network configuration — WebEx requires specific ports open
4. Re-deploy the OVA/OVF template if initial deployment failed
5. Apply latest Cisco WebEx server patches

If issue persists: Raise ticket with Cisco TAC support.

Escalation: IT Infrastructure / Network Team
```

---

## Notes on Missing Articles

ServiceNow shows **49 articles** across 4 knowledge bases. We fetched **43 via API**.
The remaining ~6 articles are likely in **draft or retired state** — the `kb_knowledge` API only returns articles the service account (`cowork_plugin_svc`) has read access to, and some articles may be restricted to specific user criteria not assigned to our service account.

| KB | Portal count | API fetched |
|----|-------------|-------------|
| IT Knowledge Base | 42 | ~35 |
| KCS Knowledge Base (demo data) | 4 | 4 |
| Known Error | 3 | ~2 |
| Knowledge | 0 | 0 |
| **Total** | **49** | **43** |

---

*NathCorp Internal — KB Articles fetched from ServiceNow via MCP Server*
*Source: https://dev249650.service-now.com/api/now/table/kb_knowledge*
