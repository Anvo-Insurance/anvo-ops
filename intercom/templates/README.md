# Intercom Message Templates

## What This Folder Is

This folder holds message templates used in Intercom automations and manual responses. Each file contains one template with its use case, variables, and the exact message text.

## File Naming Convention

```
use_case_description.md
```

Examples:
- `new_lead_auto_reply.md`
- `certificate_request_acknowledgment.md`
- `renewal_reminder_60_day.md`
- `claim_first_notice_response.md`

## Template File Structure

Every template file must follow this format:

```markdown
# Template: [Template Name]

## Use Case
[When is this template sent? Manually or automatically? What triggers it?]

## Variables
[List dynamic fields that get swapped in — e.g., {{first_name}}, {{policy_number}}, {{renewal_date}}]

## Message Text
[The exact message, with variables marked using {{double_braces}}]

## Notes
[Any context: tone guidance, when NOT to use this template, required follow-up actions]
```

## Rules

1. **One template per file.** Do not combine multiple templates in one file.
2. **Keep messages concise.** Intercom messages should be short and action-oriented.
3. **Use {{variable}} syntax** for dynamic content so it's clear what gets substituted.
4. **Test before deploying.** After editing a template, send a test message to verify formatting and variable substitution work correctly.
5. **Version note.** If you significantly change a template, add a comment at the bottom: `<!-- Updated YYYY-MM-DD by [name]: [what changed] -->`

<!-- TODO: Edward to fill in — add initial templates for common scenarios -->
