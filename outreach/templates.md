# Cold Email Templates

Templates for cold outreach to commercial insurance prospects. Used by Alice's (or Edward's) Cowork session to generate Gmail drafts from prospect CSVs in this folder. See `workflow.md` for the end-to-end process and `README.md` for CSV schema.

## How to Use These Templates

1. **Select the template** that best fits the prospect's `segment` and situation.
2. **Fill all `{{variables}}`** using data from the CSV row.
3. **Customize the value prop hook** — do NOT use a generic insurance pitch. Tailor it to the prospect's specific risk profile based on their `research_summary` and `segment`. See the value prop guidance section below.
4. **Keep it short** — 4-6 sentences max for the body. These are busy business owners.
5. **Subject line** — use the `subject_line` from the CSV. If blank, write one that references something specific about the company (not "Insurance quote for {{company}}").
6. **Sender** — the email goes from whoever's Cowork is drafting it (alice@anvo-insurance.com or edward@anvo-insurance.com).

## Draft Body Format — HTML, Not Plain Text

All Gmail drafts are created with an **HTML body** (not plain text). The signature block below requires HTML to render the logo, bold name, blue hyperlink, phone links, license line, and italic disclaimer. When converting a template body to HTML:

- Wrap each paragraph in `<p>` tags with no inline styling — Gmail will use its default rendering.
- Preserve one blank line between paragraphs by using separate `<p>` elements.
- Do not include a "Best," closing — the signature block below serves as the sign-off.
- End the HTML body with the signature block from the "Signature Block" section, verbatim, with `{{campaign}}` and `{{template}}` substituted.
- The `create_draft` MCP tool should be called with the body as an HTML string. If the tool has a separate `isHtml` or `content_type` flag, set it to HTML.

Minimal example body structure:

```html
<p>Hi {{contact_first_name}},</p>
<p>{{opening_hook}}</p>
<p>I'm {{sender_first_name}} with Anvo Insurance — {{pitch}}</p>
<p>{{soft_cta}}</p>
{{signature_block}}
```

## Value Prop Customization Guide

Never use a one-size-fits-all value prop. Instead, match Anvo's strengths to the prospect's specific exposures:

| Segment | Key Risks to Reference | Anvo Angle |
|---------|----------------------|------------|
| Construction / GC | GL, workers comp, builders risk, equipment, bonding | Multiple carrier markets for contractors; experience with artisan and GC classes |
| Transport / Logistics / Trucking | Commercial auto, cargo, physical damage, MCS-90 | Hard-to-place fleet and trucking experience; access to both standard and E&S markets |
| 3PL / Warehousing | Warehouse legal liability, cargo, property, cyber | Specialty warehouse programs; understand bailee exposure |
| Food / Restaurant | Property, GL, liquor liability, workers comp, EPLI | Restaurant-specific programs; understand food service risk |
| Manufacturing | Property, product liability, workers comp, equipment breakdown | Product liability expertise; carrier relationships for manufacturing classes |
| Professional Services / Tech | E&O, cyber, EPLI, D&O | Tech E&O programs; understand SaaS and professional liability |
| ESOP Companies | D&O, fiduciary liability, ERISA | Fiduciary liability expertise for employee-owned companies |
| Multi-state Operations | WC across jurisdictions, fleet compliance | Experience navigating multi-state compliance |

## Template 1: Standard Cold Outreach (Default)

**Use for:** Most HIGH priority prospects where you have good research.

```
Subject: {{subject_line}}

Hi {{contact_first_name}},

{{opening_hook — 1 sentence referencing something specific about their company from research_summary. Make it clear you actually looked them up.}}

I'm {{sender_name}} with Anvo Insurance — we're an independent brokerage that works with {{segment-relevant description, e.g., "contractors across the KC metro" or "trucking and logistics companies"}}. {{value_prop — 1 sentence tailored to their specific risk profile. Reference the actual coverage lines that matter for their business.}}

I'd love to spend 15 minutes understanding what you've got in place and see if we can find better options when your policies come up for renewal. No hard sell — just a comparison.

Would you be open to a quick call?

{{signature_block}}  (see "Signature Block" section below — use `template=standard` when substituting)
```

## Template 2: Generational / Family Business Angle

**Use for:** Family-owned businesses, multi-generation companies, succession situations. Look for cues in `research_summary` like "family-owned," "founded by," "3rd generation," "father-son."

```
Subject: {{subject_line}}

Hi {{contact_first_name}},

{{opening_hook — reference the family legacy or generational milestone. e.g., "Three generations of Davis trucking is impressive — not many businesses make it past the first."}}

I'm {{sender_name}} with Anvo Insurance. We work with a lot of family-run {{segment}} businesses in the area, and I know firsthand how the insurance needs evolve as the company grows across generations — {{value_prop tailored to their stage, e.g., "especially around fleet growth and driver hiring" or "particularly when transitioning leadership and protecting what you've built."}}.

I'd enjoy learning about where {{company}} is headed and whether your current coverage still fits. No obligation — just a conversation.

Worth a 15-minute call?

{{signature_block}}  (see "Signature Block" section below — use `template=family` when substituting)
```

## Template 3: Growth / Award / Milestone Angle

**Use for:** Companies with recent recognition, rapid growth, or notable achievements mentioned in `research_summary` (awards, "fastest growing," expansion, new projects).

```
Subject: {{subject_line}}

Hi {{contact_first_name}},

{{opening_hook — reference the specific achievement. e.g., "Congrats on the NAHB Top 3 two years running — that's a serious track record." or "Saw that SkuTouch won Kansas Small Business Exporting Business of the Year — well deserved."}}

Growth like that usually means your insurance needs have changed too — {{value_prop tied to their growth, e.g., "more projects in progress means more builders risk and GL exposure" or "expanding into new states adds workers comp complexity."}}

I'm {{sender_name}} with Anvo Insurance. We specialize in helping {{segment}} companies make sure their coverage keeps up with their growth. I'd love to take a quick look at what you've got and see if there are gaps or savings.

Open to a 15-minute call?

{{signature_block}}  (see "Signature Block" section below — use `template=growth` when substituting)
```

## Template 4: Specialty / Niche Angle

**Use for:** Companies with unusual risk profiles — underground storage, towing, epoxy coatings, international supply chain, etc. Prospects where a generic agent might not understand their exposure.

```
Subject: {{subject_line}}

Hi {{contact_first_name}},

{{opening_hook — acknowledge the niche. e.g., "Underground cold storage is one of the more unique property exposures I've come across — 500K square feet in a former mine is not something most insurance agents see every day."}}

That kind of operation needs an insurance partner who actually understands the specific risks — {{value_prop naming the actual exposures, e.g., "spoilage liability, unique property valuation, and temperature-controlled warehouse coverage" or "specialty towing, on-hook liability, and garage keepers."}}. That's exactly what we do at Anvo.

I'm {{sender_name}}, and I'd love to learn more about {{company}}'s operation and see if we can put together a more tailored program than what you're likely getting from a generalist agent.

15 minutes — worth a shot?

{{signature_block}}  (see "Signature Block" section below — use `template=specialty` when substituting)
```

## Template 5: WBE / MWBE / Certification Angle

**Use for:** Woman-owned, minority-owned, or otherwise certified businesses. The certification itself is an opening — these businesses often have unique compliance and contract requirements.

```
Subject: {{subject_line}}

Hi {{contact_first_name}},

{{opening_hook — reference the certification and their work. e.g., "Really impressed by what DI Build is doing with the AdventHealth medical center projects — and the WBE certification adds a strong differentiator in that space."}}

As a certified {{WBE/MBE/etc.}} contractor, you likely run into bonding and insurance requirements on every bid — {{value_prop, e.g., "having the right GL limits, professional liability, and bonding capacity can make or break a contract win."}}

I'm {{sender_name}} with Anvo Insurance. We work with certified contractors and understand the insurance and bonding requirements that come with government and institutional projects. Happy to take a look at your program and see if we can strengthen your bid profile.

Would a quick call make sense?

{{signature_block}}  (see "Signature Block" section below — use `template=wbe` when substituting)
```

## Template Selection Logic

When drafting, select the template that best matches the prospect. Use this priority:

1. **If `research_summary` mentions family/generational/succession** → Template 2
2. **If `research_summary` mentions awards/growth/milestones** → Template 3
3. **If the company has a clearly unusual or specialty risk** → Template 4
4. **If the company has WBE/MBE/certification** → Template 5
5. **Default** → Template 1

If multiple templates could apply, combine elements. For example, a family-owned specialty towing company could blend Templates 2 and 4.

## UTM Tracking Convention

Every link in outreach emails gets UTM parameters so we can track engagement in Google Analytics. The convention:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `utm_source` | `cold_outreach` | Identifies traffic from outreach emails |
| `utm_medium` | `email` | Channel type |
| `utm_campaign` | `stage5_apr2026` | Batch identifier — update per stage/month |
| `utm_content` | Template name: `standard`, `family`, `growth`, `specialty`, `wbe` | Which template was used |

**How to build the URL:** Take the base URL and append the parameters:

`https://anvo-insurance.com?utm_source=cold_outreach&utm_medium=email&utm_campaign=stage5_apr2026&utm_content=standard`

When a new batch goes out, update `utm_campaign` to reflect the stage and month (e.g., `stage6_may2026`).

## Signature Block

Use this signature block for all emails. It's HTML — paste verbatim at the end of the HTML body. The "Anvo Insurance" hyperlink carries the UTM tracking; substitute `{{campaign}}` and `{{template}}` before sending to `create_draft`.

The visible layout (logo on the left, text block on the right) comes from a 2-column table. Inline styles only — no external CSS survives Gmail's sanitizer.

**If sender is Edward:**
```html
<div>-- </div>
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.4;">
  <tr>
    <td valign="top" style="padding-right: 14px;">
      <img src="https://anvo-insurance.com/logo.png" alt="Anvo Insurance" width="72" style="display: block; border: 0;">
    </td>
    <td valign="top" style="border-left: 1px solid #d0d0d0; padding-left: 14px;">
      <div style="font-weight: bold; color: #222222; margin-bottom: 2px;">Edward</div>
      <div style="margin-bottom: 8px;">
        <a href="https://anvo-insurance.com?utm_source=cold_outreach&amp;utm_medium=email&amp;utm_campaign={{campaign}}&amp;utm_content={{template}}" style="color: #1a73e8; text-decoration: underline;">Anvo Insurance</a>
      </div>
      <div>Call: <a href="tel:+19138459688" style="color: #1a73e8; text-decoration: underline;">(913) 845-9688</a></div>
      <div style="margin-bottom: 8px;">Text: <a href="tel:+18883788781" style="color: #1a73e8; text-decoration: underline;">+1-888-378-8781</a></div>
      <div style="margin-bottom: 8px;">CA License #4533415 | NY License #PC-1946295</div>
      <div style="font-style: italic; font-size: 11px; color: #888888; line-height: 1.35;">Anvo Insurance is an independent insurance agency compensated by the carriers we represent. Coverage cannot be bound, altered, or canceled via email, fax, or voicemail and is not effective until confirmed directly by a licensed agent or an authorized representative of the applicable carrier. This message may contain confidential information intended solely for the recipient(s). If received in error, please notify the sender and delete immediately.</div>
    </td>
  </tr>
</table>
```

**If sender is Alice:**
```html
<div>-- </div>
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #333333; line-height: 1.4;">
  <tr>
    <td valign="top" style="padding-right: 14px;">
      <img src="https://anvo-insurance.com/logo.png" alt="Anvo Insurance" width="72" style="display: block; border: 0;">
    </td>
    <td valign="top" style="border-left: 1px solid #d0d0d0; padding-left: 14px;">
      <div style="font-weight: bold; color: #222222; margin-bottom: 2px;">Alice</div>
      <div style="margin-bottom: 8px;">
        <a href="https://anvo-insurance.com?utm_source=cold_outreach&amp;utm_medium=email&amp;utm_campaign={{campaign}}&amp;utm_content={{template}}" style="color: #1a73e8; text-decoration: underline;">Anvo Insurance</a>
      </div>
      <div>Call: <a href="tel:+19138459688" style="color: #1a73e8; text-decoration: underline;">(913) 845-9688</a></div>
      <div style="margin-bottom: 8px;">Text: <a href="tel:+18883788781" style="color: #1a73e8; text-decoration: underline;">+1-888-378-8781</a></div>
      <div style="margin-bottom: 8px;">CA License #4533415 | NY License #PC-1946295</div>
      <div style="font-style: italic; font-size: 11px; color: #888888; line-height: 1.35;">Anvo Insurance is an independent insurance agency compensated by the carriers we represent. Coverage cannot be bound, altered, or canceled via email, fax, or voicemail and is not effective until confirmed directly by a licensed agent or an authorized representative of the applicable carrier. This message may contain confidential information intended solely for the recipient(s). If received in error, please notify the sender and delete immediately.</div>
    </td>
  </tr>
</table>
```

**Variable substitution for signature links:**
- `{{campaign}}` = current batch (e.g., `stage5_apr2026`)
- `{{template}}` = template name used for this email: `standard`, `family`, `growth`, `specialty`, or `wbe`
- Leave `&amp;` in the URL as-is — it's the HTML-escaped `&` that browsers will unescape when following the link.

**What the signature does NOT include (by design):**
- No "Best," / "Regards," / closing word — the signature serves as the sign-off. Template bodies end at the CTA question.
- No visible email address — reply-to is set by the Gmail account the draft is created from (`edward@anvoins.com` or `alice@anvo-insurance.com`).
- No raw UTM URL — tracking lives behind the "Anvo Insurance" hyperlink text.
- No job title (previously "Managing Partner" / "Operations Manager") — first name only, matches Edward's signature in the reference image.

## Things to NEVER Do

- Never use "Dear" — always "Hi {{first_name}}"
- Never open with "I hope this email finds you well" or any variant
- Never use "I'm reaching out because" — just get to the point
- Never mention specific premium numbers or savings percentages you can't back up
- Never say "we're the best" or "we're #1" — let the specifics speak
- Never send a template without filling every variable — if data is missing, skip the row
- Never draft an email for a SKIP priority row or a row with RED FLAG / DATA QUALITY ISSUE in notes
