# Inbound Submissions Flow

## How Submissions Reach Anvo

Anvo does **not** have a dedicated submissions email inbox. Instead, inbound quote requests follow this path:

```
Website quoting form → Google Sheet (new row) → Google Apps Script → Email notification
```

1. A prospect fills out the quoting form on the Anvo website.
2. The form submission creates a new row in a Google Sheet. <!-- TODO: Edward to fill in — Google Sheet name/URL -->
3. A Google Apps Script monitors the sheet and sends an email notification to both:
   - **alice@anvo-insurance.com**
   - **edward@anvo-insurance.com**

## What the Notification Contains

<!-- TODO: Edward to fill in — what fields from the web form get included in the email? (name, business, lines requested, etc.) -->

## Processing Priority

| Submission Type | Priority | Action |
|----------------|----------|--------|
| Complete form with all fields filled | High | Begin intake immediately per `intake/instructions.md` |
| Partial form (missing key info) | Medium | Send follow-up to gather missing info |
| Duplicate submission (same person, same request) | Low | Merge with existing — do not create duplicate records |

## Routing Rules

| Condition | Route To |
|-----------|----------|
| All new submissions | Alice handles initial intake and follow-up |
| Complex or large accounts | Alice escalates to Edward |
| Submissions requiring carrier selection decisions | Edward reviews before submission to carriers |

## Carrier Responses

Carrier responses to submissions Anvo has sent out (quotes, declinations, requests for info) arrive via:

<!-- TODO: Edward to fill in — do carrier responses come to edward@ and alice@ directly? Or to a shared inbox? Or through carrier portals? -->

### Processing Carrier Responses

| Response Type | Priority | Action |
|--------------|----------|--------|
| Request for additional information | High — respond within 4 hours | Gather the info and reply to the underwriter |
| Quote indication or formal quote | High | Log in EZLynx, route to Edward for review |
| Declination | Medium | Log in EZLynx with reason. If reason reveals appetite info, create a market note per `carriers/market_notes/README.md` |
| Submission acknowledgment | Low | Log and file |
