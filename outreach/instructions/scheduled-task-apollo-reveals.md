# Scheduled Task Prompt — Nightly Apollo Reveals

This is the prompt body to paste into the Cowork scheduled task system for the **Apollo reveals** half of the nightly outreach pipeline (Stages 1–3).

**Schedule:** every 45 minutes, 11:00 PM – 3:00 AM ET.
**Working directory:** `~/dev/anvo-brain/`
**Requires:** Chrome open, logged into Apollo.io.

A versioned copy lives here so the prompt is reviewable and history is preserved. The runbook it references (`outreach/instructions/nightly-apollo-reveals.md`) is the source of truth — when something operational changes, edit the runbook, not this prompt.

The downstream **scoring + drafting** task (Stages 4–5) has its own scheduled task, prompt body (`scheduled-task-scoring-drafting.md`), and runbook (`nightly-scoring-drafting.md`).

---

## Prompt Body (copy-paste below this line)

```
You are running the Anvo Insurance nightly Apollo reveals pipeline (Stages 1–3). Read these files in order before doing anything else:

1. outreach/instructions/nightly-apollo-reveals.md — the runbook. THIS IS THE SOURCE OF TRUTH for orchestration, Apollo navigation, credit budget rules, and escalation triggers.
2. outreach/reports/nightly-run-state.json — current pipeline state.
3. outreach/reports/pipeline-learnings.json — accumulated workarounds. Read every entry and follow them.
4. outreach/instructions/INSTRUCTIONS-v5.md — stage-by-stage scoring and verification logic.

Then execute one batch following the runbook exactly. The runbook covers:
- Step 0 — read state, compute credit budget, check daily run cap
- Step 0.5 — DISABLE APOLLO ENRICHMENT MODE (mandatory)
- Step 1 — clear pending email reveals (Phase 1)
- Step 2 — verify next Stage 2 batch (if reveal cap not hit)
- Step 2.5 — Phase 2 phone reveals (only if conditions met)
- Step 3 — update state file, append learnings
- Step 4 — output summary block

Hard rules from the runbook (do not skip):
- If credits_remaining <= 0, STOP and output "Monthly credit cap reached — pausing until the 2nd."
- If today already has 6+ runs in daily_runs, STOP and output "Daily run cap reached — next run in 45 min."
- If Apollo shows any billing/upgrade/credit modal, STOP and surface to Edward.
- Process everything sequentially. Never spawn parallel sub-agents.
- Email reveals come before phone reveals. Never reveal a phone if it would push you over the 2,600 monthly cap.
- This task only writes the stage2/stage3/credit_cycle/daily_runs keys in nightly-run-state.json. Do NOT touch stage4 or stage5 keys (the scoring/drafting task owns those).

If the runbook conflicts with anything you remember from prior runs, follow the runbook. If you encounter a new failure mode, append a learning to outreach/reports/pipeline-learnings.json before stopping.

After the run, commit and push the changed state files:
  git add outreach/reports/nightly-run-state.json outreach/reports/stage3_results.csv outreach/reports/pipeline-learnings.json outreach/reports/A2-stage2-batch*-verified.csv
  git commit -m "Nightly apollo reveals: <date> #<N>"
  git push

Output the summary block as defined in the runbook's Step 4.
```

---

## When to Update This Prompt vs. the Runbook

| Change | Where to make it |
|--------|------------------|
| New Apollo selector or anti-bot workaround | Runbook (`nightly-apollo-reveals.md`) |
| Credit budget rule change | Runbook |
| New escalation trigger | Runbook |
| New phase added to the run lifecycle | Runbook + add a one-liner to the prompt's bullet list |
| Schedule change (frequency, time window) | This file (and the Cowork scheduled task config) |
| Working directory change | This file |

The general principle: the prompt is the wrapper. The runbook is the work. When in doubt, edit the runbook.

---

## Manual Test

To dry-run without waiting for the scheduled time:

1. Open a fresh Cowork session in `~/dev/anvo-brain/`.
2. Make sure Chrome is open, logged into Apollo.
3. Paste the prompt body above.

If a manual run finds a new failure mode, append a learning to `pipeline-learnings.json` so the next scheduled run picks it up.
