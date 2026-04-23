# Nightly Scoring + Drafting Pipeline — Runbook

**Primary reader:** Claude (Cowork scheduled-task agent).
**Secondary reader:** Edward.

This file is the source of truth for the **scoring + email drafting** half of the nightly outreach pipeline (Stages 4–5). The scheduled task prompt is intentionally thin and delegates here. When scoring criteria evolve, when a new escalation trigger emerges, when a new Gmail-drafting workaround is found — edit this file, push, and the next run picks it up.

This runbook covers **orchestration and operational mechanics only**. For the underlying scoring rubric, segment definitions, industry multipliers, carrier routing table, and email tone rules, see `INSTRUCTIONS-stage4-7.md` and `INSTRUCTIONS-v5.md`. The upstream **Apollo reveals** half of the pipeline (Stages 1–3) is covered by `nightly-apollo-reveals.md`.

There is also a **parallel daytime drafting flow** owned by Alice (`../email-drafting-workflow.md`) that drafts from `alice@anvo-insurance.com`. Both flows share the same `stage5_outreach_log.csv` and gate on empty `draft_status` to avoid collisions. This runbook always sets `drafted_by=edward`.

---

## Purpose

Once per night, after the Apollo reveals task has finished its batches, take any newly revealed contacts in `stage3_results.csv` and:

1. **Stage 4** — score them against Anvo's fit criteria, recommend a starting carrier, write an opening angle, and append to `stage4_scored.csv`.
2. **Stage 5** — for HIGH and MEDIUM contacts that don't yet have a draft, do deep research, draft a personalized cold email from `edward@anvoins.com`, create a Gmail draft (never send), and append to `stage5_outreach_log.csv` with `draft_status=DRAFTED` and `drafted_by=edward`.
3. Update the shared `nightly-run-state.json` (`stage4` and `stage5` keys only), append any new learnings, output a summary.

Designed to be safe to interrupt — state files reflect only what's fully written, the next run picks up where the last left off.

---

## Source-of-Truth Files

All paths are relative to the `anvo-brain` repo root.

| Path | Role | Read/Write |
|------|------|------------|
| `outreach/instructions/nightly-scoring-drafting.md` | This file — orchestration mechanics for Stages 4–5 | Read at start |
| `outreach/instructions/INSTRUCTIONS-v5.md` | Industry multipliers, carrier routing table, segment definitions | Read at start |
| `outreach/instructions/INSTRUCTIONS-stage4-7.md` | Detailed Stage 4 scoring rubric, email tone and structure rules, default voice profile | Read at start |
| `outreach/reports/nightly-run-state.json` | Pipeline state — share with apollo-reveals task. Read `stage4` + `stage5` keys, write only those keys | Read at start, write at end |
| `outreach/reports/pipeline-learnings.json` | Accumulated workarounds (shared with apollo-reveals task) | Read at start, append on new findings |
| `outreach/reports/stage3_results.csv` | Ground truth — every revealed contact with email and phone | Read only |
| `outreach/reports/stage4_scored.csv` | Already-scored contacts. Append new rows | Read at start, append at end |
| `outreach/reports/stage5_outreach_log.csv` | Already-drafted emails, both flows. Append new rows | Read at start, append at end |
| `outreach/templates.md` | Email templates with selection logic | Read at start |
| Google Drive: "Anvo Prospecting Style Guide (AI-Generated)" | Edward's voice profile. Optional — fall back to defaults if missing | Read at start |

---

## Guardrails (Never Cross)

- **Never send an email.** Every email becomes a Gmail draft via the `create_draft` tool. Sending is always Alice's manual step.
- **Never quote a premium or promise savings** in an email. Carriers and pricing belong in conversation, not cold outreach.
- **Never name a specific carrier** in a cold email body or subject line.
- **Never draft for SKIP priority rows.** Ever.
- **Never re-draft a row** where `draft_status` is already `DRAFTED` (regardless of whether `drafted_by` is alice or edward).
- **Never re-score a contact** that's already in `stage4_scored.csv` (match on email).
- **Never reveal new contacts** in Apollo from this task. Reveals are the apollo-reveals task's job. If a contact you'd like to score has no email, mark `priority=SKIP` and move on.
- **Never write to the `stage2`, `stage3`, `credit_cycle`, or `daily_runs` keys of `nightly-run-state.json`** — those belong to the apollo-reveals task. Only write `stage4` and `stage5`.
- **Never bind coverage, submit applications, or take any write action against carrier portals or Anvo's Google services beyond Gmail draft creation.**
- **If a row's `notes` contain `RED FLAG`, `DATA QUALITY ISSUE`, or `FLAGGED`,** skip drafting and set `draft_status=SKIPPED_DATA_ISSUE`.

---

## Capability Boundary

- This task runs in Cowork with web search + Gmail MCP available. Chrome being open is **not** a hard requirement (no Apollo work happens here).
- The agent cannot send email — only draft. The Gmail connector is bound to `edward@anvoins.com` (the secondary cold-outreach domain).
- Gmail drafts created here land in Edward's "Drafts" folder. Alice and Edward both have visibility; the human review/send step happens out-of-band.
- File reads/writes against the repo are direct (mounted folder access). State and learnings files are versioned — every run that mutates them produces a commit (the scheduled task prompt handles git push).
- Web research happens via WebSearch / WebFetch with normal rate limits; respect 2-5s pacing per the Universal Instructions.

---

## Run Lifecycle

```
0.   Read state + learnings + INSTRUCTIONS files + style guide
1.   Stage 4 — score any unscored contacts
2.   Stage 5 — draft emails for HIGH/MEDIUM contacts without drafts
3.   Update state file + append learnings
4.   Output summary
```

Hard caps per run:
- **Scoring:** no per-run cap — work through every unscored REVEALED contact (typically <30 per night)
- **Drafting:** **max 15 drafts per run** (rate-limit Gmail API + keep research depth high)
- **Web research:** 2-5s pacing between fetches per Universal Instructions

---

### Step 0 — Read State, Learnings, and Voice Profile

Read in order:

1. `outreach/reports/nightly-run-state.json` — note `stage4.last_processed_email` and `stage5.last_drafted_email` for resume hints.
2. `outreach/reports/pipeline-learnings.json` — read every learning in categories `stage4_scoring`, `stage5_drafting`, `web_research`, `gmail_drafting`. Apply them.
3. `outreach/instructions/INSTRUCTIONS-v5.md` — segment definitions, industry multipliers, carrier routing table.
4. `outreach/instructions/INSTRUCTIONS-stage4-7.md` — Stage 4 rubric, Stage 5 email rules.
5. `outreach/templates.md` — selectable email templates and selection logic.
6. **Google Drive search** for `"Anvo Prospecting Style Guide (AI-Generated)"`. If found, read it and apply Edward's voice profile to all email drafts. If not found, fall back to the default tone rules in `INSTRUCTIONS-stage4-7.md` and add a `style_guide_missing` learning at the end of the run (severity: low, info-level).

---

### Step 1 — Stage 4: Score Unscored Contacts

Diff `stage3_results.csv` against `stage4_scored.csv` (match on `email` column). For every contact in stage3 with a non-empty email that is NOT in stage4, do the following:

1. **Identify segment** from the company's NAICS / Apollo industry / website language. Segments per `INSTRUCTIONS-v5.md`: Construction, Transport/Logistics, Manufacturing, Hospitality, Professional Services, Retail/Wholesale, Other.

2. **Web research** (WebSearch + WebFetch, pacing 2-5s):
   - Company website (About, Services, Locations pages)
   - BBB profile if commercial
   - Google Maps / Yelp for hours, reviews, photos (signals on size and operations)
   - Recent local press if any
   - Any obvious red flags: closed, acquired, lawsuit, regulatory action

3. **Estimate actual staff** = `apollo_employees × industry_multiplier` (multiplier table in `INSTRUCTIONS-v5.md`).

4. **Score 1–5 on four dimensions** using the rubric in `INSTRUCTIONS-stage4-7.md`:
   - Premium Potential (40% weight)
   - Anvo Fit (25%)
   - Accessibility (20%)
   - Underserved Likelihood (15%)

5. **Compute `overall_score`** = weighted sum, then assign:
   - `priority=HIGH` if `overall_score >= 4.0`
   - `priority=MEDIUM` if `3.0 <= overall_score < 4.0`
   - `priority=LOW` if `2.0 <= overall_score < 3.0`
   - `priority=SKIP` if `overall_score < 2.0`

6. **Recommend a starting carrier** using the Carrier Routing Table in `INSTRUCTIONS-v5.md`. Note in `notes` if multiple carriers fit.

7. **Write a one-sentence `opening_angle`** — a specific observation or hook for outreach (NOT a generic compliment).

8. **Flag in `notes`** any of:
   - Segment mismatch (Apollo segment vs. actual operations)
   - Recent acquisition / parent company is Fortune 500 → mark `SKIP` (insurance handled at corporate)
   - Too large for sweet spot (> ~200 employees OR > ~$50M revenue) → `SKIP`
   - Duplicate company in stage3 → score the first occurrence only, mark others `SKIP` with note `DUPLICATE`
   - EMCOR / Ali Group / known F500 subsidiaries → `SKIP`

9. **Append to `stage4_scored.csv`** with columns:
   ```
   rank,priority,overall_score,tier,company,contact,title,email,phone,city,state,segment,apollo_employees,multiplier,est_actual_staff,premium_potential,anvo_fit,accessibility,underserved,coverage_needs,carrier,opening_angle,notes
   ```

Write atomically — append one row at a time. If the run is interrupted, partial work is preserved.

---

### Step 2 — Stage 5: Draft Emails for HIGH/MEDIUM

Diff `stage4_scored.csv` (filter `priority IN (HIGH, MEDIUM)`) against `stage5_outreach_log.csv` (match on `email`, regardless of `drafted_by`). For each undrafted HIGH/MEDIUM contact, up to the **15-draft cap**, do:

1. **Deep research** beyond what Stage 4 surfaced:
   - LinkedIn (if accessible) — mutual connections, shared background, recent posts
   - Company website team/about pages — ownership story, founding year, milestones
   - Google reviews — common themes about service quality
   - Local press — recent expansions, awards, hires
   - Industry-specific signals — fleet size for transport, project type for construction, etc.

2. **Synthesize a `research_summary` (1–2 sentences)** capturing the strongest specific hook.

3. **Note any `referral_opportunity`** if a mutual LinkedIn connection or shared affiliation is found. Format: `via <Name>, <relationship>`.

4. **Draft the email** following these rules (full version in `INSTRUCTIONS-stage4-7.md`):
   - **From:** `edward@anvoins.com`
   - **Personalized opener** (1–2 sentences) — specific observation, NOT generic praise
   - **Bridge to insurance** (1 sentence)
   - **Anvo value prop specific to THIS business** (1–2 sentences)
   - **Soft CTA** (1 sentence) — "Would you be open to a 15-minute call?"
   - **Sign-off:** `Edward, Anvo Insurance`
   - **Body:** 4–7 sentences max
   - **Subject line:** 3–7 words, specific to the business
   - **Tone:** friendly, peer-to-peer, no corporate jargon, no exuberance, apply style guide voice if loaded
   - **Never** mention specific carrier names, quote premiums, promise savings

5. **Create the Gmail draft** via the `create_draft` MCP tool. Capture the draft ID in `notes`.

6. **Append to `stage5_outreach_log.csv`** with columns:
   ```
   date,company,contact,title,email,priority,overall_score,segment,research_summary,referral_opportunity,subject_line,draft_status,drafted_by,notes
   ```
   Set `draft_status=DRAFTED` and `drafted_by=edward`.

7. **If research yields nothing usable** (no hook, no specifics), set `draft_status=SKIPPED_NO_HOOK` and continue. Better to skip than send a generic email.

---

### Step 3 — Update State + Append Learnings

Update `outreach/reports/nightly-run-state.json` — only the `stage4`, `stage5`, and `last_updated` keys. Do not touch `stage2`, `stage3`, `credit_cycle`, or `daily_runs` (the apollo-reveals task owns those).

Schemas:

```json
"stage4": {
  "total_scored": 0,
  "high": 0,
  "medium": 0,
  "low": 0,
  "skip": 0,
  "last_processed_email": "owner@example.com",
  "last_run_date": "2026-04-22"
},
"stage5": {
  "total_drafted": 0,
  "drafted_this_run": 0,
  "skipped_no_hook": 0,
  "skipped_data_issue": 0,
  "last_drafted_email": "owner@example.com",
  "last_run_date": "2026-04-22"
}
```

Update `outreach/reports/pipeline-learnings.json`:
- Append any new issue, error, workaround, or observation. Categories used by this task: `stage4_scoring`, `stage5_drafting`, `web_research`, `gmail_drafting`, `style_guide`.
- Severity: `critical`, `high`, `medium`, `low`, `info`.
- Never delete old learnings. If something is now outdated, append a new learning marking it superseded.

---

### Step 4 — Output Summary

Print one block:

```
Stage 4 — scored this run: X (HIGH: X | MEDIUM: X | LOW: X | SKIP: X)
Stage 5 — drafted this run: X (cap hit? Y/N) | skipped no-hook: X | skipped data-issue: X
Top prospects this run:
  - <Company>, <Contact>, <Title> — <one-sentence hook>
  - ...
Red flags surfaced:
  - <Company> — <reason>
  - ...
Companies marked SKIP for size/F500/acquisition: X
Style guide loaded: yes/no
New learnings added: X
Pipeline status: CONTINUING / STAGE5_BACKLOG (more HIGH/MEDIUM than today's cap allows) / CAUGHT_UP
Next run starts from: [email or "caught up"]
```

---

## CSV Schema Notes

- **`stage4_scored.csv`** — append-only. Match on `email` to detect already-scored.
- **`stage5_outreach_log.csv`** — append-only. Match on `email` regardless of `drafted_by`. The `drafted_by` column distinguishes overnight (this task, value: `edward`) from daytime (Alice's flow, value: `alice`). If a row exists with any `drafted_by` value, do not re-draft.

If `stage5_outreach_log.csv` does not yet have a `drafted_by` column when this task runs, add it (set existing rows to `alice` since they came from her flow before this task existed).

---

## When to Stop and Escalate

Stop the run and surface to Edward when:

- Gmail `create_draft` fails three times for the same contact even after a 5s retry
- WebSearch / WebFetch returns block / 429 from a domain you need for research — pause and try later, do not bulk-retry
- The voice profile in Drive returns an error other than "not found" (e.g., permission denied) — surface for Edward to fix permissions
- The same contact is in `stage3_results.csv` more than twice with different emails — surfaces a deduping issue upstream
- A scoring decision is genuinely ambiguous (e.g., a borderline-Fortune-500 subsidiary that's also a clear local operator) — surface, don't guess
- Anything ambiguous. Surfacing costs nothing.

---

## When the Pipeline Is Caught Up

If every REVEALED contact is scored and every HIGH/MEDIUM contact has a draft, output `Pipeline status: CAUGHT_UP` and stop early. The next run will pick up new reveals automatically when the apollo-reveals task produces them.

---

## Notes for Future Maintainers

- **Why this task is separate from the apollo-reveals task:** Apollo work needs Chrome open + Apollo session active and is rate-limited by credits. Scoring + drafting needs WebSearch + Gmail and is rate-limited by Gmail's draft creation API. Keeping them separate means each can fail / pause / retry independently without touching the other's state.
- **Why the `drafted_by` column matters:** Alice's daytime flow drafts from her account; this task drafts from Edward's. If we ever want per-account performance metrics or to filter Alice's review queue to only her drafts (or only Edward's overnight ones), this column is the join key.
- **Why we re-read `INSTRUCTIONS-stage4-7.md` every run instead of caching:** the rubric evolves. Re-reading is cheap and guarantees the latest rules are applied.
- **Email reply addressing:** outreach goes from `edward@anvoins.com` (cold-outreach domain), but replies should be handled from `edward@anvo-insurance.com` (primary domain). This is a Gmail forwarding rule outside this task's scope — flag any inbox monitoring needs to Edward separately.
