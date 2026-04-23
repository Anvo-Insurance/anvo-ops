# Outreach — Folder Router

This folder houses everything related to Anvo's cold outbound: the multi-stage prospecting pipeline that produces qualified contacts, and the email-drafting flow that turns those contacts into Gmail drafts. It is self-contained — an agent working on outreach should only need to read files inside `outreach/`.

There are three distinct workflows here. They share data but have different drivers, schedules, and operational rhythms.

## The Three Workflows

### 1. Apollo Reveals — Stages 1–3 (Edward-driven, scheduled task, every 45 min 11pm–3am ET)

Ingests a vertical (Construction, Logistics, Manufacturing, etc.), filters and scores companies in Apollo, verifies them, and reveals contact details. Output: every revealed contact lands in `reports/stage3_results.csv`. Requires Chrome open + Apollo logged in. Rate-limited by Apollo credits (2,600/month).

**Start here:**

- `instructions/INSTRUCTIONS-v5.md` — multi-industry pipeline, Stages 1–7, scoring rubrics, verification logic. **Source of truth for stage logic.**
- `instructions/nightly-apollo-reveals.md` — runbook for the apollo-reveals nightly task. **Source of truth for orchestration**, credit budget, Apollo navigation hard rules, and escalation triggers.
- `instructions/scheduled-task-apollo-reveals.md` — the trimmed prompt body that the Cowork scheduled task system pastes verbatim. References the runbook above.
- `instructions/COWORK-TASK-PROMPTS.md` — copy-paste prompts for ad-hoc/manual runs (one-off vertical kickoffs, batch verifications, etc.)

### 2. Scoring + Drafting — Stages 4–5 (Edward-driven, scheduled task, ~3:30am ET nightly)

Picks up where apollo-reveals leaves off. Scores every newly revealed contact against Anvo's fit rubric, recommends a starting carrier, writes an opening angle, and drafts personalized cold emails for HIGH/MEDIUM contacts as Gmail drafts in `edward@anvoins.com`. Never sends. Output: `reports/stage4_scored.csv` and `reports/stage5_outreach_log.csv` rows with `drafted_by=edward`.

**Start here:**

- `instructions/INSTRUCTIONS-stage4-7.md` — detailed Stage 4 scoring rubric + Stage 5 email tone and structure rules. **Source of truth for scoring + email policy.**
- `instructions/nightly-scoring-drafting.md` — runbook for the scoring + drafting nightly task. **Source of truth for orchestration** of this half of the pipeline.
- `instructions/scheduled-task-scoring-drafting.md` — the trimmed prompt body that the Cowork scheduled task system pastes verbatim.

### 3. Daytime Email Drafting (Alice-driven, ad-hoc)

Runs in parallel with the scoring + drafting nightly task. Alice's Cowork reads `stage{N}_outreach_log.csv`, picks a template per row, drafts personalized emails into Gmail under `alice@anvo-insurance.com`, and updates `draft_status` back into the CSV. Alice reviews drafts in Gmail before sending. Output: stage5 rows with `drafted_by=alice`.

Both flows gate on empty `draft_status` to avoid drafting the same row twice. The `drafted_by` column distinguishes which flow created each draft.

**Start here:**

- `email-drafting-workflow.md` — the end-to-end drafting flow (Phase 2 of the pipeline)
- `templates.md` — email templates with selection logic

## Reports Folder

`reports/` holds two kinds of files: **state files** that the pipeline mutates, and **batch outputs** that downstream workflows consume.

### State files (mutated by the nightly tasks)

| File | Purpose | Mutated by |
|------|---------|-----------|
| `nightly-run-state.json` | Shared pipeline state. Apollo-reveals owns `stage2`, `stage3`, `credit_cycle`, `daily_runs`. Scoring-drafting owns `stage4` and `stage5`. Each task only writes its own keys. | Both nightly tasks |
| `pipeline-learnings.json` | Append-only log of failure modes and workarounds (shared by both nightly tasks; categories distinguish source: `apollo_*`, `stage2_*`, `stage4_*`, `stage5_*`, `web_research`, `gmail_drafting`, etc.) | Both nightly tasks |
| `stage3_results.csv` | Ground truth: every contact ever revealed from Apollo. Append-only | Apollo-reveals (Stage 3) |
| `stage4_scored.csv` | Scored prospects with priority, carrier, opening angle. Append-only | Scoring-drafting (Stage 4) |
| `A2-stage1-tier1-scored.csv` | Master Tier 1 prospect list per vertical — the queue Stage 2 verifies against | Apollo-reveals (Stage 1) |
| `A2-stage2-batch{N}-verified.csv` | Per-batch verification output from Stage 2 | Apollo-reveals (each Stage 2 batch) |

### Batch outputs (consumed by email drafting)

| File | Purpose | Consumed by |
|------|---------|-------------|
| `stage{N}_outreach_log.csv` | Drafted emails — one row per HIGH/MEDIUM contact with a Gmail draft created. Both nightly scoring-drafting (rows with `drafted_by=edward`) and Alice's daytime flow (rows with `drafted_by=alice`) append here. | `email-drafting-workflow.md` (Alice) + `nightly-scoring-drafting.md` (Edward overnight) |

### Naming conventions

- `stage{N}_outreach_log.csv` — `N` increments per outreach batch
- `A2-stage2-batch{N}-verified.csv` — `N` is the batch index inside a single vertical run; `A2` is the vertical/run code
- All dates inside files use `YYYY-MM-DD`

### Write-window warning

The nightly scheduled task is actively writing to `nightly-run-state.json`, `pipeline-learnings.json`, `stage3_results.csv`, and `A2-stage2-batch*-verified.csv` between **11pm and 3am ET on Edward's machine**. Avoid editing those files from another session during this window — let the scheduled task finish a cycle, pull, then edit.

## Outreach Log CSV Schema (consumed by `email-drafting-workflow.md`)

This is the schema for `stage{N}_outreach_log.csv`. It is the handoff format from the prospecting pipeline to the email drafting flow.

| Column | Type | Description |
|--------|------|-------------|
| `date` | YYYY-MM-DD | Date the prospect was researched |
| `company` | text | Full company name |
| `contact` | text | Decision-maker's full name |
| `title` | text | Contact's job title |
| `email` | text | Contact's email address |
| `priority` | HIGH / MEDIUM / LOW / SKIP | Edward's prioritization. SKIP = do not outreach |
| `overall_score` | decimal | Composite score (higher = better fit). Used for ordering within a priority tier |
| `segment` | text | Industry segment (e.g., Construction, Transport/Logistics, Manufacturing) |
| `research_summary` | text | Brief background on the company — use this to personalize the email |
| `referral_opportunity` | YES / NO | Whether there's a warm intro path |
| `subject_line` | text | Suggested email subject. The drafting flow may use as-is or adjust |
| `draft_status` | status code | Tracks where this prospect is in the drafting flow (see below) |
| `drafted_by` | `edward` / `alice` / *(empty)* | Which drafting flow created the draft. Empty until drafted. |
| `notes` | text | Additional context, flags, or warnings (e.g., data quality issues, Gmail draft ID) |

### Draft Status Values

| Status | Meaning | Who Sets It |
|--------|---------|-------------|
| *(empty)* | Not yet processed | Default |
| `DRAFTED` | Gmail draft created (see `drafted_by` for which flow) | Either drafting flow |
| `DRAFTED_NEXT_BATCH` | Hold for next outreach round | Edward |
| `SENT` | Email sent | Alice (manual) |
| `REPLIED` | Prospect replied | Alice or Edward |
| `SKIPPED_NO_HOOK` | Research yielded no specific hook — generic email would be worse than skipping | Either drafting flow |
| `SKIPPED_NO_ANGLE` | No compelling outreach angle found (legacy code; new rows use `SKIPPED_NO_HOOK`) | Edward |
| `SKIPPED_GENERIC_EMAIL` | Contact is not decision-maker or email is generic | Edward |
| `SKIPPED_DATA_ISSUE` | Data quality problem — do not outreach until resolved | Either drafting flow |

### Collision Avoidance

Both drafting flows (Alice's daytime + Edward's overnight scoring-drafting) gate on **empty `draft_status`** before drafting. The `drafted_by` column distinguishes which flow created the draft after the fact (for review/metrics) but is not used for collision prevention. If you ever want to retry a draft, clear both `draft_status` and `drafted_by` first.

For full processing rules (which rows to draft, ordering, follow-up cadence), see `email-drafting-workflow.md`.

## Git Workflow

- The nightly pipeline commits `reports/` state files automatically at the end of each run.
- Alice's drafting flow commits the updated `stage{N}_outreach_log.csv` after each drafting batch.
- `git pull` before any session that touches outreach files. The pipeline pushes frequently.
- See `CLAUDE.md` (repo root) → "Multi-Session Sync Protocol" for the full sync rules.
