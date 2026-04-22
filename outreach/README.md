# Outreach — Folder Router

This folder houses everything related to Anvo's cold outbound: the multi-stage prospecting pipeline that produces qualified contacts, and the email-drafting flow that turns those contacts into Gmail drafts. It is self-contained — an agent working on outreach should only need to read files inside `outreach/`.

There are two distinct workflows here. They share data but have different drivers, schedules, and operational rhythms.

## The Two Workflows

### 1. Prospecting Pipeline (Edward-driven, scheduled task)

Stages 1–7 of the pipeline ingest a vertical (Construction, Logistics, Manufacturing, etc.), filter and score companies, reveal contact details from Apollo, and produce a `stage{N}_outreach_log.csv` ready for drafting. This runs primarily as a continuous nightly batch on Edward's machine (every 45 min, 11pm–3am ET) and occasionally as ad-hoc Cowork runs.

**Start here:**

- `instructions/INSTRUCTIONS-v5.md` — multi-industry pipeline, Stages 1–7, scoring rubrics, verification logic. **Source of truth for stage logic.**
- `instructions/INSTRUCTIONS-stage4-7.md` — detailed Stage 4–7 logic (deeper than v5)
- `instructions/nightly-pipeline.md` — runbook for the continuous nightly batch. **Source of truth for orchestration**, credit budget, Apollo navigation hard rules, and escalation triggers.
- `instructions/scheduled-task-nightly.md` — the trimmed prompt body that the Cowork scheduled task system pastes verbatim. References the runbook above.
- `instructions/COWORK-TASK-PROMPTS.md` — copy-paste prompts for ad-hoc/manual runs (one-off vertical kickoffs, batch verifications, etc.)

### 2. Email Drafting (Alice-driven, ad-hoc)

Once a `stage{N}_outreach_log.csv` exists, Alice's Cowork reads it, picks a template per row, drafts personalized emails into Gmail, and updates `draft_status` back into the CSV. Alice reviews drafts in Gmail before sending.

**Start here:**

- `email-drafting-workflow.md` — the end-to-end drafting flow (Phase 2 of the pipeline)
- `templates.md` — email templates with selection logic

## Reports Folder

`reports/` holds two kinds of files: **state files** that the pipeline mutates, and **batch outputs** that downstream workflows consume.

### State files (mutated by the nightly pipeline)

| File | Purpose | Mutated by |
|------|---------|-----------|
| `nightly-run-state.json` | Current pipeline cursor: monthly credit budget, daily run count, next batch index, current vertical | Nightly pipeline (every run) |
| `pipeline-learnings.json` | Append-only log of failure modes and workarounds discovered at runtime | Nightly pipeline (when a new failure is hit) |
| `stage3_results.csv` | Ground truth: every contact ever revealed from Apollo. Append-only | Nightly pipeline (Stage 3 reveal) |
| `A2-stage1-tier1-scored.csv` | Master Tier 1 prospect list per vertical — the queue Stage 2 verifies against | Pipeline (Stage 1) |
| `A2-stage2-batch{N}-verified.csv` | Per-batch verification output from Stage 2 | Pipeline (each Stage 2 batch) |

### Batch outputs (consumed by email drafting)

| File | Purpose | Consumed by |
|------|---------|-------------|
| `stage{N}_outreach_log.csv` | Final scored, deduped, and email-revealed prospect list. One per outreach batch. | `email-drafting-workflow.md` |

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
| `subject_line` | text | Suggested email subject. Alice's Cowork may use as-is or adjust |
| `draft_status` | status code | Tracks where this prospect is in the drafting flow (see below) |
| `notes` | text | Additional context, flags, or warnings (e.g., data quality issues) |

### Draft Status Values

| Status | Meaning | Who Sets It |
|--------|---------|-------------|
| *(empty)* | Not yet processed | Default |
| `DRAFTED` | Gmail draft created by Alice's Cowork | Alice's Cowork |
| `DRAFTED_NEXT_BATCH` | Hold for next outreach round | Edward |
| `SENT` | Email sent by Alice | Alice (manual) |
| `REPLIED` | Prospect replied | Alice or Edward |
| `SKIPPED_NO_ANGLE` | No compelling outreach angle found | Edward |
| `SKIPPED_GENERIC_EMAIL` | Contact is not decision-maker or email is generic | Edward |
| `SKIPPED_DATA_ISSUE` | Data quality problem — do not outreach until resolved | Edward |

For full processing rules (which rows to draft, ordering, follow-up cadence), see `email-drafting-workflow.md`.

## Git Workflow

- The nightly pipeline commits `reports/` state files automatically at the end of each run.
- Alice's drafting flow commits the updated `stage{N}_outreach_log.csv` after each drafting batch.
- `git pull` before any session that touches outreach files. The pipeline pushes frequently.
- See `CLAUDE.md` (repo root) → "Multi-Session Sync Protocol" for the full sync rules.
