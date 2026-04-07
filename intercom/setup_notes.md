# Intercom Setup Notes

## Overview

Anvo Insurance uses Intercom as the primary customer-facing messaging platform. Intercom is integrated with EZLynx (our agency management system) via Google Apps Script webhooks.

## Integration Architecture

```
Intercom → Google Apps Script Webhook → EZLynx
```

<!-- TODO: Edward to fill in -->
<!-- Details needed:
- Google Apps Script project URL / ID
- Webhook endpoint URLs
- What data flows from Intercom to EZLynx (contact creation, activity logging, etc.)
- What data flows from EZLynx to Intercom (policy status, renewal alerts, etc.)
- Authentication method (API keys, OAuth)
- Error handling: what happens when the webhook fails?
- Who maintains the Apps Script code?
- Where is the Apps Script code stored (separate repo, Google Drive)?
-->

## Intercom Workspace Details

<!-- TODO: Edward to fill in -->
<!-- Details needed:
- Intercom workspace ID
- Team inboxes configured
- Business hours set in Intercom
- Auto-reply / away message configuration
- Custom attributes defined on contacts
- Tags taxonomy
-->

## Key Contacts for Support

<!-- TODO: Edward to fill in -->
<!-- If the integration breaks, who do we contact? Internal and vendor contacts. -->
