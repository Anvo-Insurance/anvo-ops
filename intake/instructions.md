# Intake Processing Instructions

## Who This File Is For

Any Claude Cowork agent processing inbound emails or messages for Anvo Insurance. Read this file completely before processing any intake item.

---

## General Principles

### Tone
- Professional, warm, and efficient. Anvo is a boutique brokerage — clients should feel personally attended to, not processed by a machine.
- Use the client's name. Reference their business specifically if information is available.
- Never use insurance jargon without context. If referencing a coverage term, briefly explain it.
- When unsure about something, say so honestly and escalate — never guess on coverage questions.

### Response Time Expectations

| Request Type | Target Response Time |
|-------------|---------------------|
| Claims first notice | Within 1 hour |
| New business inquiry | Within 2 hours during business hours |
| Certificate requests | Within 4 hours during business hours |
| Renewal questions | Within 1 business day |
| General service requests | Within 1 business day |

**Business hours:** Monday–Friday, 8:00 AM – 6:00 PM ET.

### When to Escalate to a Human

Escalate immediately — do not attempt to handle — in these situations:

1. **Coverage questions.** Any question about what is or isn't covered under an existing policy.
2. **Claims.** After logging first notice, escalate to Edward. Do not advise the client on claims handling.
3. **Complaints.** Any expression of dissatisfaction with Anvo's service or a carrier's handling.
4. **Legal.** Any mention of lawsuits, attorneys, subpoenas, or regulatory inquiries.
5. **Billing disputes.** Any disagreement about premium amounts, payment plans, or cancellation for non-payment.
6. **Sensitive accounts.** <!-- TODO: Edward to fill in — list any accounts that always get routed to Edward directly -->
7. **Anything ambiguous.** If you cannot confidently categorize the request, escalate.

Escalation method: Assign the conversation to Edward in Intercom **and** send an email to edward@anvo-insurance.com with subject line: `[ESCALATION] {client name} — {brief reason}`.

---

## New Business Intake

When an inbound email or message requests a new insurance quote:

### Step 1: Extract Key Information

Pull the following from the message. If not provided, these are the questions to ask:

| Field | Required? | Notes |
|-------|-----------|-------|
| Business name | Yes | Legal entity name |
| Contact name | Yes | First and last |
| Contact email | Yes | |
| Contact phone | Yes | |
| Business address | Yes | Physical location(s) of operations |
| Business description | Yes | What do they do? In their own words is fine. |
| Lines of business requested | Yes | GL, property, auto, WC, umbrella, professional liability, etc. |
| Current carrier (if any) | If available | |
| Current premium (if known) | If available | |
| Policy expiration date | If available | Determines urgency |
| Revenue / payroll | If available | Needed for rating |
| Number of employees | If available | |
| Years in business | If available | |
| Loss history summary | If available | Any claims in last 5 years? |
| Referral source | If available | Who sent them to us? |

### Step 2: Acknowledge Receipt

Send an acknowledgment using the template at `templates/client_welcome_email.md` (adapt as needed). Include:
- Confirmation that we received their inquiry
- What information we still need (reference the gaps from Step 1)
- Expected timeline for next steps

### Step 3: Log in EZLynx

**To create a new commercial prospect in EZLynx:**

1. Navigate to `app.ezlynx.com/web/account/create/commercial` (or click the **Applicants** icon in the left sidebar — this opens the Create Applicant page).
2. Fill in the **Business Info** section. Required fields:
   - **Business Name** (required to proceed)
   - **Address State** (required to proceed)
   - **Primary Address**: Address Line 1, City, State, Postal Code (all required to proceed)
3. Fill in additional fields as available from the intake:
   - Email, Business Phone, Website URL
   - Legal Entity Type (dropdown: LLC, Corporation, Sole Proprietor, Partnership, etc.)
   - Tax ID / FEIN
   - Date Business Started
   - NAICS Code (auto-fills SIC Code, Nature of Business, and NAICS Description)
   - Description of Primary Operations (free text)
4. Fill in the **Lead Info** section:
   - Lead Source (dropdown — select the matching referral source)
   - Lead Status (set to "New")
   - Assigned Producer and CSR
5. Click **"Save Applicant"** to create the record.
   - Alternatively, click **"Create Submission"** if you're ready to start the submission workflow immediately.
6. After saving, navigate to the **Activity** tab and click **"Add new note"** (notepad icon) to log the initial intake:
   - In the note text, include: date of inquiry, source (email/Intercom/web form), summary of what the prospect needs, and what information is still missing.
   - Click **Save**.

### Step 4: Route for Quoting

1. Determine which lines of business are needed.
2. Reference `intake/checklists/` for the applicable line to identify what information is still needed.
3. Reference `carriers/carrier_matrix.md` to identify potential markets.
4. Flag the account for Edward's review before submitting to carriers.

---

## Renewal Processing

When a renewal notification or renewal inquiry comes in:

### Step 1: Identify the Account

1. Search EZLynx by insured name, policy number, or email.
2. Confirm the renewal date matches what's referenced.
3. Pull up current policy details: carrier, lines, premium, key coverages.

### Step 2: Check Renewal Timeline

Reference `workflows/renewal_timeline.md` to determine where this account falls in the renewal process and what actions are due.

### Step 3: Log and Route

1. Log a note in the account's **Activity** tab in EZLynx:
   - Note the renewal inquiry, who contacted us, and what they're asking about.
   - Include any changes to their operations, payroll, vehicles, or locations mentioned in the inquiry.
2. **Remarketing criteria:** Remarket to alternative carriers if any of the following apply:
   - Rate increase expected >10%
   - Claims activity has worsened since last renewal
   - Client explicitly requests remarketing
   - Current carrier has tightened appetite for this class
3. **Who reviews:** Edward reviews all renewal terms and makes the final decision on renew-in-place vs. remarket.
4. Route the renewal to Edward with a summary of the account status and any client-reported changes.

---

## Certificate Requests

When a client or third party requests a Certificate of Insurance (COI):

### Step 1: Verify Identity

- Is the requestor the named insured, an authorized contact, or a third party?
- If third party: confirm the named insured has authorized the request (or that the request type doesn't require authorization — e.g., a lease requirement they've already told us about).

### Step 2: Gather Requirements

| Field | Required? |
|-------|-----------|
| Certificate holder name and address | Yes |
| Additional insured? (Yes/No) | Yes |
| If additional insured: exact wording of endorsement needed | Yes |
| Waiver of subrogation required? | Ask |
| Primary/non-contributory required? | Ask |
| Specific coverage limits or requirements | Ask |
| Deadline | Yes |

### Step 3: Issue or Escalate

Agents **can** issue certificates directly from EZLynx using the built-in certificate workflow.

**How to issue a COI in EZLynx:**
1. Search for the account and open it.
2. Click the **Certificates** tab.
3. Click **"Add certificate master"** (or open an existing master if one is already set up for this account).
4. The certificate wizard has 6 steps — complete them in order:
   - **Add Policy:** Select the ACORD form type from the dropdown (e.g., ACORD 25 for liability, ACORD 28 for evidence of property). Enter a Certificate Name. The system will show associated policies to select.
   - **Master Remarks & Coverages:** Add any special remarks or coverage notes.
   - **Add Master Documents:** Attach supporting documents if needed.
   - **Add Certificate Holders:** Enter the certificate holder's name and address. Mark as Additional Insured if applicable.
   - **Review PDF:** Preview the completed certificate. Verify all information is correct.
   - **Distribute:** Send the certificate via email or download as PDF.
5. After issuing, log a note in the **Activity** tab documenting the certificate request and issuance.

**When to escalate instead of issuing directly:**
- If the request requires **adding an Additional Insured endorsement** to the policy (not just listing them on the cert) — this requires carrier involvement. Escalate to Edward.
- If the request requires **waiver of subrogation** or **primary/non-contributory** language and the current policy doesn't already include these endorsements — escalate to Edward.
- If you're unsure whether the existing policy supports what's being requested — escalate to Edward.

---

## Claims First Notice

When a client reports a loss or incident:

### Step 1: Capture Details

| Field | Details |
|-------|---------|
| Insured name | |
| Policy number | |
| Date of loss | |
| Description of loss | In the client's own words — do not paraphrase or summarize |
| Location of loss | |
| Injuries involved? | Yes/No/Unknown |
| Police/fire report filed? | Yes/No/Unknown |
| Estimated damage amount | If known |
| Third parties involved? | Names and contact info if available |

### Step 2: Acknowledge and Reassure

- Confirm receipt of the report.
- Let the client know their claim will be reported to the carrier promptly.
- Do **not** discuss coverage, fault, liability, or whether the claim will be covered. Ever.

### Step 3: Escalate Immediately

Forward all claim details to Edward. Include the raw client message plus the structured data from Step 1. Do not wait for a batch — claims are time-sensitive.

<!-- TODO: Edward to fill in — carrier claim reporting procedures (phone numbers, online portals, etc.) -->

---

## General Service Requests

For any other request type (endorsement changes, billing questions, policy document requests, etc.):

### Step 1: Categorize

| Request Type | Action |
|-------------|--------|
| Endorsement / policy change | Log request, escalate to Edward for review before processing |
| Billing question | Escalate to Edward — do not discuss payment details |
| Policy document request (dec page, full policy) | Agents can pull these from EZLynx: navigate to the account → **Documents** tab → search by document name or policy number → click **Actions** to download or share. Dec pages, applications, and COIs are stored here. |
| Cancel policy request | Escalate to Edward immediately — never process a cancellation without human review |
| Add/remove vehicle, driver, location | Log details, escalate for processing |
| General information question | Answer if it's factual and non-coverage-related. Escalate if uncertain. |

### Step 2: Log in EZLynx

Every service request must be logged as a note in EZLynx, regardless of how it's resolved.

**How to log an activity note:**
1. Search for the account in EZLynx (use the **Search** bar at the top or navigate via the Applicant search page).
2. Open the account and click the **Activity** tab.
3. Click the **"Add new note"** button (notepad icon with "+" in the upper right of the Activity panel).
4. In the note text, include:
   - **Date** of the request
   - **Request type** (endorsement, billing, document request, etc.)
   - **Summary** of what was requested
   - **Action taken** (what you did or who you escalated to)
   - **Status** (resolved, pending, escalated)
5. Click **Save**.

**Note:** EZLynx uses a freeform note system (not structured activity type codes). Use consistent formatting in the note text to make entries searchable. The "Search Activities" box on the Activity tab searches note content.
