# Carrier Appetite Condensation Template

## Instructions for Claude / Cowork

You are reading a carrier appetite guide PDF. Your job is to extract ONLY the decision-relevant information a commercial insurance broker needs to determine:
1. Whether this carrier is a fit for a given account
2. What lines of coverage are available
3. What size/type of business they target
4. What they absolutely won't write
5. How to submit and what to expect

**Rules:**
- Strip all marketing language, testimonials, and sales copy
- Focus on COMMERCIAL lines. If the guide covers personal lines, summarize briefly but don't give it equal weight
- When the guide lists specific classes/industries, INCLUDE THEM — class-level detail is the most valuable data
- When the guide gives numeric thresholds (max sqft, max revenue, max payroll, max vehicles), ALWAYS capture these
- Note state availability if mentioned
- If the guide is vague on something important, say "NOT SPECIFIED IN GUIDE — verify with UW"

## Output Format (one entry per carrier)

```
## [Carrier Name]
**AM Best Rating:** [if mentioned]
**Carrier type:** [Standard / E&S / Wholesale / MGA / Specialty]
**Primary lines offered:** [list all commercial lines: BOP, GL, WC, Commercial Auto, Umbrella, Professional Liability, EPLI, D&O, Cyber, Inland Marine, etc.]
**Geographic availability:** [nationwide / specific states / regional]

### Target Market
**Business size sweet spot:** [revenue range, employee count, premium range if mentioned]
**New ventures:** [Yes/No/Limited]

### Industry Appetite — Classes Written
Organize by industry category. Include ALL specific classes mentioned in the guide.

**Restaurants & Food Service:**
- [list specific classes: fast food, fine dining, bars, bakeries, coffee shops, catering, food trucks, etc.]
- [note any sub-restrictions: no 24-hr ops, no liquor-only, max sqft, etc.]

**Retail & Wholesale:**
- [list classes]

**Professional Services / Offices:**
- [list classes]

**Contractors & Construction:**
- [list classes]

**Healthcare & Medical:**
- [list classes]

**Manufacturing:**
- [list classes]

**Technology:**
- [list classes]

**Real Estate & Habitational:**
- [list classes]

**Other Industries:**
- [list any additional classes not covered above]

### Eligibility Parameters
| Parameter | Value |
|-----------|-------|
| Max property value per location | $ |
| Max annual revenue/receipts | $ |
| Max annual payroll (WC) | $ |
| Max square footage | |
| Max number of vehicles (auto) | |
| Max number of locations | |
| Building age requirements | |
| Owner experience requirements | |
| Loss history requirements | |

### Hard Declines — Will NOT Write
- [list specific classes, industries, or risk characteristics they explicitly exclude]
- [e.g., "24-hour operations", "bars with >50% liquor revenue", "cannabis-related", etc.]

### Bundling & Multi-Line Advantages
- [discounts for packaging lines together]
- [which line combinations are incentivized]

### Submission Process
- **Portal/method:** [online portal name, email submission, via SIAA AccessPlus, etc.]
- **Turnaround:** [same-day, 24hrs, 48hrs, etc.]
- **Bind authority:** [can agent bind online, or needs UW approval]
- **Key contact / notes:** [if relevant]

### Anvo-Specific Notes
- [Edward adds notes here from broker experience, UW conversations, and placement history]
- [e.g., "Hartford UW Jane Smith is responsive and flexible on restaurant class codes"]
- [e.g., "Auto-Owners consistently beats Hartford on commercial property pricing in KC metro"]
- [e.g., "This carrier quietly declines sushi restaurants in MO even though guide says they write them"]
```

## Quality Checklist
After producing each entry, verify:
- [ ] All numeric thresholds captured (sqft, revenue, payroll, vehicles)
- [ ] All specific classes listed (not summarized as "and more")
- [ ] Hard declines explicitly listed
- [ ] Submission process documented
- [ ] "Anvo-Specific Notes" section left blank for Edward to fill in
- [ ] No marketing fluff — every sentence is decision-relevant
