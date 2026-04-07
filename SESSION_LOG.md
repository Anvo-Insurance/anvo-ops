# Session Log

Running log of work completed across Claude Cowork sessions. Updated at the end of each session. Most recent entry first.

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
