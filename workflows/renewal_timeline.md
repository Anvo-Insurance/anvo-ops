# Workflow: Renewal Timeline

## Purpose

This document defines the standard renewal workflow and timing milestones for all commercial accounts. Every active policy follows this timeline unless Edward explicitly overrides it for a specific account.

Cross-reference `accounts/active_notes.md` for account-specific renewal dates and notes.

---

## Renewal Milestones

### 120 Days Before Expiration: Renewal Flagged

**Owner:** System / Agent
**Actions:**
- EZLynx generates a renewal alert (or agent identifies upcoming renewal from `accounts/active_notes.md`).
- Create a renewal activity in EZLynx.
- Pull the account file: current policy details, prior loss runs, any notes from the last renewal.

---

### 90 Days Before Expiration: Renewal Review Initiated

**Owner:** Edward
**Actions:**
1. Review the account:
   - Current carrier and premium
   - Loss history (any new claims since last renewal?)
   - Account profitability (premium vs. commission vs. service time)
   - Client relationship status (satisfied? any complaints?)
   - Market conditions for this class of business
2. **Decision: Renew in place or remarket?**

| Condition | Default Action |
|-----------|---------------|
| Loss ratio is clean, pricing is competitive, client is satisfied | Renew in place — request renewal terms from carrier |
| Rate increase expected >10% | Remarket to alternative carriers |
| Claims activity has worsened | Remarket — current carrier may non-renew or increase significantly |
| Client requests remarketing | Remarket |
| New lines of business needed | Submit new lines to appropriate carriers (see `workflows/new_submission.md`) |
| Account is unprofitable or service-intensive | Edward decides: renew, remarket, or non-renew |

3. If remarketing: initiate the submission process per `workflows/new_submission.md`, starting at Step 2 (information already on file — verify it's current).
4. If renewing in place: request renewal pricing from the current carrier.

---

### 75 Days Before Expiration: Client Contact

**Owner:** Agent (Claude or Alice)
**Actions:**
1. Contact the client to:
   - Confirm their business operations haven't changed materially.
   - Verify locations, vehicle schedules, employee counts, revenue — whatever is relevant to the policy.
   - Ask if they need any coverage changes.
   - Inform them we're working on their renewal.
2. Request updated information if anything has changed:
   - Updated payroll (for WC)
   - Updated vehicle/driver schedules (for auto)
   - Updated revenue figures
   - Any new operations, locations, or exposures
3. Request current loss runs from the carrier(s) if not already pulled.

---

### 60 Days Before Expiration: Submissions Out

**Owner:** Agent
**Actions:**
1. If remarketing: all submissions should be out to carriers by this date.
   - Follow `carriers/submission_preferences.md` for formatting.
   - Target 3-5 carriers per `carriers/carrier_matrix.md`.
2. If renewing in place: renewal terms should be requested from the carrier by this date.
3. Log all submissions/requests in EZLynx.
4. Set follow-up reminders per `workflows/new_submission.md` Step 4 timing.

---

### 45 Days Before Expiration: Quotes Expected

**Owner:** Agent (tracking), Edward (review)
**Actions:**
1. Follow up with any carriers that haven't responded.
2. As quotes come in, log in EZLynx with premium, terms, and conditions.
3. Compile all options for Edward's review.

---

### 30 Days Before Expiration: Proposal to Client

**Owner:** Edward
**Actions:**
1. Edward finalizes the renewal recommendation.
2. Prepare and deliver the renewal proposal to the client:
   - Current vs. renewal premium comparison
   - If remarketed: side-by-side carrier options
   - Coverage changes (if any)
   - Recommended option with reasoning
3. Schedule a call or meeting to review if the account warrants it.
   - Accounts over $25,000 annual premium get a personal review call.
   - Smaller accounts can receive the proposal by email with a follow-up.

---

### 15 Days Before Expiration: Decision Deadline

**Owner:** Edward + Client
**Actions:**
1. If the client hasn't responded to the proposal, follow up urgently.
2. Obtain the client's decision: which option to bind.
3. If switching carriers: confirm effective date aligns with expiration of current policy (no gap, no overlap).
4. If renewing in place: confirm acceptance of renewal terms.

**Escalation:** If no client decision by this date, Edward contacts the client directly. A policy lapsing is unacceptable — the client must make a decision or we must document that we provided options and they chose not to respond.

---

### 7 Days Before Expiration: Binding

**Owner:** Edward (authorization), Agent (execution)
**Actions:**
1. Bind the selected option per Edward's authorization.
2. Follow binding procedure from `workflows/new_submission.md` Step 7.
3. Send confirmation to the client.
4. Update EZLynx with new policy details.

---

### Day of Expiration: Verification

**Owner:** Agent
**Actions:**
1. Confirm that the new/renewed policy is in force.
2. Verify binder or policy confirmation is on file.
3. If there is any gap in coverage, alert Edward immediately.

---

### Post-Renewal (Within 30 Days)

**Owner:** Agent
**Actions:**
1. Obtain and file the new policy when issued.
2. Review the issued policy against the bound terms — flag discrepancies to Edward.
3. Issue any required certificates of insurance.
4. Update `accounts/active_notes.md` with new carrier, premium, and any notes.
5. Set the next renewal reminder (reset the 120-day clock for the new expiration).

---

## Exception Handling

| Scenario | Action |
|----------|--------|
| Carrier issues non-renewal notice | Treat as urgent remarketing — immediately begin carrier selection regardless of where we are in the timeline. |
| Client wants to cancel / not renew | Edward handles directly. Document the client's written request. |
| Market hardening — limited options available | Start remarketing earlier (120 days out). Cast a wider net on carriers. Alert Edward early. |
| Client unresponsive throughout the process | Document all outreach attempts. Edward makes final call on whether to bind renewal or let policy expire. |

<!-- TODO: Edward to fill in — any account-tier-specific variations (e.g., VIP accounts get earlier touchpoints) -->
