# Scheduled Task Prompt — Nightly Scoring + Drafting

This is the prompt body to paste into the Cowork scheduled task system for the **scoring + email drafting** half of the nightly outreach pipeline (Stages 4–5).

**Schedule:** once per night, ~3:30 AM ET (after the apollo-reveals task finishes its 11pm–3am window).
**Working directory:** `~/dev/anvo-brain/`
**Requires:** Gmail MCP connected to `edward@anvoins.com`, WebSearch / WebFetch enabled, Google Drive read access for the style guide.
**Does NOT require:** Chrome open / Apollo logged in (no Apollo work happens here).

A versioned copy lives here so the prompt is reviewable and history is preserved. The runbook it references (`outreach/instructions/nightly-scoring-drafting.md`) is the source of truth — when something operational changes, edit the runbook, not this prompt.

The upstream **apollo reveals** task (Stages 1–3) has its own scheduled task, prompt body (`scheduled-task-apollo-reveals.md`), and runbook (`nightly-apollo-reveals.md`).

---

## Prompt Body (copy-paste below this line)

```
You are running the Anvo Insurance nightly scoring + drafting pipeline (Stages 4–5). Edward Hsyeh is the Managing Partner of Anvo Insurance, an independent commercial insurance agency in Kansas City. Read these files in order before doing anything else:

1. outreach/instructions/nightly-scoring-drafting.md — the runbook. THIS IS THE SOURCE OF TRUTH for orchestration, scoring sequence, drafting rules, and escalation triggers.
2. outreach/reports/nightly-run-state.json — current pipeline state (read stage4 + stage5 keys).
3. outreach/reports/pipeline-learnings.json — accumulated workarounds. Read every learning in categories stage4_scoring, stage5_drafting, web_research, gmail_drafting. Apply them.
4. outreach/instructions/INSTRUCTIONS-v5.md — segment definitions, industry multipliers, carrier routing table.
5. outreach/instructions/INSTRUCTIONS-stage4-7.md — Stage 4 rubric and Stage 5 email rules.
6. outreach/templates.md — email templates and selection logic.
7. Search Google Drive for "Anvo Prospecting Style Guide (AI-Generated)". If found, read it and apply Edward's voice profile to all drafts. If not found, use the default tone rules in INSTRUCTIONS-stage4-7.md and append a low-severity "style_guide_missing" learning.

Then execute the run following the runbook exactly. The runbook covers:
- Step 1 — Stage 4: score every unscored REVEALED contact in stage3_results.csv (no per-run cap)
- Step 2 — Stage 5: draft personalized cold emails for HIGH/MEDIUM contacts that aren't already in stage5_outreach_log.csv (max 15 drafts per run)
- Step 3 — update nightly-run-state.json (stage4 + stage5 keys only — DO NOT touch stage2/stage3/credit_cycle/daily_runs), append learnings
- Step 4 — output the summary block

Hard rules from the runbook (do not skip):
- Every email is a Gmail draft via create_draft. NEVER send.
- Never quote a premium, promise savings, or name a specific carrier in an email.
- Never re-draft a row where draft_status is already DRAFTED (regardless of drafted_by). Both flows share this CSV — gate on draft_status.
- Always set drafted_by=edward on rows you create.
- Companies > ~200 employees, > ~$50M revenue, or known F500 subsidiaries (EMCOR, Ali Group, etc.) → mark SKIP, do not draft.
- Only write the stage4 + stage5 keys in nightly-run-state.json. The apollo-reveals task owns stage2, stage3, credit_cycle, and daily_runs.
- If research yields no specific hook, set draft_status=SKIPPED_NO_HOOK rather than drafting a generic email.

If the runbook conflicts with anything you remember from prior runs, follow the runbook. If you encounter a new failure mode, append a learning to outreach/reports/pipeline-learnings.json before stopping.

After the run, commit and push the changed files:
  git add outreach/reports/nightly-run-state.json outreach/reports/stage4_scored.csv outreach/reports/stage5_outreach_log.csv outreach/reports/pipeline-learnings.json
  git commit -m "Nightly scoring + drafting: <date>"
  git push

Output the summary block as defined in the runbook's Step 4. Include the top prospects with one-sentence hooks and any red flags or oversize/F500 skips for Edward to skim in the morning.
```

---

## When to Update This Prompt vs. the Runbook

| Change | Where to make it |
|--------|------------------|
| Scoring rubric, weighting, or priority thresholds | `INSTRUCTIONS-stage4-7.md` (referenced by runbook) |
| Email tone, structure, or template logic | `INSTRUCTIONS-stage4-7.md` + `templates.md` |
| Carrier routing table | `INSTRUCTIONS-v5.md` |
| New escalation trigger | Runbook (`nightly-scoring-drafting.md`) |
| New skip rule (e.g., "skip companies in vertical X") | Runbook |
| New phase added to the run lifecycle | Runbook + add a one-liner to the prompt's bullet list |
| Schedule change (frequency, time) | This file (and the Cowork scheduled task config) |
| Working directory change | This file |
| From-address change (e.g., switch outbound domain) | This file's prompt body + runbook's "From:" line |

The general principle: the prompt is the wrapper. The runbook is the work. The instruction files are the policy. When in doubt, update the deeper layer.

---

## Manual Test

To dry-run without waiting for the scheduled time:

1. Open a fresh Cowork session in `~/dev/anvo-brain/`.
2. Confirm the Gmail connector is bound to `edward@anvoins.com` (not the primary domain).
3. Paste the prompt body above.

If a manual run finds a new failure mode, append a learning to `pipeline-learnings.json` so the next scheduled run picks it up.
