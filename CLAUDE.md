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
├── workflows/             # Cross-cutting process documentation (used by multiple workflows)
│   ├── new_submission.md
│   ├── bor_process.md
│   ├── renewal_timeline.md
│   └── claims_reporting.md
├── commissions/           # Monthly commission & bonus reporting (self-contained)
│   ├── workflow.md        # End-to-end monthly process (collection → processing → report)
│   ├── sheet_schema.md    # Google Sheet structure (tabs, columns, formulas)
│   ├── carrier_reference.md # Per-carrier statement formats and parsing notes
│   └── scripts/           # Google Apps Scripts for auto-ingestion
│       ├── commission_ingestion.js  # Drive folder watcher (CSV/Excel)
│       └── bonus_ingestion.js       # Gmail label scanner (MIAA bonuses)
├── outreach/              # Cold email outreach (self-contained)
│   ├── README.md          # CSV schema, status codes, processing rules
│   ├── workflow.md        # End-to-end outreach process (research → draft → send)
│   ├── templates.md       # Email templates with selection logic
│   └── stage{N}_outreach_log.csv  # Prospect batches (Edward generates, Alice drafts)
├── accounts/              # Running notes on active accounts
│   └── active_notes.md
└── templates/             # Shared templates (used across multiple workflows)
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

### Git Auth From Cowork Sandbox

Each Cowork session uses its own SSH deploy key to push/pull from GitHub. The remote is SSH: `git@github.com:Anvo-Insurance/anvo-ops.git`.

**Alice's session:**
- Key location: `.claude-keys/anvo-ops-deploy` (gitignored via `.claude-keys/` in `.gitignore`)
- The repo's local `core.sshCommand` config points at this key. **However, the Cowork sandbox exports a `GIT_SSH_COMMAND` env var that overrides `core.sshCommand`.** Always prefix network git operations with `unset GIT_SSH_COMMAND &&` so the configured key is picked up. Examples: `unset GIT_SSH_COMMAND && git pull`, `unset GIT_SSH_COMMAND && git push origin main`.
- If `.claude-keys/anvo-ops-deploy` is missing (fresh clone, new workspace, etc.), regenerate with `ssh-keygen -t ed25519 -f .claude-keys/anvo-ops-deploy -N "" -C "claude-cowork-deploy-key@anvo-ops"`, then add the new `.pub` contents to the repo's Deploy keys on GitHub (`Settings → Deploy keys → Add deploy key`) with "Allow write access" checked. Delete the old deploy key on GitHub after.

**Edward's session:**
- Key location: `~/.ssh/id_ed25519` (lives in the sandbox home directory, not in the repo)
- Git picks this up automatically as the default SSH key — no `GIT_SSH_COMMAND` override or `unset` needed. Standard `git pull` and `git push origin main` work directly.
- If the key is missing (new session/sandbox), regenerate with `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "edward-cowork-deploy-key"`, then add the new `.pub` contents to the repo's Deploy keys on GitHub with "Allow write access" checked. Delete the old deploy key on GitHub after.
- **Mounted folder git workaround:** The Cowork sandbox cannot delete `.git` lock files on the mounted folder, which causes git operations to fail and leave stale locks behind. To avoid this, maintain a clean clone at `/tmp/anvo-ops-push` and use it for all git operations:
  - **To commit and push:** Edit files in the mounted folder → copy changed files to `/tmp/anvo-ops-push` → commit and push from there.
  - **To pull latest:** Pull in `/tmp/anvo-ops-push` → copy updated files back to the mounted folder.
  - **Setup (once per session):** `git clone git@github.com:Anvo-Insurance/anvo-ops.git /tmp/anvo-ops-push` then set `git config user.name "Edward Hsyeh"` and `git config user.email "edward@anvo-insurance.com"` in that clone.
  - Never run `git pull`, `git commit`, or `git push` directly in the mounted folder — it will create lock files that require Edward to manually delete from his terminal.

**Both sessions:**
- GitHub allows multiple deploy keys per repo, one per session.
- To revoke access for either session: delete that session's deploy key on GitHub. The private key becomes inert immediately.
- If the remote URL is set to HTTPS instead of SSH, switch it: `git remote set-url origin git@github.com:Anvo-Insurance/anvo-ops.git`

## Working Conventions

- All files written as if Claude is the primary reader. Be explicit, not implicit.
- Commit after each meaningful change with descriptive messages.
- Top-level folders = business functions. Subfolders = sub-concerns.
- Cross-reference other files where relevant rather than duplicating information.

### Self-Contained Workflow Folders

When a workflow has its own data, templates, and instructions, **keep everything in one folder.** The folder should contain:

- `README.md` — what this folder is, schema definitions, processing rules
- `workflow.md` — end-to-end process documentation
- `templates.md` (if applicable) — templates specific to this workflow
- Data files (CSVs, etc.)

**Rule:** If a file is only used by one workflow, it lives in that workflow's folder. If it's used across multiple workflows (e.g., `client_welcome_email.md` is used after any client signs, regardless of source), it stays in the shared `templates/` or `workflows/` folder.

This keeps each workflow self-contained — an agent working on outreach only needs to read `outreach/`, not hunt across three directories. Examples of self-contained folders: `outreach/`, `commissions/`. Examples of shared folders: `templates/`, `workflows/`, `carriers/`.
