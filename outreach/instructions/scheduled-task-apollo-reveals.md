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
You are running the Anvo Insurance nightly Apollo reveals pipeline (Stages 1–3). Working directory is the mounted anvo-brain repo root — all paths below are relative to it. Read these files in order before doing anything else:

1. outreach/instructions/nightly-apollo-reveals.md — the runbook. THIS IS THE SOURCE OF TRUTH for orchestration, Apollo navigation, credit budget rules, escalation triggers, AND the /tmp clone commit+push workflow (Step 5).
2. outreach/reports/nightly-run-state.json — current pipeline state.
3. outreach/reports/pipeline-learnings.json — accumulated workarounds. Read every entry and follow them (especially categories apollo_navigation, apollo_reveal, chrome_stability, phone_reveal, credit_management, git_push).
4. outreach/instructions/INSTRUCTIONS-v5.md — stage-by-stage scoring and verification logic.

Then execute one batch following the runbook exactly. The runbook covers:
- Step 0 — read state, compute credit budget, check daily run cap
- Step 0.5 — DISABLE APOLLO ENRICHMENT MODE (mandatory)
- Step 1 — clear pending email reveals (Phase 1)
- Step 2 — verify next Stage 2 batch (if reveal cap not hit)
- Step 2.5 — Phase 2 phone reveals (only if conditions met)
- Step 3 — update state file, append learnings
- Step 4 — output summary block
- Step 5 — commit and push via /tmp clone + SSH deploy key. Deploy key lives at `.claude-keys/edward-deploy` inside the mounted anvo-brain folder. Strip CRLF and append a trailing newline before using it (OpenSSH fails with "error in libcrypto" otherwise). If any part of Step 5 fails, fall back to Step 5.5's paste-ready block and append a learning at severity=high / category=git_push.

Hard rules from the runbook (do not skip):
- If credits_remaining <= 0, STOP and output "Monthly credit cap reached — pausing until the 2nd."
- If today already has 6+ runs in daily_runs, STOP and output "Daily run cap reached — next run in 45 min."
- If Apollo shows any billing/upgrade/credit modal, STOP and surface to Edward.
- Process everything sequentially. Never spawn parallel sub-agents.
- Email reveals come before phone reveals. Never reveal a phone if it would push you over the 2,600 monthly cap.
- This task only writes the stage2/stage3/credit_cycle/daily_runs keys in nightly-run-state.json. Do NOT touch stage4 or stage5 keys (the scoring/drafting task owns those).
- NEVER run git against the mounted anvo-brain folder directly. All git work happens inside /tmp/anvo-brain-push per runbook Step 5. The scoring+drafting task shares this /tmp clone — always `git fetch + reset --hard origin/main + clean -fd` at the start of Step 5.2 to pick up its commits.

If the runbook conflicts with anything you remember from prior runs, follow the runbook. If you encounter a new failure mode, append a learning to outreach/reports/pipeline-learnings.json before stopping.

Output the summary block as defined in the runbook's Step 4. Then execute runbook Step 5 and report whether the push succeeded with the resulting commit SHA; if Step 5 fell back to the paste-block, include that block at the end of the response so Edward can run it manually.
```

---

## When to Update This Prompt vs. the Runbook

| Change | Where to make it |
|--------|-------