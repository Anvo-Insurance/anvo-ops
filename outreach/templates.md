# Cold Email Templates

Templates for cold outreach to commercial insurance prospects. Used by Alice's (or Edward's) Cowork session to generate Gmail drafts from prospect CSVs in this folder. See `workflow.md` for the end-to-end process and `README.md` for CSV schema.

## How to Use These Templates

1. **Select the template** that best fits the prospect's `segment` and situation.
2. **Fill all `{{variables}}`** using data from the CSV row.
3. **Customize the value prop hook** — do NOT use a generic insurance pitch. Tailor it to the prospect's specific risk profile based on their `research_summary` and `segment`. See the value prop guidance section below.
4. **Keep it short** — 4-6 sentences max for the body. These are busy business owners.
5. **Subject line** — use the `subject_line` from the CSV. If blank, write one that references something specific about the company (not "Insurance quote for {{company}}").
6. **Sender** — the email goes from whoever's Cowork is drafting it (alice@anvo-insurance.com or edward@anvo-insurance.com).

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

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_email}}
{{sender_phone}}
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

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_email}}
{{sender_phone}}
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

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_email}}
{{sender_phone}}
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

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_email}}
{{sender_phone}}
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

Best,
{{sender_name}}
{{sender_title}}
Anvo Insurance
{{sender_email}}
{{sender_phone}}
```

## Template Selection Logic

When drafting, select the template that best matches the prospect. Use this priority:

1. **If `research_summary` mentions family/generational/succession** → Template 2
2. **If `research_summary` mentions awards/growth/milestones** → Template 3
3. **If the company has a clearly unusual or specialty risk** → Template 4
4. **If the company has WBE/MBE/certification** → Template 5
5. **Default** → Template 1

If multiple templates could apply, combine elements. For example, a family-owned specialty towing company could blend Templates 2 and 4.

## Signature Block

Use this signature block for all emails:

**If sender is Alice:**
```
Alice Hsyeh
Operations Manager
Anvo Insurance
alice@anvo-insurance.com
<!-- TODO: Alice's phone number -->
```

**If sender is Edward:**
```
Edward Hsyeh
Managing Partner
Anvo Insurance
edward@anvo-insurance.com
<!-- TODO: Edward's phone number -->
```

## Things to NEVER Do

- Never use "Dear" — always "Hi {{first_name}}"
- Never open with "I hope this email finds you well" or any variant
- Never use "I'm reaching out because" — just get to the point
- Never mention specific premium numbers or savings percentages you can't back up
- Never say "we're the best" or "we're #1" — let the specifics speak
- Never send a template without filling every variable — if data is missing, skip the row
- Never draft an email for a SKIP priority row or a row with RED FLAG / DATA QUALITY ISSUE in notes
