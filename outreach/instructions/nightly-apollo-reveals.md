# Nightly Apollo Reveals Pipeline — Runbook

**Primary reader:** Claude (Cowork scheduled-task agent).
**Secondary reader:** Edward.

This file is the source of truth for the **Apollo reveals** half of the nightly outreach pipeline (Stages 1–3: Apollo search, Stage 2 verification, Stage 3 contact reveals). The scheduled task prompt is intentionally thin and delegates here. When Apollo navigation breaks, when a credit-budget rule changes, when a new escalation trigger emerges — edit this file, push, and the next run picks it up.

This runbook covers **orchestration and operational mechanics only**. For stage-by-stage scoring criteria, tier definitions, and pipeline philosophy, see `INSTRUCTIONS-v5.md`. For Stage 4–7 logic, see `INSTRUCTIONS-stage4-7.md`. The downstream **scoring + drafting** half of the pipeline (Stages 4–5) is covered by `nightly-scoring-drafting.md`.

---

## Purpose

Run the Apollo reveals half of the Anvo prospecting pipeline in small batches every 45 minutes between 11pm and 3am ET. Each run advances the pipeline by one batch: clear pending Apollo email reveals, then run Stage 2 verification on the next chunk of the master prospect list, then optionally do Phase 2 phone reveals. Update state files, append learnings, output a summary.

The pipeline is designed to be safe to interrupt at any point. State files reflect only what's fully completed. The next run picks up automatically.

The downstream task (`nightly-scoring-drafting.md`) reads `stage3_results.csv` produced here and turns revealed contacts into scored prospects + Gmail drafts.

---

## Source-of-Truth Files

All paths are relative to the `anvo-brain` repo root.

| Path | Role | Read/Write |
|------|------|------------|
| `outreach/reports/nightly-run-state.json` | Pipeline state — pending reveals, batch counters, credit cycle, daily run count | Read at start, write at end |
| `outreach/reports/pipeline-learnings.json` | Accumulated workarounds and observations from prior runs | Read at start, append on new findings |
| `outreach/instructions/INSTRUCTIONS-v5.md` | Stage-by-stage scoring, verification, and reveal logic | Read at start |
| `outreach/instructions/nightly-apollo-reveals.md` | This file — orchestration mechanics for Stages 1–3 | Read at start |
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
- File reads/writes against the repo are direct (mounted folder access). State and learnings files are versioned.
- **The agent DOES run `git` itself**, but only inside `/tmp/anvo-brain-push` — never against the mounted anvo-brain folder. Canonical pattern: copy the SSH deploy key from `.claude-keys/edward-deploy` into `~/.ssh/id_ed25519` (strip CRLF + add trailing newline or OpenSSH fails with `error in libcrypto`), clone `git@github.com:Anvo-Insurance/anvo-brain.git` into `/tmp/anvo-brain-push`, copy the changed files in from the mount, commit, push. Full procedure in Step 5. If any part of it fails, the run falls back to emitting a paste-ready block (Step 5.5) so Edward can push manually.

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
5.   Commit and push via /tmp clone (fallback: emit paste block for Edward)
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
- **Categories:** `apollo_navigation`, `apollo_reveal`, `phone_reveal`, `company_matching`, `stage2_verification`, `chrome_stability`, `performance`, `credit_management`, `stage4_scoring`, `stage5_drafting`, `web_research`, `gmail_drafting`
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

### Step 5 — Commit and Push via /tmp Clone

Run the commit + push yourself using the `/tmp` clone + SSH deploy key workflow. Canonical pattern, confirmed with Edward 2026-04-23. Never run `git` against the mounted anvo-brain folder directly — the mount is treated as read-only source of truth. All git happens inside `/tmp/anvo-brain-push`.

**Why this is safe from a scheduled task**: the workflow clones anvo-brain into `/tmp` using an SSH deploy key that lives at `.claude-keys/edward-deploy` inside the mounted folder. If any step fails, fall back to emitting a paste-ready block per Step 5.5.

#### Step 5.1 — Install the SSH deploy key

The key at `.claude-keys/edward-deploy` comes off a Windows/OneDrive filesystem with CRLF line endings and often no trailing newline — OpenSSH will fail with `error in libcrypto` on a naïve `cp`. Always strip `\r` and append a trailing `\n`:

```bash
MOUNT=$(ls -d /sessions/*/mnt/anvo-brain 2>/dev/null | head -1)
[ -z "$MOUNT" ] && { echo "ERR: anvo-brain not mounted — fall back to Step 5.5"; exit 1; }

mkdir -p ~/.ssh
tr -d '\r' < "$MOUNT/.claude-keys/edward-deploy" > ~/.ssh/id_ed25519
printf '\n' >> ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null

# Verify — fail fast, don't push if these don't both return cleanly
ssh-keygen -y -f ~/.ssh/id_ed25519 >/dev/null
ssh -T -o StrictHostKeyChecking=no git@github.com 2>&1 | grep -q 'successfully authenticated'
```

If the verification block errors or the grep fails, STOP and go to Step 5.5. Do not try to brute-force a push.

**Shared workspace note**: If the scoring+drafting task has already run and installed the key this session, the key will already be in `~/.ssh/id_ed25519`. It's safe to re-run the install block — `tr` + `printf` + `chmod` are idempotent.

#### Step 5.2 — Clone (or refresh) into /tmp

```bash
if [ -d /tmp/anvo-brain-push/.git ]; then
  cd /tmp/anvo-brain-push && git fetch origin && git reset --hard origin/main && git clean -fd
else
  rm -rf /tmp/anvo-brain-push
  git clone git@github.com:Anvo-Insurance/anvo-brain.git /tmp/anvo-brain-push
fi
cd /tmp/anvo-brain-push
git config user.name "Edward Hsyeh"
git config user.email "edward@anvo-insurance.com"
```

**Coordination with scoring+drafting task**: both tasks share `/tmp/anvo-brain-push`. The `fetch + reset --hard origin/main + clean -fd` pattern is how you pick up the other task's commits if it pushed first. Do not skip the reset — stale working state will cause conflicts.

#### Step 5.3 — Copy only the files this run touched

Typical full set for an apollo-reveals run:

```bash
for f in \
  outreach/reports/nightly-run-state.json \
  outreach/reports/pipeline-learnings.json \
  outreach/reports/stage3_results.csv \
  outreach/reports/A2-stage2-batch<N>-verified.csv; do
  [ -f "$MOUNT/$f" ] && cp "$MOUNT/$f" "/tmp/anvo-brain-push/$f"
done
```

Drop any file this run didn't actually touch:
- `nightly-run-state.json` — always include (timestamp + counters bump every run).
- `pipeline-learnings.json` — drop if no new learnings appended.
- `stage3_results.csv` — drop if no reveals wrote a row this run.
- `A2-stage2-batch<N>-verified.csv` — drop unless a new Stage 2 batch was produced this run; substitute the real batch number for `<N>`.

**Hard rule**: Only touch keys in `nightly-run-state.json` that this task owns — `stage2`, `stage3`, `credit_cycle`, `daily_runs`. Never overwrite `stage4` or `stage5` (the scoring+drafting task owns those).

#### Step 5.4 — Commit and push

```bash
cd /tmp/anvo-brain-push
git add <space-separated list of the files you copied above>
git commit -m "Nightly Apollo reveals: <YYYY-MM-DD> run #<R>

Phase 1: <E> emails revealed (<C> credits)
Phase 2: <P> phones revealed (<PC> credits) [or 'skipped']
Stage 2 batch <N>: <V> verified (REVEAL <r> / SKIP <s> / MANUAL <m>)
Credits remaining: <CR> / 2,600 | <D> days left in cycle
Learnings added: <L>"
git push origin main
SHA=$(git rev-parse HEAD)
echo "pushed $SHA"
```

Fill real counts — never leave `<R>` / `<E>` / `<YYYY-MM-DD>` placeholders. Include the resulting SHA in the Step 4 summary so Edward can verify at a glance.

#### Step 5.5 — Fallback (paste block)

If any part of 5.1–5.4 fails (mount missing, libcrypto error that tr/printf didn't fix, clone fails, push rejected, etc.), stop trying and emit this block instead so Edward can push manually from Claude Code:

```
**Push automation failed this run — paste this into Claude Code to commit manually:**

​```bash
cd C:\Users\ehsye\dev\anvo-brain
git add outreach/reports/nightly-run-state.json outreach/reports/pipeline-learnings.json outreach/reports/stage3_results.csv outreach/reports/A2-stage2-batch<N>-verified.csv
git commit -m "Nightly Apollo reveals: <YYYY-MM-DD> run #<R>

Phase 1: <E> emails revealed (<C> credits)
Phase 2: <P> phones revealed (<PC> credits) [or 'skipped']
Stage 2 batch <N>: <V> verified (REVEAL <r> / SKIP <s> / MANUAL <m>)
Credits remaining: <CR> / 2,600 | <D> days left in cycle
Learnings added: <L>"
git push
​```
```

Same file-inclusion rules as 5.3 apply to the paste-block `git add` line — drop files this run didn't touch. Then append a new learning at `severity=high`, `category=git_push` describing exactly what failed so the next run either fixes it or short-circuits faster.

#### Step 5.6 — Zero-change runs

If the run was stopped early with no mutations (daily cap reached, monthly credit cap reached, Chrome disconnect before first reveal, etc.), skip 5.1–5.5 entirely and report:

```
**Nothing to commit this run — stopped before any state changed.**
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
     if(row && row.in