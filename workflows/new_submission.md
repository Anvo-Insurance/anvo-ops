# Workflow: New Business Submission (End-to-End)

## Purpose

This document defines the complete process for taking a new risk from initial inquiry through binding. Follow these steps in order. Do not skip steps or proceed to the next step until the current step is complete.

---

## Step 1: Intake

**Owner:** Intake agent (Claude or Alice)
**Reference:** `intake/instructions.md` → New Business Intake section

1. Receive inbound inquiry (email, Intercom, phone log, referral).
2. Extract all available information per the intake instructions.
3. Send acknowledgment to the prospect (see `templates/client_welcome_email.md`).
4. Create prospect record in EZLynx (see `intake/instructions.md` → "Step 3: Log in EZLynx" for the full procedure — navigate to `app.ezlynx.com/web/account/create/commercial`, fill in Business Info and Lead Info, click Save).
5. Log the source of the lead (referral, website, cold outreach, etc.).

**Gate:** Proceed to Step 2 only after the prospect record exists in EZLynx and the acknowledgment has been sent.

---

## Step 2: Information Gathering

**Owner:** Intake agent, with client cooperation
**Reference:** `intake/checklists/` — use the checklist for each applicable line of business

1. Identify which lines of business the client needs.
2. Pull the corresponding checklist(s) from `intake/checklists/`:
   - `commercial_auto.md`
   - `bop.md`
   - `workers_comp.md`
   - <!-- TODO: Edward to fill in — add checklists as they're created (GL, umbrella, professional liability, etc.) -->
3. Compare what the client has already provided against the checklist.
4. Send one consolidated request to the client listing all missing items. Do not send piecemeal requests — one complete ask is better than five partial ones.
5. Follow up if no response within:
   - 3 business days → first follow-up
   - 7 business days → second follow-up
   - 14 business days → final follow-up, note account as "stalled" in EZLynx
6. As documents arrive, update the EZLynx file and check items off the checklist.

**Gate:** Proceed to Step 3 only when sufficient information exists to make a credible submission. At minimum: completed ACORD apps, loss runs, and description of operations. Flag to Edward if the client is unresponsive.

---

## Step 3: Carrier Selection

**Owner:** Edward (final decision), with agent pre-screening
**Reference:** `carriers/carrier_matrix.md`

1. Review the risk characteristics: class code, location, building details, loss history, premium estimate.
2. Open `carriers/carrier_matrix.md` and identify carriers whose appetite matches this risk.
3. For each potential carrier, verify:
   - They write this class of business in this state.
   - The risk doesn't hit any of their exclusion criteria (building age, frame construction, loss ratio, etc.).
   - The estimated premium falls within their sweet spot.
4. Rank carriers by likelihood of competitive quote (best appetite match first).
5. Recommend 3-5 carriers to Edward for approval.
6. Edward approves the carrier list (or modifies it).

**Gate:** Do not submit to any carrier without Edward's approval on the carrier selection.

---

## Step 4: Submission

**Owner:** Submission agent (Claude or Alice)
**Reference:** `carriers/submission_preferences.md`

1. For each approved carrier, check `carriers/submission_preferences.md` for:
   - Required forms and supplementals
   - Submission method (portal vs. email)
   - File naming conventions
   - Any carrier-specific quirks
2. Prepare the submission package:
   - ACORD applications (filled completely — no blank fields)
   - Loss runs (currently valued, covering required years)
   - Supplemental applications (carrier-specific)
   - Photos (if required)
   - Cover letter summarizing the risk (see `templates/` for cover letter template)
3. Submit to each carrier via their preferred method.
4. Log each submission in EZLynx:
   - Date submitted
   - Carrier name
   - Method (portal/email)
   - Confirmation number or email thread reference
5. Set follow-up reminders:
   - 5 business days → check for acknowledgment
   - 10 business days → follow up if no quote received
   - 15 business days → escalate to Edward if still no response

---

## Step 5: Follow-Up and Negotiation

**Owner:** Edward (negotiation), agent (tracking)

1. Monitor edward@anvo-insurance.com and alice@anvo-insurance.com for carrier responses (see `intake/email_accounts/submissions_at_anvo.md` for the full inbound flow).
2. When a quote is received:
   - Log it in EZLynx with premium, key terms, and any exclusions or conditions.
   - Flag any subjectivities (conditions that must be met before binding).
   - Note the quote expiration date.
3. When a declination is received:
   - Log it in EZLynx with the stated reason.
   - If the reason reveals new appetite info, create a market note per `carriers/market_notes/README.md`.
4. When a request for additional information is received:
   - Respond within 4 hours if possible.
   - If the requested info requires client cooperation, contact the client immediately and set expectation with the underwriter on timing.
5. Once all carrier responses are in (or the deadline is approaching), compile results for Edward.

---

## Step 6: Proposal

**Owner:** Edward (content), agent (assembly)

1. Edward reviews all quotes and selects options to present to the client.
2. Prepare a proposal document including:
   - Executive summary of coverage options
   - Side-by-side carrier comparison (premium, coverage differences, deductibles, key exclusions)
   - Recommended option with reasoning
   - Any coverage gaps or concerns to discuss
   <!-- TODO: Edward to fill in — proposal template location, format preferences -->
3. Edward reviews and approves the proposal.
4. Send to the client with a request to schedule a review call or meeting.
5. Follow up if no response within 3 business days.

---

## Step 7: Binding

**Owner:** Edward (authorization), agent (execution)

**Critical: Never bind coverage without Edward's explicit authorization.**

1. Client selects a carrier/option.
2. Edward confirms binding instructions:
   - Effective date
   - Payment plan selection
   - Any last-minute changes to coverage
3. Verify all subjectivities are met (inspections completed, documents signed, etc.).
4. Submit bind request to the carrier via their preferred method.
5. Obtain binder or confirmation of coverage.
6. Send confirmation to the client with:
   - Bound carrier name
   - Effective date
   - Key coverage summary
   - Expected timeline for policy issuance
   - Payment instructions (if applicable)
7. Update EZLynx:
   - Change status from prospect/applicant to active client
   - Enter policy details
   - Set renewal reminder (see `workflows/renewal_timeline.md`)
8. Send welcome email (see `templates/client_welcome_email.md` — use the post-binding version).

---

## Timing Benchmarks

| Stage | Target Duration |
|-------|----------------|
| Intake to information request sent | Same day as inquiry |
| Information gathering | 1-2 weeks (client-dependent) |
| Carrier selection | 1 business day after info complete |
| Submission to all carriers | 1 business day after carrier approval |
| Carrier quote turnaround | 5-10 business days (varies by carrier and complexity) |
| Proposal delivery | 2 business days after quotes received |
| Binding | Same day as client decision |

**Total target: 3-4 weeks from inquiry to bound** (assuming responsive client).
