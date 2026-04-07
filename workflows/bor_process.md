# Workflow: Broker of Record (BOR) Change

## Purpose

This document defines the process for executing a Broker of Record change — when a prospect wants to move their existing policies to Anvo without waiting for renewal. A BOR transfers the servicing rights on an in-force policy from the current broker to us.

---

## When to Use a BOR

A BOR is appropriate when:

- The client wants to switch to Anvo mid-term (not at renewal).
- The client is dissatisfied with their current broker's service.
- The client has been acquired by or merged with an existing Anvo client.
- A referral source has introduced us and the client wants to move immediately.

A BOR is **not** appropriate when:

- The policy is within 60 days of renewal — remarket at renewal instead.
- The client only wants a quote comparison — that's a new business submission, not a BOR.
- The client is under contract with their current broker that restricts BOR transfers.

---

## Step 1: Client Authorization

**Owner:** Edward

1. Confirm the client's intent to transfer brokerage to Anvo.
2. Identify all policies the client wants to transfer:
   - Carrier name
   - Policy number
   - Line of business
   - Current effective/expiration dates
   - Current premium
3. Prepare the BOR letter(s). One letter per carrier is required.
   <!-- TODO: Edward to fill in — BOR letter template location -->
4. BOR letter must include:
   - Insured's legal name (must match the policy exactly)
   - Policy number(s)
   - Statement appointing Anvo Insurance as broker of record
   - Effective date of the BOR
   - Signature of an authorized representative of the insured
   - Date signed
5. Obtain the signed BOR letter from the client.

**Gate:** Do not proceed without a signed BOR letter.

---

## Step 2: Submit to Carrier

**Owner:** Agent (Claude or Alice)

1. Identify the correct submission point for each carrier:
   - Some carriers accept BOR letters via their portal.
   - Some require email to the underwriter or agency services department.
   - Some require physical mail or fax.
   <!-- TODO: Edward to fill in — carrier-specific BOR submission methods, or add to carriers/submission_preferences.md -->
2. Submit the signed BOR letter to each carrier.
3. Request written confirmation of the BOR transfer.
4. Log the submission in EZLynx:
   - Date submitted
   - Carrier
   - Method of submission
   - Tracking number (if applicable)

---

## Step 3: Confirmation and Onboarding

**Owner:** Agent, with Edward oversight

1. Carrier confirms the BOR transfer (typically 5-10 business days).
2. Upon confirmation:
   - Request full policy copies from the carrier.
   - Request current loss runs.
   - Request commission schedule/statement.
3. Set up the account in EZLynx:
   - Create client record (if not already a prospect).
   - Enter all policy details from the dec pages.
   - Upload policy documents.
   - Set renewal reminders per `workflows/renewal_timeline.md`.
4. Send the client a confirmation that the transfer is complete, including:
   - What policies transferred
   - Anvo's contact information for service requests
   - Next steps (renewal review timeline)
   <!-- TODO: Edward to fill in — onboarding email template -->

---

## Step 4: Review and Remarket at Renewal

1. Schedule a coverage review with the client within 30 days of the BOR effective date.
2. Review current coverages for adequacy — use this as an opportunity to identify gaps.
3. At the next renewal, follow the standard renewal process (`workflows/renewal_timeline.md`) and consider remarketing to ensure competitive pricing.

---

## Common Issues

| Issue | Resolution |
|-------|-----------|
| Carrier rejects BOR — signature doesn't match | Obtain new letter with correct authorized signer. Verify signer matches named insured or has documented authority. |
| Carrier rejects BOR — policy number incorrect | Verify exact policy number from a dec page or statement. Resubmit. |
| Former broker contests the BOR | The BOR is the client's decision. Carrier must honor a valid BOR letter. If the former broker escalates, notify Edward. |
| Carrier says BOR cannot be processed mid-term | Some carriers restrict mid-term BORs. Document the restriction and schedule for renewal transfer instead. |
| Commission disputes | Edward handles all commission-related discussions with carriers. |

<!-- TODO: Edward to fill in — any additional Anvo-specific BOR procedures or carrier quirks -->
