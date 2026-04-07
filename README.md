# Anvo Insurance — Operational Knowledge Base (`anvo-ops`)

## What This Repo Is

This is Anvo Insurance's shared operational knowledge base. It contains structured, machine-readable instructions that govern how Anvo operates — from carrier appetite and submission workflows to intake processing and client management.

Every file in this repo is written for **Claude Cowork agents as the primary reader**, with human team members as secondary readers. Instructions are explicit, unambiguous, and actionable. There is no prose for prose's sake.

## Who Uses This Repo

| User | Role | How They Use It |
|------|------|-----------------|
| Edward Hsyeh | Managing Partner | Authors and maintains operational instructions. Final authority on all content. |
| Alice | Operations | References for day-to-day processing. Contributes updates from carrier interactions. |
| Claude Cowork Agents | Automated processing | Reads files as operational instructions to execute tasks (intake, submissions, follow-ups). |

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
anvo-ops/
├── README.md                  ← You are here
├── carriers/                  ← Carrier appetite, submission preferences, market intel
│   ├── carrier_matrix.md
│   ├── submission_preferences.md
│   └── market_notes/
├── intercom/                  ← Intercom setup, workflows, message templates
│   ├── setup_notes.md
│   ├── workflows/
│   └── templates/
├── intake/                    ← Email intake processing, checklists, account setup
│   ├── instructions.md
│   ├── email_accounts/
│   └── checklists/
├── workflows/                 ← End-to-end business processes
│   ├── new_submission.md
│   ├── bor_process.md
│   └── renewal_timeline.md
├── accounts/                  ← Active account notes and tracking
│   └── active_notes.md
└── templates/                 ← Reusable email and document templates
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
