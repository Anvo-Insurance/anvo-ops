# Email Drafting Workflow (Alice)

End-to-end process for **drafting cold outreach emails** from a finished prospect CSV produced by the prospecting pipeline. This file covers Alice's drafting flow only.

For the upstream prospecting pipeline (how the CSV is generated — Apollo scoring, verification, contact reveals, contact-level scoring), see `instructions/INSTRUCTIONS-v5.md`. For the nightly automated batch runs, see `instructions/nightly-apollo-reveals.md` (Stages 1–3) and `instructions/nightly-scoring-drafting.md` (Stages 4–5, includes Edward's overnight Gmail drafts from `edward@anvoins.com`).

---

## Overview

```
Prospecting Pipeline                    outreach/                       Alice's Cowork
(Edward's nightly task)                 ──────────                      ──────────────────
Stages 1–4 produce a                →   stage5_outreach_log.csv     →   Read CSV + templates
scored, revealed contact list                                           Draft Gmail emails
                                                                        Update draft_status
                                                                        Commit + push
                                                                        ↓
Alice (human)                       ←   Updated CSV statuses        ←   Gmail Drafts ready
Reviews and sends                                                       for review
```

The drafting workflow takes over once a `stage5_outreach_log.csv` file exists. Everything before that is the prospecting pipeline's responsibility.

---

## Inputs

- A `stage{N}_outreach_log.csv` file in this folder (root of `outreach/`)
- `templates.md` — selectable email templates with selection logic
- `carriers/carrier_matrix.md` — for any carrier-specific personalization

CSV column schema and `draft_status` codes are documented in `outreach/README.md`.

---

## Phase 1: Email Drafting (Alice's Cowork)

**Owner:** Alice's Cowork session.
**Output:** Gmail drafts in Alice's account, CSV with `draft_status` updated.

### Prerequisites

- Alice's Cowork has the `anvo-brain` folder mounted (so it can read CSVs and templates)
- Gmail connector is active (so it can create drafts)
- Alice runs `git pull` at session start to get the latest CSVs

### Steps

1. Run `git pull` to get the latest prospect CSV and any template updates.
2. Read the target CSV from `outreach/`.
3. Read email templates from `outreach/templates.md`.
4. For each row where `priority` is HIGH or MEDIUM AND `draft_status` is empty:
   1. Select the appropriate email template based on `segment` and context from `research_summary`.
   2. Personalize using `company`, `contact`, `title`, `research_summary`, and `subject_line`.
   3. Create a Gmail draft:
      - **To:** the prospect's `email`
      - **From:** `alice@anvo-insurance.com`
      - **Subject:** the `subject_line` from the CSV (adjust for natural phrasing if needed)
      - **Body:** the personalized template
   4. Update `draft_status` to `DRAFTED` and `drafted_by` to `alice` in the CSV.
5. If a row has red flags in `notes` (e.g., `RED FLAG`, `DATA QUALITY ISSUE`, `FLAGGED`), skip it and set `draft_status` to `SKIPPED_DATA_ISSUE`.
6. Commit the updated CSV and push.

### Why the empty-`draft_status` gate matters

Edward's overnight scoring + drafting task (`instructions/nightly-scoring-drafting.md`) writes to the same CSV from `edward@anvoins.com`. Both flows gate on empty `draft_status` so they don't draft the same row twice. If you find a row with `draft_status=DRAFTED` and `drafted_by=edward`, Edward's overnight task already drafted it — leave it alone.

### Hard Rules

- **Never send emails directly.** Only create drafts. Alice reviews and sends manually.
- **Process highest `overall_score` first** within each priority tier.
- **Do not draft emails for SKIP priority rows.** Ever.
- **If `subject_line` is empty,** generate one from `research_summary` and `segment` rather than skipping.

---

## Phase 2: Review & Send (Alice — Manual)

**Owner:** Alice (human). Not automated.

1. Open Gmail and review the drafts created by her Cowork.
2. For each draft:
   - Read the personalized email and verify it sounds natural.
   - Check that prospect details are accurate (right person, right company, no typos).
   - Make any edits needed.
   - Send.
3. After sending, optionally update `draft_status` to `SENT` in the CSV (or her Cowork updates it next session based on Gmail "Sent" folder scan).

---

## Phase 3: Follow-Up (Future)

<!-- TODO: Edward to define follow-up cadence and escalation rules -->

- How many days between initial email and follow-up?
- How many follow-ups before marking a prospect cold?
- Does Edward handle follow-ups, or does Alice's Cowork draft those too?
- What changes in the email template for follow-up #1, #2, #3?

---

## Tracking & Reporting

- Each CSV serves as its own outreach tracker via the `draft_status` column.
- To see overall pipeline status, scan all `stage*_outreach_log.csv` files in `outreach/` and count statuses.
- Edward reviews progress periodically and decides when to generate the next batch (next stage5 file) via the prospecting pipeline.

---

## Cross-References

- **CSV schema and processing rules:** `outreach/README.md`
- **Email templates:** `outreach/templates.md`
- **Upstream prospecting pipeline (Stages 1–7):** `instructions/INSTRUCTIONS-v5.md`
- **Nightly Apollo reveals (Edward's machine, Stages 1–3):** `instructions/nightly-apollo-reveals.md`
- **Nightly scoring + drafting (Edward's machine, Stages 4–5, parallel to this flow):** `instructions/nightly-scoring-drafting.md`
- **Carrier appetite (for targeting alignment):** `../carriers/carrier_matrix.md`
- **Submission workflow (if a prospect converts):** `../workflows/new_submission.md`

---

## Alice's Cowork Setup Requirements

Before this workflow can run, verify:

1. **`anvo-brain` folder is mounted** in Alice's Cowork session — she needs read/write access to `outreach/`.
2. **Gmail connector is active** — required for creating drafts.
3. **Git access** — Alice should be able to `git pull` and `git push` from her Cowork session, OR Edward pushes on her behalf after she updates the CSV (see fallback below).
4. **Session startup:** Alice's Cowork follows the Multi-Session Sync Protocol in the repo-root `CLAUDE.md` — pull latest, read `SESSION_LOG.md`, check for new CSVs.

### If Alice Cannot Push to Git

If Alice's Cowork can't authenticate with GitHub:

- Alice's Cowork updates the CSV locally in the mounted folder.
- Edward runs `git add`, `git commit`, `git push` from his terminal or Cowork session.
- Alice's status updates won't be visible to Edward's Cowork until Edward commits them.
- Workaround: Alice notifies Edward (Intercom, Signal, or text) when she's done processing a batch.
