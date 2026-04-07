# Template: Client Welcome Email

## Use Case

Send this email after initial intake of a new business inquiry — when a prospect has reached out for a quote and you've acknowledged their request. This is the first substantive communication from Anvo.

There are two versions:
1. **Post-inquiry** — sent after receiving the initial request, before quoting.
2. **Post-binding** — sent after the policy is bound, welcoming them as a client.

---

## Variables

| Variable | Description |
|----------|-------------|
| `{{first_name}}` | Prospect/client first name |
| `{{business_name}}` | Name of their business |
| `{{lines_of_business}}` | Lines of insurance they need (e.g., "general liability, commercial property, and workers' compensation") |
| `{{missing_items}}` | Bulleted list of information/documents still needed from them |
| `{{sender_name}}` | Anvo team member name (typically Edward) |
| `{{sender_title}}` | Title |
| `{{sender_phone}}` | Direct phone |
| `{{sender_email}}` | Direct email |
| `{{carrier_name}}` | (Post-binding only) Name of the carrier that bound the policy |
| `{{effective_date}}` | (Post-binding only) Policy effective date |
| `{{coverage_summary}}` | (Post-binding only) Brief summary of what's covered |

---

## Version 1: Post-Inquiry

```
Subject: Your Insurance Inquiry — Next Steps | Anvo Insurance

Hi {{first_name}},

Thank you for reaching out to Anvo Insurance about coverage for {{business_name}}. We're glad to help.

We're looking into {{lines_of_business}} options for you. To put together the most competitive quotes, we'll need a few things from you:

{{missing_items}}

If you can send those over at your earliest convenience, we'll get the quoting process started right away. You can reply directly to this email or send documents to edward@anvo-insurance.com.

We typically have options ready for review within 1-2 weeks of receiving complete information. If you have any questions in the meantime, don't hesitate to reach out.

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_phone}}
{{sender_email}}
```

---

## Version 2: Post-Binding

```
Subject: Welcome to Anvo Insurance | {{business_name}}

Hi {{first_name}},

Great news — your coverage with {{carrier_name}} is now in effect as of {{effective_date}}.

Here's a quick summary of what's in place:
{{coverage_summary}}

Your full policy documents will arrive from the carrier within the next 2-3 weeks. We'll review them when they come in to make sure everything matches what we requested.

A few things to know as an Anvo client:

- Certificates of insurance: Need a COI for a lease, contract, or vendor? Just email us and we'll get it to you, usually same-day.
- Policy changes: Adding a vehicle, location, or employee? Let us know and we'll handle the endorsement.
- Claims: If anything happens, contact us first. We'll help you report it and guide you through the process.

You can always reach us at {{sender_email}} or {{sender_phone}}.

Welcome aboard — we're glad to have {{business_name}} as a client.

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_phone}}
{{sender_email}}
```

---

## Notes

- **Tone:** Professional but warm. We're a boutique brokerage, not a call center.
- **Do not** include specific coverage limits or premium figures in the welcome email — those belong in the proposal document.
- **Post-binding version:** Only send after Edward has confirmed binding. Never send prematurely.
- **Adapt as needed.** If the client's situation doesn't fit neatly into these templates (e.g., they're transferring via BOR, not new business), adjust the language accordingly.

<!-- Updated 2026-04-06 by Claude: initial template creation -->
