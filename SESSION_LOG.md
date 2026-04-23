# Session Log

Running log of work completed across Claude Cowork sessions. Updated at the end of each session. Most recent entry first.

---

## 2026-04-22 — Workspace Migration, Outreach Restructure, Scheduled-Task Architecture, Alice Onboarding

### What We Worked On
A long, multi-thread session that touched both `anvo-brain` and `anvo-insurance-site`. Four arcs:

1. **Workspace migration (Phases 0–7).** Consolidated scattered Desktop folders into two GitHub-shared repos: `anvo-brain` (operational knowledge base, shared with Alice) and `anvo-insurance-site` (11ty static site + content pipeline, separate). Folders that moved: Carrier Appetite Summary → `carriers/`, Commissions Workflow → `commissions/`, Apollo/outreach scratch dirs → `outreach/`, Article Creation → site repo. Empty `~/dev/anvo-prospecting` left for manual deletion. Migration was driven by the OneDrive lock issue (multiple Cowork sessions stomping on each other) and the need to give Alice and the nightly scheduled tasks a single source of truth.
2. **Post-migration restructure of `outreach/`.** The folder had grown a flat sprawl of `INSTRUCTIONS-*.md`, `*.csv`, and state files. Split into `instructions/` (source-of-truth prompts and runbooks) and `reports/` (state files + generated batch outputs). Rewrote `outreach/README.md` as a folder router with a "where do I go for X" table. This became the canonical example of the Self-Contained Workflow Folders rule.
3. **Scheduled-task architecture pattern, applied twice.** Took the thin-prompt + thick-runbook + append-only-learnings pattern we built last week for the Apollo prospecting scheduled task and explicitly named it as a reusable pattern. Then applied the same three-layer split to the nightly content creation task in `anvo-insurance-site` (new files: `nightly-content-pipeline.md` runbook, `scheduled-task-nightly-content.md` prompt body, `content-pipeline-learnings.md` append-only log).
4. **Alice onboarding consolidation.** Alice ("completely new to GitHub — just downloaded it last week") needs to set up the repo on her Mac. After several iterations, settled on a 2-doc structure (Option B): a personal brief on Edward's Desktop covering channel-specific credentials handoff (OneTimeSecret instead of Signal), and a durable `ALICE_INSTALL.md` in the repo for any future hire. Deleted the intermediate `ALICE_START_HERE.md`. Personal brief contains explicit gotcha-prevention for TextEdit Rich Text mode and the macOS "If no extension is provided, use .txt" filename trap.

### What Changed (anvo-brain)
- **`CLAUDE.md`** — Updated Edward/Alice handles (added nightly prospecting scheduled task under Edward; scoped Alice to Phase 2 drafting only); added scheduled-task write-window note (11pm–3am ET); rewrote Self-Contained Workflow Folders rule to explicitly allow `instructions/` + `reports/` subfolders with `outreach/` cited as canonical example
- **`README.md`** — Updated outreach folder tree to reflect new `instructions/` + `reports/` subfolder layout; changed non-tech setup pointer from `ALICE_START_HERE.md` to `ALICE_INSTALL.md`
- **`outreach/`** restructured:
  - `outreach/README.md` — Full rewrite as folder router (two workflows: Prospecting Pipeline / Email Drafting; reports/ schema; naming conventions; write-window warning; CSV schema scoped to drafting flow)
  - `outreach/instructions/INSTRUCTIONS-v5.md` — Moved from root
  - `outreach/instructions/INSTRUCTIONS-stage4-7.md` — Moved from root
  - `outreach/instructions/COWORK-TASK-PROMPTS.md` — Moved from root
  - `outreach/instructions/nightly-pipeline.md` — Moved from root
  - `outreach/instructions/scheduled-task-nightly.md` — Trimmed prompt body for the Cowork scheduler (thin layer)
  - `outreach/reports/nightly-run-state.json` — Moved from root
  - `outreach/reports/pipeline-learnings.json` — Moved from root
  - `outreach/reports/stage3_results.csv` — Moved from root
  - `outreach/reports/stage{N}_outreach_log.csv` — Moved from root
- **`ALICE_INSTALL.md`** — New. Durable, channel-agnostic Mac setup walkthrough: GitHub Desktop install → sign in → clone with `~/dev/anvo-brain` path correction → Claude Desktop install → Step 5 "Let Claude finish the setup" with the Cowork prompt embedded directly + Step 5.1–5.4 fallback for non-Alice future users + 🚨 "don't paste credentials into Claude" warning + "common things that aren't really wrong" troubleshooting
- **`ALICE_START_HERE.md`** — Deleted. Folded into `ALICE_INSTALL.md` per Option B

### What Changed (anvo-insurance-site)
- **`Article Creation/nightly-content-pipeline.md`** — New ~270-line runbook. Sections: Purpose, Source-of-Truth Files (4: playbook, inventory, learnings, template), Guardrails (6 nevers including never-push-to-production), Capability Boundary, Content Sequence Logic (priority verticals 1–5), Run Lifecycle (Steps 0–7), Known Sandbox Constraints (git lock + stale temp objects), State File Schemas, When to Stop and Escalate
- **`Article Creation/scheduled-task-nightly-content.md`** — New ~75-line thin prompt body in code block. References runbook as source of truth. "When to update this prompt vs runbook" matrix
- **`Article Creation/content-pipeline-learnings.md`** — New append-only log. Categories: Git & Sandbox, Template & Schema, Sourcing & Evidence, Interlinking, Inventory, Content Strategy. Seeded with two real entries (`.git/index.lock` recurrence + stale temp objects) marked "Folded into runbook"

### What Changed (Edward's Desktop)
- **`Alice-Setup-Instructions.md`** — New personal brief. Three parts: (1) Receive credentials via OneTimeSecret with explicit TextEdit ⌘+Shift+T + filename verification steps; (2) Install GitHub Desktop / clone repo via `ALICE_INSTALL.md` Steps 1–3, skip Step 4 (Claude Desktop) but verify Cowork mode is active; (3) Open Claude Desktop in `anvo-brain` folder and paste the SETUP_MAC.md prompt. Three "🚨 never paste credentials into Claude" warnings throughout

### Key Decisions
- **Two repos, not one.** `anvo-brain` (Alice + Cowork agents) vs `anvo-insurance-site` (deployed code, only Edward). Different audiences, different blast radius for mistakes
- **Self-Contained Workflow Folders may use subfolders.** When a workflow has both source-of-truth instructions and generated artifacts/state, split into `instructions/` + `reports/`. `outreach/` is the canonical example
- **Scheduled tasks use the three-layer pattern.** Thin prompt body (Cowork scheduler) + thick runbook (in repo, full goals/guardrails/sequence) + append-only learnings file (workarounds discovered at runtime). The prompt only changes when the entry-point semantics change; runbook changes when the goal/guardrails change; learnings is append-only forever
- **OneTimeSecret instead of Signal** for credentials handoff (Alice doesn't have Signal). Two-channel pattern preserved: link on one channel, passphrase on another
- **Alice onboarding is 2 docs, not 3.** Personal brief on Desktop (channel-specific, transient) + `ALICE_INSTALL.md` in repo (channel-agnostic, durable for future hires). The `ALICE_START_HERE.md` middle layer was removed as redundant
- **Goals-and-guardrails over prescriptive scripts** for `SETUP_MAC.md` and the new content pipeline runbook — Cowork sequences commands itself based on observed state rather than running a fixed script

### Files Moved / Renamed (anvo-brain outreach restructure)
| Old path | New path |
|----------|----------|
| `outreach/INSTRUCTIONS-v5.md` | `outreach/instructions/INSTRUCTIONS-v5.md` |
| `outreach/INSTRUCTIONS-stage4-7.md` | `outreach/instructions/INSTRUCTIONS-stage4-7.md` |
| `outreach/COWORK-TASK-PROMPTS.md` | `outreach/instructions/COWORK-TASK-PROMPTS.md` |
| `outreach/nightly-pipeline.md` | `outreach/instructions/nightly-pipeline.md` |
| `outreach/nightly-run-state.json` | `outreach/reports/nightly-run-state.json` |
| `outreach/pipeline-learnings.json` | `outreach/reports/pipeline-learnings.json` |
| `outreach/stage3_results.csv` | `outreach/reports/stage3_results.csv` |
| `outreach/stage{N}_outreach_log.csv` | `outreach/reports/stage{N}_outreach_log.csv` |

### Open Items (Edward's Manual To-Dos)
1. Push `anvo-brain` updates: `git add -A && git rm ALICE_START_HERE.md && git commit -m "Outreach restructure + consolidate Alice setup docs" && git push`
2. Push `anvo-insurance-site` updates: runbook + scheduled-task prompt + learnings file
3. Update Cowork scheduled task with new prospecting prompt body (`outreach/instructions/scheduled-task-nightly.md`)
4. Update Cowork scheduled task with new content prompt body (`Article Creation/scheduled-task-nightly-content.md`)
5. Set cadence on content task (once-per-night, in the 11pm–3am ET write window)
6. Set Alice up with git auth from her Cowork sandbox (SSH deploy key recommended) — defer until she hits her first failed `git push`
7. Delete empty `C:\Users\ehsye\dev\anvo-prospecting` folder
8. Send Alice the scheduled OneTimeSecret link + passphrase (already scheduled per Edward)
9. Carry-over from prior session: chat-history recovery from broken Claude Desktop sessions

### Next Session
- Watch first nightly run of the new content pipeline scheduled task; capture any new failure modes in `content-pipeline-learnings.md`
- Watch first Alice-side run of `ALICE_INSTALL.md` end-to-end; capture pain points in either the install doc or `SETUP_MAC.md`
- Resume backlog: fill in `carriers/submission_preferences.md`, define follow-up cadence for outreach Phase 4
- Once Alice has done one successful drafting run, write a "Phase 2 quickstart" pointer at the top of `outreach/email-drafting-workflow.md`

---

## 2026-04-16 — Cold Outreach Workflow + Carrier Matrix Migration

### What We Worked On (Part 2: Cold Outreach)
Built the complete cold email outreach workflow — repo structure, process documentation, email templates, and CSV schema. This enables Edward's Cowork to generate prospect batches and Alice's Cowork to draft Gmail emails from them.

### What Changed
- **`outreach/README.md`** — New directory + README documenting CSV column schema (13 columns), draft_status codes, processing rules for Alice's Cowork, and git workflow
- **`outreach/workflow.md`** — End-to-end 4-phase workflow: prospect research (Edward) → email drafting (Alice's Cowork) → review & send (Alice manual) → follow-up (TODO)
- **`outreach/templates.md`** — 5 email templates with selection logic: Standard, Family/Generational, Growth/Award, Specialty/Niche, WBE/Certification. Includes per-segment value prop customization guide and "never do" rules
- **`outreach/stage5_outreach_log.csv`** — Copied Edward's existing prospect CSV (30 prospects, mostly KC-area construction and transport/logistics) into the repo as the first batch
- **`CLAUDE.md`** — Updated repo structure diagram, added self-contained folder convention to Working Conventions
- **Restructured:** Moved workflow and templates into `outreach/` folder (self-contained). Old locations `workflows/cold_outreach.md` and `templates/cold_email_templates.md` should be deleted

### Key Decisions
- **Sender = whoever's Cowork drafts**: If Alice's Cowork drafts, email goes from alice@. If Edward's, from edward@
- **Value prop is customized per prospect**: No canned one-liner — each email tailors Anvo's pitch to the prospect's specific risk profile and segment
- **Alice updates the CSV**: Her Cowork sets `draft_status` to DRAFTED after creating Gmail drafts, then commits the updated CSV back
- **CSV lives in repo** (not Google Drive or Sheets) — single source of truth, version controlled
- **Follow-up cadence**: Still TBD — left as TODO in workflow doc

### Alice Setup Requirements (Not Yet Verified)
- anvo-ops folder mounted in Alice's Cowork session
- Gmail connector active
- Git pull/push access (or Edward handles git on her behalf)

### Next Session
- Verify Alice's Cowork can access the anvo-ops folder
- Test the workflow end-to-end: Alice's Cowork reads stage5 CSV → drafts emails → updates statuses
- Fill in `carriers/submission_preferences.md` (still empty from prior session)
- Define follow-up cadence and templates (Phase 4 in cold_outreach.md)
- Add phone numbers to email signature blocks

---

## 2026-04-16 — Carrier Matrix Migration

### What We Worked On
Migrated Edward's full carrier appetite summary (from Desktop/Carrier Appetite Summary) into the shared `anvo-ops` repo. The carrier matrix was previously just an empty template — now it has detailed data for 19 carriers.

### What Changed
- **`carriers/carrier_matrix.md`** — Replaced empty template with full carrier data (2,800+ lines). Includes:
  - PMSF compensation reference table (MIAA/SIAA 2026) with quarterly rates and strategic routing notes
  - 19 detailed carrier entries: GUARD, The Hartford, Travelers, Liberty Mutual, CNA, AmTrust, MGT, Progressive, Simply Business, CRC Group, Burns & Wilcox, RPS, Nationwide, UFG, BHHC, Columbia, Crum & Forster, BTIS
  - Per-carrier: appetite by class, geographic restrictions, building/risk preferences, submission methods, key contacts, nuances
  - GUARD restaurant BOP expanded appetite (Feb 2026 update)
  - Nationwide personal lines note (flagged as not commercial)

### Key Decisions
- Kept the "How to Use This File" decision process header from the original template and merged it with the uploaded content
- Added PMSF routing rule to the decision process: "When two carriers have equal appetite, route to the one earning more PMSF"
- File structure preserves the detailed per-carrier format from Edward's original rather than the table-based template (tables would lose too much detail)

### Next Session
- Fill in `carriers/submission_preferences.md` with per-carrier submission requirements (now that we know which carriers Anvo uses)
- Consider breaking the carrier matrix into per-carrier files if it gets unwieldy at 2,800+ lines
- Add checklists for GL standalone, umbrella, professional liability

---

## 2026-04-06 — Initial Repo Build + EZLynx Screen-Walk

### What We Worked On
Built out the full `anvo-ops` knowledge base from scratch — 18 files across 6 business function folders. Then filled in TODOs conversationally and did a live EZLynx screen-walk to document actual UI procedures.

### Key Decisions Made
- **Business hours:** Mon–Fri 8am–6pm ET
- **Escalation method:** Assign in Intercom + email Edward
- **Remarket threshold:** >10% rate increase triggers remarketing
- **Personal review call threshold:** $25K+ annual premium accounts
- **Loss runs:** 5 years across all lines
- **Large loss detail threshold:** $25K per claim
- **Lead routing:** Alice handles first response, Edward handles escalations
- **After-hours leads:** Auto-reply all, text Edward for urgent/claims
- **BOP forms:** Most carriers use proprietary apps, not standard ACORD
- **Auto forms:** No Anvo standard — use whichever the carrier requires
- **WC monopolistic states:** Anvo does not operate in OH/WA/WY/ND
- **Submissions flow:** No dedicated inbox — web form → Google Sheet → Apps Script → email to Alice + Edward

### Files Created
- `README.md` — repo overview, conventions, folder structure
- `carriers/carrier_matrix.md` — per-carrier template (3 placeholder entries)
- `carriers/submission_preferences.md` — per-carrier submission formatting requirements
- `carriers/market_notes/README.md` — dated market intel note convention
- `intercom/setup_notes.md` — EZLynx-Intercom integration placeholder
- `intercom/workflows/new_lead_routing.md` — lead classification and routing rules
- `intercom/templates/README.md` — message template conventions
- `intake/instructions.md` — universal intake instruction set (new biz, renewals, certs, claims, service)
- `intake/email_accounts/submissions_at_anvo.md` — inbound submissions flow (web form → Google Sheet → email)
- `intake/checklists/commercial_auto.md` — submission checklist for commercial auto
- `intake/checklists/bop.md` — submission checklist for BOP
- `intake/checklists/workers_comp.md` — submission checklist for workers' comp
- `workflows/new_submission.md` — 7-step end-to-end submission workflow
- `workflows/bor_process.md` — broker of record change procedure
- `workflows/renewal_timeline.md` — renewal milestones (120 to 0 days)
- `accounts/active_notes.md` — per-account tracking template
- `templates/README.md` — template folder conventions
- `templates/client_welcome_email.md` — post-inquiry and post-binding email templates

### EZLynx Procedures Documented (from screen-walk)
- **New prospect creation:** Full step-by-step for `/web/account/create/commercial` — required fields, Lead Info section, Save vs. Create Submission buttons
- **Activity logging:** Freeform notes via Activity tab → "Add new note" — no structured type codes, search by note content
- **Certificate issuance:** 6-step wizard (Add Policy → Remarks → Docs → Holders → Review PDF → Distribute) — agents can issue directly, escalate only when endorsements need carrier involvement
- **Document access:** Documents tab has searchable library with Actions menus — agents can pull dec pages, applications, COIs

### Remaining TODOs (not blocked, just need Edward's input later)
- **Carrier data:** Carrier matrix entries, submission preferences per carrier, claim reporting procedures
- **Intercom config:** Workspace details, tagging taxonomy, Apps Script details, web form fields
- **Operational:** Sensitive accounts list, proposal template format, BOR letter template location
- **Checklist gaps:** MVR freshness requirement (Edward to confirm), which carriers require payroll/tax docs for WC, which require vehicle photos for auto

### Next Session
- Fill in carrier matrix with actual carriers (start with top 3-5)
- Add carrier-specific submission preferences
- Consider adding checklists for GL standalone, umbrella, professional liability
