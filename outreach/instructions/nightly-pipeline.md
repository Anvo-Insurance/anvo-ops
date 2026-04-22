# Nightly Prospecting Pipeline — Runbook

**Primary reader:** Claude (Cowork scheduled-task agent).
**Secondary reader:** Edward.

This file is the source of truth for the continuous nightly prospecting pipeline. The scheduled task prompt is intentionally thin and delegates here. When Apollo navigation breaks, when a credit-budget rule changes, when a new escalation trigger emerges — edit this file, push, and the next run picks it up.

This runbook covers **orchestration and operational mechanics only**. For stage-by-stage scoring criteria, tier definitions, and pipeline philosophy, see `instructions/INSTRUCTIONS-v5.md`. For Stage 4–7 logic, see `instructions/INSTRUCTIONS-stage4-7.md`.

---

## Purpose

Run the Anvo prospecting pipeline in small batches every 45 minutes between 11pm and 3am ET. Each run advances the pipeline by one batch: clear pending Apollo email reveals, then run Stage 2 verification on the next chunk of the master prospect list, then optionally do Phase 2 phone reveals. Update state files, append learnings, output a summary.

The pipeline is designed to be safe to interrupt at any point. State files reflect only what's fully completed. The next run picks up automatically.

---

## Source-of-Truth Files

All paths are relative to the `anvo-brain` repo root.

| Path | Role | Read/Write |
|------|------|------------|
| `outreach/reports/nightly-run-state.json` | Pipeline state — pending reveals, batch counters, credit cycle, daily run count | Read at start, write at end |
| `outreach/reports/pipeline-learnings.json` | Accumulated workarounds and observations from prior runs | Read at start, append on new findings |
| `outreach/instructions/INSTRUCTIONS-v5.md` | Stage-by-stage scoring, verification, and reveal logic | Read at start |
| `outreach/instructions/nightly-pipeline.md` | This file — orchestration mechanics | Read at start |
| `outreach/reports/stage3_results.csv` | Ground truth — every revealed contact, with email and phone columns | Append after each successful reveal |
| `outreach/reports/A2-stage1-tier1-scored.csv` | Master Tier 1 prospect list (1,495 companies) | Read only |
| `outreach/reports/A2-stage2-batch[N]-verified.csv` | Per-batch Stage 2 output | Write new file per batch |

---

## Guardrails (Never Cross)

- **Never reveal a contact at a SKIP or MANUAL CHECK company.**
- **Never reveal multiple contacts at the same company** — one decision-maker only.
- **Phase 2 phone reveals are only for contacts whose email was already revealed.** Never do a phone-only reveal.
- **Never confirm purchases, bind coverage, or submit applications** in any portal.
- **Process everything sequentially.** Do NOT spawn parallel sub-agents — Apollo's anti-bot signals trigger fast on parallelism.
- **Stop immediately if Apollo shows any billing, upgrade, or credit-limit modal.** Surface to Edward, do not retry.
- **Never reveal a phone number if it would push you over the 2,600 monthly cap with email reveals still remaining.** Emails always come first.
- **If `credits_remaining <= 0`, STOP** and output: "Monthly credit cap reached — pausing until the 2nd."
- **If today already has 6+ completed runs in `daily_runs`, STOP** and output: "Daily run cap reached — next run in 45 min."

---

## Capability Boundary

- This task runs in Cowork mode with Claude in Chrome. **Chrome must be open and logged into Apollo.io** before the run starts. If Chrome is closed, surface the issue and stop.
- The agent cannot install software, restart Chrome, or fix login state. If Apollo's session expires mid-run, surface and stop.
- File reads/writes against the repo are direct (mounted folder access). State and learnings files are versioned — every run that mutates them produces a commit (the scheduled task prompt handles git push).

---

## Run Lifecycle

```
0.   Read state + learnings + INSTRUCTIONS-v5
0.5. Disable Apollo enrichment mode (MANDATORY)
1.   Phase 1 — Clear pending email reveals
2.   Stage 2 — Verify next batch (if reveal cap not hit)
2.5. Phase 2 — Phone reveals (only if conditions met)
3.   Update state file + append learnings
4.   Output summary
```

Hard caps per run: **25 email reveals**, **5–15 phone reveals depending on cycle phase**, **25 Stage 2 verifications**.

---

### Step 0 — Read State and Compute Budget

Read in order:
1. `outreach/reports/nightly-run-state.json`
2. `outreach/reports/pipeline-learnings.json` — read every learning, follow them, especially `credit_budget` section
3. `outreach/instructions/INSTRUCTIONS-v5.md`
4. `outreach/reports/stage3_results.csv` — ground truth for which companies are already revealed

**Credit cycle math:**

Credits refresh on the **2nd of every month**. The cycle runs from the 2nd to the 1st.

From `nightly-run-state.json` → `credit_cycle`:
- `credits_remaining = 2600 - total_credits_spent`
- `days_left_in_cycle` = days until the next 2nd
- `daily_budget = credits_remaining / days_left_in_cycle`

Decision tree:
- `credits_remaining <= 0` → STOP (cap reached)
- `daily_budget < 10` → slow down, Phase 1 only, skip Phase 2
- `days_left_in_cycle <= 5` AND `credits_remaining > 100` → ACCELERATE: increase batch size and add Phase 2 reveals to use remaining credits before reset

**Daily run cap:** check `daily_runs.count` for today's date. If >= 6, STOP. Cap is 6 to allow ~120 credits/day normally, with acceleration near cycle end.

---

### Step 0.5 — Disable Apollo Enrichment Mode (NON-NEGOTIABLE)

Before any Apollo searches, navigate to `https://app.apollo.io/#/people` and run:

```js
const toggle = document.querySelector('input[aria-label="Enable enrichment mode"]');
if (toggle && toggle.checked) { toggle.click(); 'Disabled enrichment mode'; }
else { 'Enrichment mode already off'; }
```

Wait 3 seconds after page load before running the check.

**Why this matters:** enrichment mode auto-reveals contacts on every page load, silently burning ~18 credits per search. This single oversight has wasted hundreds of credits in past runs. Always disable at session start.

---

### Step 1 — Phase 1: Clear Pending Email Reveals

Check `nightly-run-state.json` → `stage3.pending_reveals`. Companies under any `batch*_pending` are already Stage 2 verified and ready for Apollo reveals.

**Process sequentially, one company at a time.** Append each result to `stage3_results.csv` immediately after the reveal completes. Cap: 25 reveals per run.

For each pending company, follow the **Apollo Reveal Procedure** below.

---

### Step 2 — Stage 2: Verify Next Batch

If pending reveals consumed the 25-company cap, stop and update state. Don't start new Stage 2 work in the same run.

If capacity remains, take the next 25 HIGH-scored companies from `A2-stage1-tier1-scored.csv` that are NOT in any prior `A2-stage2-batch[N]-verified.csv`. **Use fuzzy matching** — normalize by lowercasing, stripping LLC/Inc/Corp suffixes and punctuation, then substring-matching. Exact matching misses companies. Sort KC metro first, then by `overall_score` descending.

Verify each sequentially. For each:

A. **Visit website.** If dead/no website (403/404), search `"<company name> <city> <state>"` via WebSearch. Check BBB, Yelp, business directories before marking UNVERIFIED.
B. **Determine status:** OPEN / CLOSED / UNVERIFIED.
C. **Confirm identity** matches Apollo record (use core business name, not full Apollo string which may be truncated).
D. **Confirm physical address** is in Missouri or Kansas.

**Recommendation rules:**
- OPEN + correct match + in MO/KS → REVEAL
- CLOSED → SKIP
- MISMATCH or WRONG LOCATION → SKIP
- UNVERIFIED → MANUAL CHECK

Save to `outreach/reports/A2-stage2-batch[N]-verified.csv` (increment N from `state.stage2.next_batch_number`).

Then immediately run Apollo reveals on all REVEAL companies from this new batch (same procedure as Step 1).

---

### Step 2.5 — Phase 2: Phone Reveals (Conditional)

**GO/NO-GO checklist — all three must be true:**

1. ☐ All Phase 1 email reveals for this run are complete
2. ☐ `credits_remaining > 100`
3. ☐ Either: `days_left_in_cycle <= 10` (use-it-or-lose-it) OR all companies in master list have been Stage 2'd (no more email reveals possible)

If any unchecked, skip this step.

**Workflow:**
1. Read `stage3_results.csv`. Find contacts with revealed email but empty phone column.
2. Prioritize: Tier 1 first, then by rank ascending (lowest rank = highest priority).
3. For each, navigate to their Apollo people search page.
4. Find row using `[data-tour-id^="mobile-cell"]`. Cells containing "Request phone number" indicate phone is available to request.
5. Click "Request phone number" — full event dispatch on `a[data-interaction="Request Phone Number"]`. If dispatch doesn't trigger after 7 seconds (cell still says "Request phone number"), fall back to `computer` tool `left_click` at the link's bounding rect center.
6. Wait 7 seconds. Re-read the mobile cell by NAME-BASED search (row index shifts after click).
7. Outcomes:
   - Phone number revealed (e.g., `+1 (816) 555-1234 +1`) → SUCCESS, update CSV
   - "No mobile number" → write `NO_MOBILE` in phone column. Still costs credits.
   - Cell still shows "Request phone number" → click didn't register, retry with computer tool

**Phone reveal budget per run:**
- `days_left_in_cycle > 10` → max 5
- `days_left_in_cycle <= 10` → max 15
- `days_left_in_cycle <= 3` → reveal as many as budget allows

Each phone reveal costs ~7–8 credits. Track in `state.credit_cycle.phone_credits_spent`.

---

### Step 3 — Update State + Append Learnings

Update `outreach/reports/nightly-run-state.json`:
- `stage3.total_revealed_to_date`, `stage3.total_credits_spent_to_date`
- `stage3.pending_reveals` — remove completed
- `stage2.total_verified`, `stage2.next_batch_number`
- `last_updated` → today
- `daily_runs` — increment today's run count (create field if missing, reset if date changed):
  ```json
  "daily_runs": { "date": "2026-04-22", "count": 1 }
  ```
- `credit_cycle`:
  ```json
  "credit_cycle": {
    "cycle_start": "2026-04-02",
    "cycle_end": "2026-05-01",
    "email_credits_spent": 74,
    "phone_credits_spent": 0,
    "enrichment_credits_wasted": 0,
    "total_credits_spent": 74
  }
  ```
- **Cycle reset rule:** if today is on or after the 2nd AND `cycle_start` is from the previous month, reset — set `cycle_start` to this month's 2nd, zero out all credits spent.

Update `outreach/reports/pipeline-learnings.json`:
- Append any new issue, error, workaround, or performance observation to `learnings`.
- **Categories:** `apollo_navigation`, `apollo_reveal`, `phone_reveal`, `company_matching`, `stage2_verification`, `chrome_stability`, `performance`, `credit_management`
- **Severity:** `critical`, `high`, `medium`, `low`, `info`
- If a previous learning is now outdated, append a NEW learning noting the correction. Do not delete old ones — history matters.

---

### Step 4 — Output Summary

Print one block:

```
Run #X today | Batch N
Phase 1 — emails revealed: X (credits: X)
Phase 2 — phones revealed: X (credits: X) [or "skipped — not in phone reveal window"]
Companies skipped: X (reasons)
Stage 2 verified this run: X (REVEAL: X | SKIP: X | MANUAL CHECK: X)
Credit cycle: X / 2,600 used | X remaining | X days left in cycle
Pacing: on track / ahead / behind (vs. even daily spend)
Pending reveals remaining: X
New learnings added: X
Pipeline status: CONTINUING / PAUSED (credit cap) / ACCELERATING (use-it-or-lose-it) / COMPLETE (all companies processed)
Next batch starts from: [company name or "pending reveals" or "phone reveals"]
```

---

## Apollo Reveal Procedure (Email)

For each company being revealed:

1. **Navigate** to: `https://app.apollo.io/#/people?qOrganizationName=URL_ENCODED_NAME&contactLocations=United%20States`. Wait 3 seconds.

2. **Read contacts** via JS (run TWICE with 2-second gap — page needs render time):
   ```js
   const emailCells = document.querySelectorAll('[data-tour-id^="email-cell"]');
   const results = Array.from(emailCells).map((cell, i) => {
     const row = cell.closest('tr, [role="row"], li, [class*="row"]');
     const text = row ? row.innerText.slice(0, 120) : 'no row';
     return '['+i+'] '+cell.getAttribute('data-tour-id')+' | '+text.replace(/\n/g,' ');
   });
   'cells:'+emailCells.length+'\n'+results.join('\n');
   ```

3. **Identify decision-maker** by rank: Owner > Founder > President > CEO > Managing Partner > GM > Director > VP > Manager.

4. **Click email cell** (1 credit) — full event dispatch:
   ```js
   const cells = document.querySelectorAll('[data-tour-id^="email-cell"]');
   const cell = cells[N];
   const rect = cell.getBoundingClientRect();
   const cx = rect.left + rect.width/2;
   const cy = rect.top + rect.height/2;
   cell.scrollIntoView({block:'center'});
   ['mousedown','mouseup','click'].forEach(type => {
     cell.dispatchEvent(new MouseEvent(type, {bubbles:true, clientX:cx, clientY:cy}));
   });
   ```
   Wait 5–7 seconds. Some reveals show "Trying other sources..." and need extra time.

5. **Read revealed email** using NAME-BASED search (row index shifts after click):
   ```js
   const cells = document.querySelectorAll('[data-tour-id^="email-cell"]');
   let targetIdx = -1;
   Array.from(cells).forEach((c,i) => {
     const row = c.closest('tr,[role="row"],li,[class*="row"]');
     if(row && row.innerText.includes('PERSON_NAME')) targetIdx=i;
   });
   const row = cells[targetIdx]?.closest('tr,[role="row"],li,[class*="row"]');
   row ? row.innerText : 'not found';
   ```

6. **Grab HQ phone for free.** Read company page text or sidebar for a phone number — costs 0 credits. Log alongside the email.

7. **Append to `stage3_results.csv` immediately.**

**Skip reasons (record in CSV, no credit cost):**
- Company not found in Apollo → `NO_CONTACTS`
- No decision-maker present → `NO_CONTACTS`
- All contacts show red X email → `NO_EMAIL`
- Multiple ambiguous matches → note "Multiple matches"

**Generic-name tip:** for companies like "Thrive Homes", append "LLC" or "Inc" to search to filter out international results.

---

## Apollo Navigation — Hard Constraints

These are hard-won rules. Each one came from a previous failed run. **Do not deviate.**

| ❌ Never | ✅ Use Instead |
|---------|---------------|
| The `find` tool in Apollo (always times out) | `javascript_tool` with `data-tour-id` selectors |
| `/api/v1/organizations/search` (returns stale IDs starting with `54...`) | URL-based people search with `qOrganizationName=` |
| `get_page_text` to read contacts | `javascript_tool` with `data-tour-id` approach |
| Screenshots to read emails | JavaScript reads |
| Browser address bar typing | `navigate` tool |
| `organizationLocations[]=` (array brackets cause "Array passed for String field" error) | `contactLocations=United%20States` |
| The saved list ID `69bc42035b6cbc00157d9287` (it's the food & bev list — wrong for Tier 1) | General people search URL pattern above |

---

## State File Schemas

**`nightly-run-state.json` — minimum fields:**
```json
{
  "last_updated": "2026-04-22",
  "daily_runs": { "date": "2026-04-22", "count": 0 },
  "credit_cycle": {
    "cycle_start": "2026-04-02",
    "cycle_end": "2026-05-01",
    "email_credits_spent": 0,
    "phone_credits_spent": 0,
    "enrichment_credits_wasted": 0,
    "total_credits_spent": 0
  },
  "stage2": { "total_verified": 0, "next_batch_number": 1 },
  "stage3": {
    "total_revealed_to_date": 0,
    "total_credits_spent_to_date": 0,
    "pending_reveals": { "batch1_pending": [], "batch2_pending": [] }
  }
}
```

**`pipeline-learnings.json` — learning entry:**
```json
{
  "date": "2026-04-22",
  "category": "apollo_reveal",
  "severity": "high",
  "summary": "Email cell click via cell.click() doesn't register reliably; use full mousedown/mouseup/click event dispatch with bounding-rect coordinates."
}
```

---

## When to Stop and Escalate

Stop the run and surface to Edward when:

- Apollo shows a **billing / upgrade / credit-limit modal** — never retry, just stop
- Chrome **disconnects more than twice** in the same run (transient one-offs are fine — wait 5s and retry)
- A reveal click fails three times for the same company even with the computer-tool fallback
- Stage 2 verification produces an unfamiliar pattern not covered by OPEN/CLOSED/UNVERIFIED rules
- Apollo's people-search URL pattern returns 0 cells where you expect contacts (could mean URL schema change — high-severity learning)
- Anything ambiguous. Surfacing costs nothing. Guessing wrong on credit handling can cost hundreds of dollars.

---

## When the Master List Is Done

If all 1,495 Tier 1 companies have been through Stage 2, the pipeline transitions to **phone-reveals-only mode** until either credits run out or the cycle resets. At that point, also surface to Edward — it's likely time to either pull the next Apollo export or begin Tier 2 processing.
