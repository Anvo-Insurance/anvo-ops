# Anvo Insurance — Operational Knowledge Base (`anvo-brain`)

## What This Repo Is

This is Anvo Insurance's shared operational knowledge base. It contains structured, machine-readable instructions that govern how Anvo operates — from carrier appetite and submission workflows to intake processing, commissions reporting, cold outreach, and strategic business analysis.

Every file in this repo is written for **Claude Cowork agents as the primary reader**, with human team members as secondary readers. Instructions are explicit, unambiguous, and actionable. There is no prose for prose's sake.

## Who Uses This Repo

| User | Role | How They Use It |
|------|------|-----------------|
| Edward Hsyeh | Managing Partner | Authors and maintains operational instructions. Final authority on all content. |
| Alice | Operations | References for day-to-day processing. Contributes updates from carrier interactions. |
| Claude Cowork Agents | Automated processing | Reads files as operational instructions to execute tasks (intake, submissions, follow-ups, commissions, outreach). |

## First-Time Setup

**If you are Alice (or any non-technical user setting up on macOS):** open `ALICE_START_HERE.md`. It's a one-page guide that tells you exactly what to do — no shell commands, no credentials handling on your end. Claude Cowork drives the setup for you.

**If you are setting up on Windows (Edward, or any future Windows user):** follow `SETUP_WINDOWS.md` — a manual walkthrough using PowerShell.

**If you are a Cowork agent being asked to set up the repo on someone's Mac:** read `SETUP_MAC.md`. That file is a runbook written for you (Claude) to execute, with explicit narration scripts for talking to the human user.

All three files cover the same end state: cloned repo, `~/.anvo-secrets/` folder populated with the OAuth credentials, `ANVO_SECRETS_DIR` env var set, and a verified Sheets/Drive/Gmail read.

## How to Use This Repo

### For Humans
1. **Before every Cowork session:** `git pull` to ensure agents read the latest instructions.
2. **After editing any file:** `git push` so changes propagate to all sessions.
3. **When writing or editing:** Write as if you are giving instructions to a new employee who is extremely literal. State what to do, when to do it, and what exceptions exist.

### For Claude Agents
1. **Read before acting.** When a task references a business function (e.g., "submit this risk"), locate and read the relevant instruction file before executing.
2. **Follow decision criteria exactly.** If a file says "escalate to Edward if X," do that — do not improvise.
3. **Cross-reference.** Files reference each other. Follow those references to get full context.
4. **Flag gaps.** If an instruction file has `<!-- TODO -->` markers or missing information that blocks execution, stop and alert Edward.

## Folder Conventions

Top-level folders map to **business functions**. Subfolders map to **sub-concerns** within that function.

```
anvo-brain/
├── README.md                  ← You are here
├── CLAUDE.md                  ← Repo-wide operating manual for Claude agents
├── SETUP_MAC.md               ← First-time setup on macOS
├── SETUP_WINDOWS.md           ← First-time setup on Windows
├── .mcp.json                  ← MCP server config (uses ${ANVO_SECRETS_DIR})
│
├── carriers/                  ← Carrier appetite, submission preferences, market intel
│   ├── carrier_matrix.md
│   ├── submission_preferences.md
│   └── market_notes/
├── intake/                    ← Email intake processing, checklists, account setup
│   ├── instructions.md
│   ├── email_accounts/
│   └── checklists/
├── workflows/                 ← Cross-cutting end-to-end business processes
│   ├── new_submission.md
│   ├── bor_process.md
│   └── renewal_timeline.md
├── commissions/               ← Monthly commission & bonus reporting (self-contained)
│   ├── workflow.md
│   ├── sheet_schema.md
│   ├── carrier_reference.md
│   └── scripts/               ← Google Apps Scripts for auto-ingestion
├── outreach/                  ← Cold email outreach + prospecting pipeline (self-contained)
│   ├── README.md                       ← Folder router — start here
│   ├── email-drafting-workflow.md      ← Alice's Phase 2 drafting flow
│   ├── templates.md                    ← Email templates with selection logic
│   ├── instructions/                   ← Source-of-truth instruction sets
│   │   ├── INSTRUCTIONS-v5.md          ← Multi-industry pipeline (Stages 1–7)
│   │   ├── INSTRUCTIONS-stage4-7.md    ← Detailed Stage 4–7 logic
│   │   ├── COWORK-TASK-PROMPTS.md      ← Copy-paste prompts for ad-hoc runs
│   │   ├── nightly-pipeline.md         ← Runbook for the continuous nightly batch
│   │   └── scheduled-task-nightly.md   ← Trimmed prompt body for the scheduler
│   └── reports/                        ← State files + generated batch outputs
│       ├── nightly-run-state.json      ← Pipeline state (mutated each run)
│       ├── pipeline-learnings.json     ← Accumulated workarounds (append-only)
│       ├── stage3_results.csv          ← Ground truth: every revealed contact
│       └── stage{N}_outreach_log.csv   ← Outputs ready for Alice's drafting flow
├── intercom/                  ← Intercom setup, workflows, message templates
│   ├── setup_notes.md
│   ├── workflows/
│   └── templates/
├── business/                  ← Strategic analyses, audits, internal briefs
│   ├── audits/
│   └── strategy/
├── marketing/                 ← SEO/AEO project plans, content briefs
│   └── seo-aeo/
├── accounts/                  ← Active account notes and tracking
│   └── active_notes.md
└── templates/                 ← Reusable email and document templates (cross-workflow)
    └── client_welcome_email.md
```

## File Authoring Rules

1. **Every file is an instruction set.** Not a wiki article. Not a reference doc. An instruction set.
2. **Use `<!-- TODO: Edward to fill in -->` markers** for content that needs human input.
3. **Cross-reference with relative paths** (e.g., "See `carriers/carrier_matrix.md`").
4. **Formatting:** H1 = file title, H2 = major sections, H3 = subsections. No deeper nesting.
5. **No fluff.** Every line is either an instruction, a decision criterion, or a data field.
6. **Date format:** YYYY-MM-DD everywhere.
7. **When in doubt, be more explicit.** Over-specification is better than ambiguity.

## Secrets & Credentials

**Never commit credential files into this repo.** All `.json` keys, OAuth tokens, and service account files live in `~/.anvo-secrets/` (macOS) or `%USERPROFILE%\.anvo-secrets\` (Windows), referenced by the `.mcp.json` via the `ANVO_SECRETS_DIR` environment variable. See `SETUP_MAC.md` / `SETUP_WINDOWS.md` for setup details.
