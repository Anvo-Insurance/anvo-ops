# CLAUDE.md — Anvo Ops Knowledge Base

## What This Repo Is

Centralized, version-controlled operational knowledge base for Anvo Insurance. Every file is written for Claude as the primary reader — explicit, unambiguous, operational. Claude reads; humans commit. Claude Code handles Git operations.

**Users:** Edward (Managing Partner), Alice (Operations Manager, Edward's sister), Ling (future sub-producer, studying for P&C license).

## Repo Structure

```
anvo-ops/
├── carriers/              # Carrier appetite, submission preferences, market intel
│   ├── carrier_matrix.md
│   ├── submission_preferences.md
│   └── market_notes/      # Timestamped intel from underwriter calls/emails
│       └── YYYY-MM-DD_carrier_topic.md
├── intercom/              # Intercom automation, templates, integration notes
│   ├── setup_notes.md     # EZLynx→Intercom pipeline (Google Apps Script webhooks)
│   ├── workflows/
│   └── templates/
├── intake/                # Email processing, intake checklists, routing rules
│   ├── instructions.md    # Universal intake instruction set
│   ├── email_accounts/    # Per-inbox handling rules
│   └── checklists/        # By line of business (commercial_auto, bop, workers_comp)
├── workflows/             # End-to-end process documentation
│   ├── new_submission.md
│   ├── bor_process.md
│   ├── renewal_timeline.md
│   └── claims_reporting.md
├── commissions/           # Monthly commission & bonus reporting system
│   ├── workflow.md        # End-to-end monthly process (collection → processing → report)
│   ├── sheet_schema.md    # Google Sheet structure (tabs, columns, formulas)
│   ├── carrier_reference.md # Per-carrier statement formats and parsing notes
│   └── scripts/           # Google Apps Scripts for auto-ingestion
│       ├── commission_ingestion.js  # Drive folder watcher (CSV/Excel)
│       └── bonus_ingestion.js       # Gmail label scanner (MIAA bonuses)
├── accounts/              # Running notes on active accounts
│   └── active_notes.md
└── templates/             # Reusable email/letter templates
    ├── client_welcome_email.md
    └── acord_cover_letter.md
```

## Key Business Context

- **Agency:** Bao's Insurance LLC dba Anvo Insurance
- **Ownership:** Edward 70%, Alice 20%, Yalu 10% (Yalu transitioning to commission-only contractor)
- **Specialties:** Food distribution, restaurants, hotels/hospitality, commercial auto/trucking, nail salons/day spas, tech/SaaS
- **~200 accounts**
- **Agency management system:** EZLynx ($280/month, contract through Dec 2027)
- **Customer platform:** Intercom (synced with EZLynx via Google Apps Script webhooks, ~100 contacts with policy data)
- **Aggregator memberships:** SIAA, MIAA

## How to Use This Repo

### Reading files
All files are Markdown. Read them as operational instructions — they tell you what to do, when, and how. Cross-references between files are explicit (e.g., "See carriers/carrier_matrix.md for appetite details").

### Editing files
- Make edits directly in the working copy.
- Use `<!-- TODO: Edward to fill in -->` markers for content that needs human input.
- Keep formatting consistent: H1 for file title, H2 for major sections, H3 for subsections.
- No fluff. Every line should be an instruction, a decision criterion, or a data field.

### Market notes convention
Each note in `carriers/market_notes/` is a dated file: `YYYY-MM-DD_carrier_topic.md`. Include: date, source (who told us), carrier, key takeaway, and whether it affects the carrier matrix.

## Compensation Structure (Reference)

- **Alice:** Salary + role-based structure (operations manager)
- **Yalu:** Commission-only contractor (transitioning)
- **Ling:** Hourly admin while unlicensed → milestone bonuses for licensing → commission splits after licensed

## Multi-Session Sync Protocol

This repo is shared across multiple Claude Cowork sessions — Edward and Alice each have their own session, both working against the same repo.

### On Startup (Every Session)
1. Run `git pull` to get the latest changes.
2. Read `SESSION_LOG.md` — most recent entry first. This tells you what the other session did last.
3. Read `HANDOFF.md` if it exists — it may contain in-progress work or urgent context from the last session.
4. Run `git log --oneline -5` to see recent commits.
5. Check which files have `<!-- TODO -->` markers — those need attention.

### Before Ending a Session
1. Update `SESSION_LOG.md` with a new entry (most recent first). Include: what you worked on, key decisions, files changed, remaining TODOs, what to pick up next.
2. If there's in-progress work the next session should know about immediately, write a `HANDOFF.md`.
3. Commit all changes with descriptive messages.
4. Push to `origin/main` so the other session can pull the latest.

### Avoiding Conflicts
- **Edward's session** primarily handles: carrier strategy, workflow design, escalations, repo structure changes.
- **Alice's session** primarily handles: intake processing, certificate issuance, day-to-day operations, client communications.
- If both sessions need to edit the same file, one should push before the other pulls. Do not edit the same file simultaneously.
- If a git lock file error occurs (`.git/index.lock` or `.git/HEAD.lock`), the human must delete it manually from their machine before git operations will work.

## Working Conventions

- All files written as if Claude is the primary reader. Be explicit, not implicit.
- Commit after each meaningful change with descriptive messages.
- Top-level folders = business functions. Subfolders = sub-concerns.
- Cross-reference other files where relevant rather than duplicating information.
