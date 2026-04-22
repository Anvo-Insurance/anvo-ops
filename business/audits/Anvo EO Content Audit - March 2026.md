# Anvo Insurance — E&O Content Audit & Compliance Review

**Website:** genuine-elf-87d1d4.netlify.app
**Date:** March 31, 2026
**Prepared for:** Edward Hsyeh, Managing Partner

> **CONFIDENTIAL — INTERNAL USE ONLY.** This document does not constitute legal advice. Consult a licensed insurance attorney in CA and NY before publishing disclaimer language.

---

## 1. Executive Summary

This audit reviewed all live English-language pages on the Anvo Insurance staging site for content that could create errors & omissions (E&O) liability, and for compliance with California and New York licensing disclosure requirements. Seven pages were reviewed: Homepage, About, Coverages, Hotels & Hospitality, Restaurant Groups, Commercial Fleets, and Food Distribution.

Fifteen findings were identified across three priority tiers:

| Priority | Count | Category |
|---|---|---|
| **P1 — Critical** | 2 | Regulatory non-compliance (CA license number; NY Reg 194 disclosure) |
| **P2 — High** | 9 | Premium price ranges; unsourced statistics; absolute outcome promises |
| **P3 — Moderate** | 4 | Loose language, overstated service commitments, minor phrasing |

---

## 2. CA and NY Licensing Requirements

### 2.1 California — License Number Disclosure

California Insurance Code §1725.5 requires every licensed insurance agent and broker to include their license number on all advertisements and solicitations. A website is an advertisement under California law. The license number must appear on every page — or at minimum in the site-wide footer — so that any California resident viewing any page sees it.

**Since January 1, 2023,** this requirement also applies to email. Every email sent from the agency must include the CA license number in the email signature.

**Required footer format:**
```
CA License No. [YOUR CA LICENSE NUMBER]  |  NY License No. [YOUR NY LICENSE NUMBER]
```

**Action required:** Add your CA and NY license numbers to `footer.njk`. You'll need to provide the actual numbers — they are not in any existing site file.

---

### 2.2 New York — Regulation 194 Compensation Disclosure

New York Insurance Regulation 194 (11 NYCRR Part 30) requires insurance producers to disclose to applicants, at or before the point of application, that they receive compensation from insurers and how that compensation is determined. Applicants must be told they can request more specific information.

The quote form on the Anvo website is the entry point to the application process. A compensation disclosure must appear before or at the point of form submission — either as a note near the form, a checkbox, or a link to a dedicated disclosure page. The current form has no such disclosure.

**Recommended disclosure (near quote form or on /disclosures page):**

> "Anvo Insurance receives compensation from insurance companies in connection with the policies we place. The compensation we receive may vary depending on the insurer, the policy, and the coverage placed. You have the right to request more specific information about the nature and range of compensation we may receive. To request this information, contact us at info@anvo-insurance.com."

**Action required:** Add this disclosure to every page with a quote form and in the footer. Consider a dedicated `/disclosures` page that both the form and footer link to.

---

### 2.3 Recommended Site-Wide Disclaimer

Add this to your `/disclosures` page and link it from the footer:

```
DISCLAIMERS & DISCLOSURES

Coverage descriptions on this website are general summaries for informational purposes
only. Actual coverage is governed exclusively by the terms, conditions, exclusions, and
endorsements of the applicable policy. Not all coverages are available in all states.

Any premium ranges or cost estimates referenced are illustrative examples based on
general industry data and do not represent a quote, commitment, or guarantee of pricing
for any specific account. Your actual premium will depend on underwriting criteria and
is subject to carrier approval.

Statistics and industry data referenced on this website are sourced from publicly
available third-party sources. Anvo Insurance makes no representation as to their
accuracy, completeness, or applicability to any specific situation.

This website does not constitute legal, financial, or risk management advice.

Producer Compensation Disclosure (New York): Anvo Insurance receives compensation from
insurance companies in connection with the policies we place. Compensation may vary by
insurer, policy, and coverage type. You have the right to request specific information
about our compensation. Contact: info@anvo-insurance.com.

CA License No. [INSERT]  |  NY License No. [INSERT]
```

> *Have this disclaimer reviewed by a licensed insurance attorney in CA and NY before publishing.*

---

## 3. Page-by-Page Audit Findings

**Priority key:** `P1` = Fix before launch · `P2` = Fix before paid traffic · `P3` = Fix when time allows

---

### 3.1 Site-Wide Issues

---

#### Finding #1 — P1 | All pages — footer

**Current language:** *(No license number anywhere on the site)*

**Why it's risky:** California Insurance Code §1725.5 requires the CA license number on all advertisements. Every page of the site is an advertisement under California law. This is an active regulatory violation for any California-licensed producer.

**Fix:** Add to `footer.njk` above the copyright line:
```
CA License No. [YOUR NUMBER]  |  NY License No. [YOUR NUMBER]
```

---

#### Finding #2 — P1 | All industry pages — quote form

**Current language:** *(No NY Regulation 194 compensation disclosure near quote form)*

**Why it's risky:** New York Regulation 194 requires producers to disclose compensation from insurers at or before the application stage. The quote form is the application entry point. There is currently no disclosure anywhere on the site.

**Fix:** Add the compensation disclosure from Section 2.2 above the form submit button on every page with a quote form. Also add to `/disclosures` page and link from footer.

---

### 3.2 Homepage

---

#### Finding #3 — P2 | Homepage — hero section

**Current language:** *"We...match your business with the right coverage at the right price."*

**Why it's risky:** Promising both the "right coverage" AND the "right price" simultaneously is an open-ended guarantee. If a client later feels underinsured or overpays at renewal, this sentence can be cited against you.

**Fix:** "We use data and market access to find coverage that fits your operation — and to make sure you're not paying for what you don't need."

---

#### Finding #4 — P2 | Homepage — How It Works, Step 3

**Current language:** *"You're covered."*

**Why it's risky:** Overly definitive. A client who has a claim denied could point to "you're covered" as a representation that all their risks were addressed.

**Fix:** "Review your options, bind your policy, and get your certificates — fast."

---

#### Finding #5 — P3 | Homepage — How It Works, Step 2

**Current language:** *"We shop the market. We match your risk profile against our carrier network to find the best coverage at the best price."*

**Why it's risky:** "Best coverage at the best price" is a dual superlative guarantee. In practice, the best coverage may cost more, and the best price may come with coverage trade-offs.

**Fix:** "We shop our carrier network to find coverage that fits your risk profile and your budget — without gaps."

---

### 3.3 About Page

---

#### Finding #6 — P3 | About — testimonial section

**Current language:** *"Anvo Insurance has helped us improve our business operations, decrease our risk and premium, and increase our margins."*

**Why it's risky:** Testimonials are generally protected as attributed opinion, but this one explicitly claims decreased premiums and increased margins. A prospective client may form an expectation that Anvo will do the same for them.

**Fix:** Keep the testimonial — it's attributed and real. Add a small disclaimer near the testimonials section: *"Results vary by account."*

---

#### Finding #7 — P3 | About — service commitments

**Current language:** *"Deliver certificates same-day" / "Respond within one business day"*

**Why it's risky:** These are contractual-sounding SLA commitments with no carve-outs for carrier delays, volume spikes, or holiday periods.

**Fix:** "typically deliver certificates same-day" and "we aim to respond within one business day."

---

### 3.4 Coverages Page

---

#### Finding #8 — P3 | Coverages — umbrella description

**Current language:** *"When a serious claim exceeds your primary policy, umbrella coverage is the difference between a manageable loss and a catastrophic one."*

**Why it's risky:** This frames umbrella as a guarantee against catastrophic loss. If a client buys umbrella based on this language and still faces a financially catastrophic outcome, this sentence could be cited as a misrepresentation.

**Fix:** "When a serious claim approaches your primary policy limits, umbrella coverage can provide additional protection — helping manage exposures that standard limits alone may not fully address."

---

### 3.5 Hotels & Hospitality Page

---

#### Finding #9 — P2 | Hotels — cyber stat

**Current language:** *"$3.86M average cost of a data breach in the hospitality industry in 2024"*

**Why it's risky:** No source cited. If the number is wrong or misattributed, it undermines credibility.

**Fix:** Add source attribution: "(Source: IBM Cost of a Data Breach Report, 2024)" — and confirm the figure specifically cites hospitality, not the overall industry average.

---

#### Finding #10 — P2 | Hotels — BI coverage description ✅

**Current language:** *"every night a room goes unsold generally represents income that's difficult to recover"*

**Assessment:** The hedge word "generally" is correct. **No change needed.** Flag for awareness only — preserve this pattern.

---

### 3.6 Restaurant Groups Page

---

#### Finding #11 — P2 | Restaurants — kitchen fire stat

**Current language:** *"$165K average insured loss from a commercial kitchen fire...Source: NFPA / insurance industry data"*

**Why it's risky:** "Insurance industry data" is not a citable source. No one can verify it. The NFPA part is legitimate but the hybrid citation looks authoritative without being verifiable.

**Fix:** Either cite a specific NFPA report with the actual dollar figure — or remove the dollar amount entirely: "Commercial kitchen fires carry significant restoration costs, including equipment replacement, structural repairs, and business interruption during the restoration period."

---

#### Finding #12 — P2 | Restaurants — restoration timeline

**Current language:** *"6 weeks typical kitchen restoration timeline after a major fire"*

**Why it's risky:** No source cited. Timelines vary enormously by fire extent, permit timelines, and equipment lead times. Citing "6 weeks" creates a client expectation. If their restoration takes 14 weeks and their BI coverage was structured around a 6-week assumption, this sentence becomes evidence Anvo set the wrong expectation.

**Fix:** "Kitchen restoration following a major fire can take weeks to months, depending on the extent of damage, equipment lead times, and local permitting — making accurate business interruption coverage essential."

---

#### Finding #13 — P2 | Restaurants — "markets others can't access"

**Current language:** *"For hard-to-place groups, have markets others can't access."*

**Why it's risky:** "Can't access" is an absolute competitive claim that can't be proven, and could be read as disparaging competitors.

**Fix:** "For hard-to-place groups, we have access to specialty and E&S markets that many generalist agents don't typically work with."

---

### 3.7 Commercial Fleets Page

---

#### Finding #14 — P2 | Commercial Fleets — nuclear verdict stat

**Current language:** *"$4.7M average nuclear verdict in trucking lawsuits"*

**Why it's risky:** No source cited. This figure likely derives from ATRI research, but without attribution it cannot be verified. Quoting nuclear verdict averages without a source implies a specific risk level that may not apply to the client's fleet.

**Fix:** Add source: "(Source: American Transportation Research Institute, 2023)" — or rephrase: "Trucking lawsuits can result in multi-million dollar verdicts — a risk that has grown significantly in recent years, driven by litigation funding and nuclear verdict trends."

---

#### Finding #15 — P2 | Commercial Fleets — premium ranges

**Current language:** *"For an established carrier with clean safety records, expect $8,000–$14,000 per truck annually."* and *"New ventures and carriers with elevated CSA scores can pay $15,000–$25,000 or more per unit."*

**Why it's risky:** This is the highest E&O exposure on the fleets page. Publishing specific premium ranges creates client anchors. If you quote an established carrier at $18,000/truck, they will cite this page. Premium ranges also vary dramatically by state, cargo type, and carrier appetite — none of which are mentioned.

**Fix:** Remove both ranges entirely. Replace with: "Premiums vary significantly based on fleet size, CSA safety scores, cargo type, states of operation, and claims history. We analyze your SAFER profile before approaching carriers so you understand where your program stands before the first quote arrives."

---

### 3.8 Food Distribution Page

---

#### Finding #16 — P2 | Food Distribution — premium ranges

**Current language:** *"$40,000–$80,000 per year"* (small ops) and *"$120,000–$300,000 or more"* (mid-size with 15+ vehicles)

**Why it's risky:** Same issue as Commercial Fleets #15 — but higher stakes. A prospect who reads "$40K–$80K" and gets quoted $95K for a 4-truck operation will be unhappy and may have grounds to complain.

**Fix:** Remove both dollar ranges. Replace with: "Premiums for food distribution operations vary widely based on fleet size, cargo type, temperature-control requirements, route geography, driver records, and claims history. We build programs around your actual operation — not industry averages."

---

#### Finding #17 — P2 | Food Distribution — unsourced statistics

**Current language:** *"78% of food distributors cite insurance costs as top-3 concern"* and *"3x likelihood of product liability claims vs. general warehouse ops"*

**Why it's risky:** Neither statistic has a source cited. The "3x" claim is a strong comparative assertion that could be challenged easily. If the numbers are inaccurate, they could be characterized as misrepresentations.

**Fix:** Either add accurate, verifiable source attributions — or rephrase without the specific numbers:
- 78% → "Insurance cost is consistently cited as a top operational concern for food distributors."
- 3x → "Food distributors face elevated product liability exposure compared to general warehousing operations, due to the direct link between distributed products and consumer health."

---

## 4. Quick-Fix Summary

| # | Page / Location | Remove / Change | Replace With |
|---|---|---|---|
| 1 | All pages — footer | No license number | `CA License No. [#]  \|  NY License No. [#]` |
| 2 | All quote forms | No NY Reg 194 disclosure | Add compensation disclosure above/below form submit |
| 3 | Homepage — hero | "right coverage at the right price" | "coverage that fits your operation — without paying for what you don't need" |
| 4 | Homepage — Step 3 | "You're covered." | "Bind your policy and get your certificates — fast." |
| 5 | Homepage — Step 2 | "best coverage at the best price" | "coverage that fits your risk profile and your budget" |
| 6 | Hotels — cyber stat | "$3.86M" (no source) | Add: (Source: IBM Cost of a Data Breach Report, 2024) |
| 7 | Restaurants — kitchen fire | "Source: NFPA / insurance industry data" | Cite specific NFPA report or remove dollar figure |
| 8 | Restaurants — restoration | "6 weeks typical restoration timeline" | Remove timeframe; describe variability instead |
| 9 | Restaurants — markets | "markets others can't access" | "markets that many generalist agents don't typically work with" |
| 10 | Comm. Fleets — verdict stat | "$4.7M average nuclear verdict" (no source) | Add ATRI source or rephrase without specific dollar |
| 11 | Comm. Fleets — premiums | "$8K–$14K per truck" / "$15K–$25K" | Remove ranges; describe underwriting factors instead |
| 12 | Food Dist. — premiums | "$40K–$80K" / "$120K–$300K+" | Remove ranges; describe underwriting factors instead |
| 13 | Food Dist. — stats | "78%" and "3x" (no sources) | Add sources or rephrase without specific numbers |
| 14 | About — testimonials | No disclaimer near testimonials | Add: "Results vary by account." |
| 15 | About — service SLAs | "same-day" / "one business day" | "typically same-day" / "usually within one business day" |
| 16 | Coverages — umbrella | "difference between manageable and catastrophic" | "can provide additional protection...that standard limits alone may not fully address" |
| 17 | Hotels — BI description | "generally represents income difficult to recover" | ✅ No change needed — hedge words are correct |

---

## 5. Implementation Checklist

### 5.1 Before Site Goes Live (P1)

You cannot legally launch this site in California without completing these:

- [ ] Obtain CA and NY license numbers and add to `footer.njk`
- [ ] Add NY Regulation 194 producer compensation disclosure to every page with a quote form and in the footer
- [ ] Create `/disclosures` page with the full site-wide disclaimer (see Section 2.3) and link from footer

### 5.2 Before First Paid Traffic (P2)

- [ ] Remove premium dollar ranges from Commercial Fleets and Food Distribution pages
- [ ] Source or remove the $4.7M nuclear verdict stat on Commercial Fleets
- [ ] Source or remove the $47K cargo spoilage stat, 78% and 3x stats on Food Distribution
- [ ] Add IBM source citation to the $3.86M data breach stat on Hotels
- [ ] Fix the NFPA citation on Restaurants (cite specific report or remove dollar figure)
- [ ] Remove the "6 weeks" kitchen restoration timeframe
- [ ] Fix the three homepage language issues (#3, #4, #5)
- [ ] Fix the "markets others can't access" line on Restaurants

### 5.3 Ongoing (P3 & Maintenance)

- [ ] Add "Results vary by account" near testimonials on the About page
- [ ] Soften the service SLA language on About and Contact pages
- [ ] Update the umbrella coverage description on the Coverages page
- [ ] When adding any statistic to any page, confirm the source URL contains the exact claimed figure before publishing — do not cite "industry data" as a source
- [ ] Review and update this audit annually or whenever significant new content is added

### 5.4 Email Signature Requirement (CA)

Update all team email signatures to include:

```
[Name]  |  Anvo Insurance  |  CA License No. [YOUR NUMBER]  |  NY License No. [YOUR NUMBER]
```

### 5.5 What's Working Well

These patterns are correct — preserve them as a model for future content:

- **Hedge words used correctly:** "typically," "often," "generally," "in most cases" appear throughout the industry pages and correctly soften absolute claims.
- **Conditional framing:** "If your GL policy doesn't explicitly include food contamination, assume possible exclusion until confirmed" is exactly the right kind of educational caution.
- **No coverage guarantees:** No page promises that a specific claim will be covered.
- **No carrier names:** Consistent with your E&O content preference.
- **FMCSA federal minimums:** The $750K figure on Commercial Fleets is regulatory fact — correct to state it.

---

## 6. A Note on This Document

*This audit was prepared by an AI assistant based on publicly available regulatory sources including California Insurance Code §1725.5, New York Insurance Regulation 194 (11 NYCRR Part 30), and NY OGC Opinion 03-12-17. It does not constitute legal advice. The analysis reflects the state of regulations as understood in early 2026. Before publishing any disclaimer language or relying on this audit for compliance decisions, consult a licensed insurance attorney in California and New York.*
