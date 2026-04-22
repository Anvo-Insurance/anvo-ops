# CLAUDE.md — Anvo Ops Knowledge Base

## What This Repo Is

Centralized, version-controlled operational knowledge base for Anvo Insurance. Every file is written for Claude as the primary reader — explicit, unambiguous, operational. Claude reads; humans commit. Claude Code handles Git operations.

**Users:** Edward (Managing Partner), Alice (Operations Manager, Edward's sister), Ling (future sub-producer, studying for P&C license).

**Repo name:** `anvo-brain` on GitHub (`github.com/Anvo-Insurance/anvo-brain`). Locally clones to `~/dev/anvo-brain` (Mac) or `C:\Users\<you>\dev\anvo-brain` (Windows). First-time setup is documented in `SETUP_MAC.md` and `SETUP_WINDOWS.md` at the repo root.

## Repo Structure

```
anvo-brain/
├── README.md                 # Repo overview + first-time setup pointers
├── CLAUDE.md                 # This file — operating manual for Claude agents
├── SETUP_MAC.md              # First-time setup on macOS
├── SETUP_WINDOWS.md          # First-time setup on Windows
├── .mcp.json                 # MCP server config — references ${ANVO_SECRETS_DIR}
│
├── carriers/                 # Carrier appetite, submission preferences, market intel
│   ├── carrier_matrix.md
│   ├── submission_preferences.md
│   └── market_notes/         # Timestamped intel from underwriter calls/emails
│       └── YYYY-MM-DD_carrier_topic.md
├── intercom/                 # Intercom automation, templates, integration notes
│   ├── setup_notes.md        # EZLynx→Intercom pipeline (Google Apps Script webhooks)
│   ├── workflows/
│   └── templates/
├── intake/                   # Email processing, intake checklists, routing rules
│   ├── instructions.md       # Universal intake instruction set
│   ├── email_accounts/       # Per-inbox handling rules
│   └── checklists/           # By line of business (commercial_auto, bop, workers_comp)
├── workflows/                # Cross-cutting process documentation (used by multiple workflows)
│   ├── new_submission.md
│   ├── bor_process.md
│   ├── renewal_timeline.md
│   └── claims_reporting.md
├── commissions/              # Monthly commission & bonus reporting (self-contained)
│   ├── workflow.md           # End-to-end monthly process (collection → processing → report)
│   ├── sheet_schema.md       # Google Sheet structure (tabs, columns, formulas)
│   ├── carrier_reference.md  # Per-carrier statement formats and parsing notes
│   └── scripts/              # Google Apps Scripts for auto-ingestion
│       ├── commission_ingestion.js   # Drive folder watcher (CSV/Excel)
│       └── bonus_ingestion.js        # Gmail label scanner (MIAA bonuses)
├── outreach/                 # Cold email outreach (self-contained)
│   ├── README.md             # CSV schema, status codes, processing rules
│   ├── workflow.md           # End-to-end outreach process (research → draft → send)
│   ├── templates.md          # Email templates with selection logic
│   └── stage{N}_outreach_log.csv  # Prospect batches (Edward generates, Alice drafts)
├── business/                 # Strategic analyses, audits, internal briefs
│   ├── audits/               # E&O content audit, website audit, vertical analyses
│   └── strategy/             # Middleware risk brief and similar standalone briefs
├── marketing/                # Marketing project plans, content briefs
│   └── seo-aeo/              # SEO/AEO optimization project + content briefs
├── accounts/                 # Running notes on active accounts
│   └── active_notes.md
└── templates/                # Shared templates (used across multiple workflows)
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

## Secrets & Credentials

This repo does NOT contain credentials. The `.mcp.json` at the repo root references `${ANVO_SECRETS_DIR}/anvo-oauth-credentials.json` and `${ANVO_SECRETS_DIR}/anvo-oauth-token.json`. The `ANVO_SECRETS_DIR` environment variable must be set in your shell, pointing at a folder OUTSIDE the repo (typically `~/.anvo-secrets/` on Mac or `%USERPROFILE%\.anvo-secrets\` on Windows). Setup instructions are in `SETUP_MAC.md` / `SETUP_WINDOWS.md`.

If an MCP call fails with a credentials error, first check: (1) `echo $ANVO_SECRETS_DIR` returns a real path, (2) the three credential JSON files are present in that folder, (3) the `.mcp.json` references `${ANVO_SECRETS_DIR}` (not a hardcoded path).

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
- **Edward's session** primarily handles: carrier strategy, workflow design, escalations, repo structure changes, business/strategy briefs, marketing project planning.
- **Alice's session** primarily handles: intake processing, certificate issuance, day-to-day operations, client communications, outreach drafting.
- If both sessions need to edit the same file, one should push before the other pulls. Do not edit the same file simultaneously.
- If a git lock file error occurs (`.git/index.lock` or `.git/HEAD.lock`), the human must delete it manually from their machine before git operations will work.

### Git Auth From Cowork Sandbox

The remote is HTTPS: `https://github.com/Anvo-Insurance/anvo-brain.git`. Each Cowork session authenticates with a Personal Access Token cached by git credential helper, OR uses an SSH deploy key if the session has been configured for SSH.

**Alice's session (HTTPS + PAT or SSH deploy key):**
- If using SSH: key location is `.claude-keys/anvo-brain-deploy` (gitignored via `.claude-keys/` in `.gitignore`). The repo's local `core.sshCommand` config points at this key. **However, the Cowork sandbox exports a `GIT_SSH_COMMAND` env var that overrides `core.sshCommand`.** Always prefix network git operations with `unset GIT_SSH_COMMAND &&` so the configured key is picked up. Examples: `unset GIT_SSH_COMMAND && git pull`, `unset GIT_SSH_COMMAND && git push origin main`.
- If `.claude-keys/anvo-brain-deploy` is missing (fresh clone, new workspace, etc.), regenerate with `ssh-keygen -t ed25519 -f .claude-keys/anvo-brain-deploy -N "" -C "claude-cowork-deploy-key@anvo-brain"`, then add the new `.pub` contents to the repo's Deploy keys on GitHub (`Settings → Deploy keys → Add deploy key`) with "Allow write access" checked. Delete the old deploy key on GitHub after.

**Edward's session (HTTPS + PAT, primary path):**
- Remote is HTTPS. PAT is cached by `git credential-manager` on the host machine; the Cowork sandbox inherits the cached credential.
- If pushes start prompting for username/password, Edward needs to refresh the PAT on his Windows host (GitHub → Settings → Developer settings → Personal access tokens) and re-cache it via `git push` once on the host.
- **Mounted folder git workaround (Windows host only):** The Cowork sandbox cannot delete `.git` lock files on the OneDrive-mounted folder, which causes git operations to fail and leave stale locks behind. To avoid this, Edward keeps the working repo at `C:\Users\ehsye\dev\anvo-brain` (NOT inside OneDrive). The previous `/tmp/anvo-brain-push` clean-clone workaround is no longer needed since the repo lives outside OneDrive.
- If the repo accidentally gets cloned into OneDrive again, never run `git pull`, `git commit`, or `git push` directly in it — it will create lock files that require Edward to manually delete from his terminal.

**Both sessions:**
- For SSH: GitHub allows multiple deploy keys per repo, one per session. To revoke access for either session: delete that session's deploy key on GitHub. The private key becomes inert immediately.
- If the remote URL is set to SSH but you want HTTPS (or vice versa): `git remote set-url origin https://github.com/Anvo-Insurance/anvo-brain.git` (HTTPS) or `git remote set-url origin git@github.com:Anvo-Insurance/anvo-brain.git` (SSH).

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
