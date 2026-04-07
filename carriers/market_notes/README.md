# Market Notes

## What This Folder Is

This folder stores market intelligence captured from underwriter calls, carrier emails, webinars, and in-person meetings. Each note is a dated markdown file that records a specific insight about a carrier's appetite, pricing, or behavior.

## File Naming Convention

```
YYYY-MM-DD_carrier-name_topic.md
```

Examples:
- `2026-04-01_acme-insurance_habitational-appetite-change.md`
- `2026-03-15_liberty-mutual_wc-class-code-restrictions.md`
- `2026-02-28_markel_cyber-minimum-premium-increase.md`

Use lowercase, hyphens instead of spaces, and keep the topic description short (3-5 words).

## Template for Each Note

Every market note file must follow this structure:

```markdown
# [Carrier Name] — [Topic Summary]

| Field | Details |
|-------|---------|
| **Date** | YYYY-MM-DD |
| **Source** | Who told us this (name, title, carrier). Was it a call, email, webinar, or in-person meeting? |
| **Carrier** | Full carrier/MGA/wholesaler name |

## Key Takeaway

[1-3 sentences. What did we learn? Be specific and actionable.]

## Details

[Expand if needed. Include numbers, class codes, effective dates, territory specifics.]

## Impact on Carrier Matrix

- [ ] **Does this affect `carriers/carrier_matrix.md`?** If yes, describe what needs to change.
- [ ] **Does this affect `carriers/submission_preferences.md`?** If yes, describe what needs to change.
- [ ] **Changes applied:** [Date updated and by whom, or "Pending"]
```

## Rules

1. **Log promptly.** Create the note within 24 hours of receiving the intel. Memory decays fast.
2. **One insight per file.** If a call covered three topics, create three files.
3. **Flag matrix updates.** If the note reveals an appetite change, restriction, or new capability, check the boxes in the template and update `carriers/carrier_matrix.md` accordingly.
4. **Don't duplicate.** Before creating a note, scan existing files for the same carrier + topic. Update the existing note if it's a revision of prior intel.
