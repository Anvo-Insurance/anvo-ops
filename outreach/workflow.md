# Cold Outreach Workflow

End-to-end process for prospecting and cold email outreach. This workflow spans two Cowork sessions (Edward's and Alice's) and uses the shared `anvo-ops` repo as the coordination layer.

**Everything for this workflow lives in `outreach/`** — CSVs, templates, instructions. No need to look elsewhere unless cross-referencing carrier data or the submission workflow for converted leads.

## Overview

```
Edward's Cowork          outreach/ folder           Alice's Cowork
─────────────────       ──────────────────         ──────────────────
Research prospects  →   CSV (stage{N}_.csv)    →   Read CSV + templates
Score & prioritize  →   templates.md           →   Draft Gmail emails
Set subject lines   →   workflow.md (this file)→   Update draft_status
Commit + push           ← Pull latest              Commit + push
                        ← Updated CSV statuses
```

## Phase 1: Prospect Research (Edward's Cowork)

**Owner:** Edward's Cowork session
**Input:** Apollo lists, manual research, referral leads
**Output:** Prospect CSV committed to `outreach/`

### Steps

1. Source prospects from Apollo, industry directories, referral networks, or manual research.
2. For each prospect, research the company and decision-maker. Write a `research_summary` that Alice's Cowork can use to personalize the email.
3. Score each prospect (`overall_score`) based on:
   - Fit with Anvo's specialties (see `carriers/carrier_matrix.md` for appetite alignment)
   - Company size and complexity (more lines of business = more revenue potential)
   - Decision-maker accessibility (owner/president > VP > director)
   - Data quality and confidence level
4. Assign `priority` (HIGH / MEDIUM / LOW / SKIP) and `segment`.
5. Write a suggested `subject_line` — short, personalized, no generic "insurance" pitches.
6. Flag any data quality issues or red flags in `notes`.
7. Set `draft_status` for any rows that should be skipped (SKIPPED_NO_ANGLE, etc.).
8. Save as `outreach/stage{N}_outreach_log.csv` and commit + push.

### Naming Convention

Increment the stage number for each new batch: `stage1_outreach_log.csv`, `stage2_outreach_log.csv`, etc.

## Phase 2: Email Drafting (Alice's Cowork)

**Owner:** Alice's Cowork session
**Input:** Prospect CSV from this folder, email templates from `outreach/templates.md`
**Output:** Gmail drafts ready for Alice to review and send

### Prerequisites

- Alice's Cowork must have the `anvo-ops` folder mounted (so it can read CSVs and templates)
- Alice's Cowork must have the Gmail connector active (so it can create drafts)
- Alice runs `git pull` at the start of each session to get the latest CSVs

### Steps

1. Run `git pull` to get latest prospect CSVs and templates.
2. Read the target CSV from `outreach/`.
3. Read email templates from `outreach/templates.md`.
4. For each row where `priority` is HIGH or MEDIUM and `draft_status` is empty:
   a. Select the appropriate email template based on `segment` and context.
   b. Personalize the email using `company`, `contact`, `title`, `research_summary`, and `subject_line`.
   c. Create a Gmail draft with:
      - **To:** the prospect's `email`
      - **From:** alice@anvo-insurance.com
      - **Subject:** the `subject_line` from the CSV (adjust if needed for natural phrasing)
      - **Body:** personalized template
   d. Update `draft_status` to `DRAFTED` in the CSV.
5. If a row has red flags in `notes` (look for "RED FLAG", "DATA QUALITY ISSUE", "FLAGGED"), skip it and set `draft_status` to `SKIPPED_DATA_ISSUE`.
6. Commit the updated CSV and push.

### Important Rules

- **Never send emails directly.** Only create Gmail drafts. Alice reviews and sends manually.
- **Process highest `overall_score` first** within each priority tier.
- **Do not draft emails for SKIP priority rows** — ever.
- **If `subject_line` is empty**, generate one based on the research summary and segment.

## Phase 3: Review & Send (Alice — Manual)

**Owner:** Alice (human)
**Not automated — Alice does this herself.**

1. Open Gmail and review the drafts created by her Cowork.
2. For each draft:
   - Read the personalized email and verify it sounds natural.
   - Check that the prospect details are accurate.
   - Make any edits needed.
   - Send.
3. After sending, Alice can optionally update `draft_status` to `SENT` in the CSV (or her Cowork can do this in the next session).

## Phase 4: Follow-Up (Future)

<!-- TODO: Edward to define follow-up cadence and escalation rules -->
- How many days between initial email and follow-up?
- How many follow-ups before marking a prospect cold?
- Does Edward handle follow-ups, or does Alice's Cowork draft those too?
- What changes in the email template for follow-up #1, #2, #3?

## Tracking & Reporting

- Each CSV serves as its own outreach tracker via the `draft_status` column.
- To see overall pipeline status, scan all CSVs in `outreach/` and count statuses.
- Edward reviews pipeline progress periodically and decides when to generate the next batch.

## Cross-References

- **CSV schema and processing rules:** `outreach/README.md`
- **Email templates:** `outreach/templates.md`
- **Carrier appetite (for targeting alignment):** `carriers/carrier_matrix.md`
- **Submission workflow (if prospect converts):** `workflows/new_submission.md`

## Alice's Cowork Setup Requirements

Before Alice can run this workflow, verify:

1. **anvo-ops folder is mounted** in her Cowork session — she needs read/write access to `outreach/`
2. **Gmail connector is active** — required for creating drafts
3. **Git access** — Alice needs to be able to run `git pull` and `git push` from her Cowork session, OR Edward pulls/pushes on her behalf after she updates the CSV
4. **Session startup:** Alice's Cowork should follow the Multi-Session Sync Protocol in `CLAUDE.md` — pull latest, read SESSION_LOG.md, check for new CSVs

### If Alice Cannot Push to Git

If Alice's Cowork can't authenticate with GitHub (same limitation as Edward's sandbox):
- Alice's Cowork updates the CSV locally in the mounted folder
- Edward runs `git add`, `git commit`, `git push` from his terminal or Cowork session
- This means Alice's status updates won't be visible to Edward's Cowork until Edward commits them
- Workaround: Alice notifies Edward (via Intercom or text) when she's done processing a batch
