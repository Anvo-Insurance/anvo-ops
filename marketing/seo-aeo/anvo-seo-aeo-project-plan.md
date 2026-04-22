# Anvo Insurance — SEO/AEO Project Plan & Context Handoff

## Role
You are an expert in SEO who has become one of the leaders in AEO (Answer Engine Optimization). You are advising Anvo Insurance on SEO and AEO strategy to build a foundation for inbound leads through organic search and AI citation. You know the insurance industry, the competitive landscape, and Anvo's specific positioning.

---

## About Anvo Insurance
- **Legal entity:** Bao's Insurance LLC dba Anvo Insurance
- **Managing Partner:** Edward Hsyeh
- **Location:** Kansas City area (913 area code), also serves NYC market
- **Website:** https://www.anvo-insurance.com (built on Squarespace)
- **Focus:** Commercial insurance brokerage, ~200 accounts
- **Key verticals:** Food distribution/wholesale, restaurants, nail salons, day spas, convenience stores, trucking, contractors, technology/SaaS
- **Differentiators:** Chinese-language service (full zh pages exist), family restaurant background, food industry depth, independent brokerage with 100+ carrier access
- **CA licensing:** Recently approved (expanding beyond MO/KS)

## Website Architecture (Current State — 47 pages indexed)
- **Homepage:** /home (code block with inline HTML/CSS)
- **Industries hub:** /industries (42+ industries listed, ~15 have dedicated pages)
- **Individual industry pages:** /industries/restaurants, /industries/food-distribution, /industries/nail-salons, /industries/day-spa, /industries/trucking-freight, /industries/hotels, /industries/apartment-complexes, /industries/contractors, etc.
- **Coverages:** /coverages (SINGLE page with all 20 coverage types — THIS IS WHAT WE'RE BREAKING OUT)
- **Startups & Tech:** /startups-tech with sub-pages /startups/saas, /startups/fintech, /startups/healthtech
- **Chinese pages:** /zh-home, /zh-food-distribution, /zh-contact
- **Blog/Insights:** /insights (currently 1 post: commercial auto fleet insurance for food distributors)
- **Other:** /about, /contact, /terms, /privacy

## How the Site is Built
- **Platform:** Squarespace
- **Each page is a single code block** (raw HTML/CSS pasted into Squarespace's code block feature)
- **Global styles** are in Design → Custom CSS
- **CSS uses custom variables** defined in :root (--anvo-cream, --anvo-red, --anvo-charcoal, etc.)
- **CSS class system:** .anvo-hero, .anvo-section, .anvo-coverage-card, .anvo-faq-item, .anvo-who-item, etc.
- **Fonts:** DM Serif Display (headings), DM Sans (body), Noto Serif SC + Noto Sans SC (Chinese)
- **Forms submit via Google Apps Script** endpoint to a Google Sheet

## Brand Colors (Updated Palette — just implemented)
- **Dark sections (hero, CTA, footer):** Background #1C1715 (warm near-black, was #2B2B2B)
- **Light sections:** Alternate between #FAF7F2 (cream) and #FFFFFF
- **Cards:** Always #FFFFFF with border-left: 4px solid #C43B2E (red left accent)
- **Red accent (#C43B2E):** Buttons, section labels, card left borders, links, step numbers — NEVER as heading text
- **Hero italic accent:** #E8A49C (light coral) for the italic emphasis text on dark hero
- **Headings on dark:** #FFFFFF
- **Headings on light:** #1C1715
- **Body text on dark:** #E0DBD6 (off-white)
- **Body text on light:** #6B635C (warm gray) or #4A4A4A (charcoal-light)
- **Outline buttons on dark:** border: 2px solid #FFFFFF

---

## Completed Work (Session 1)

### SEO/Indexing Foundation
- [x] Google Search Console verified and sitemap submitted (47 pages discovered)
- [x] Manually requested indexing for top ~10 pages (homepage, restaurants, food-distribution, coverages, about, zh-home, zh-food-distribution, zh-contact, insights blog post)
- [x] Bing Webmaster Tools imported from GSC (enables ChatGPT/Copilot/Perplexity citation)
- [x] Confirmed site was NOT indexed anywhere before today — this is brand new

### Visual/CSS Overhaul
- [x] Diagnosed readability problems (red text on dark backgrounds, invisible cards, dim body text)
- [x] Implemented universal CSS overrides in Custom CSS (palette fix block + Chinese page fix block)
- [x] Fixed Chinese hero buttons (inline style replacement)
- [x] Established design rules: no red heading text, white cards everywhere, red as accent only

### Competitive Analysis Completed
- [x] Deep analysis of Latent Insurance (latentinsure.com) — their AEO strategy, llms.txt files, blog depth, content structure
- [x] Deep analysis of Harper Insure (harperinsure.com) — their 50+ industry pages, coverage pages, blog categories
- [x] Identified Anvo's competitive advantages: food industry depth, Chinese language, KC local market, no one else owns this niche

---

## NEXT TASK: Coverages Page Breakout

### The Problem
Currently /coverages is a SINGLE page with ~20 coverage types listed. This means:
- 1 URL competing for 20 different search terms
- No individual pages for Google/Bing to index for specific coverage queries
- No AEO-ready FAQ content per coverage type
- No internal linking targets for blog posts or industry pages

### The Goal
Break /coverages into 20+ individual pages, each with:
- Its own URL (/coverages/general-liability, /coverages/commercial-auto, etc.)
- AEO-optimized opening paragraph (direct, quotable definition)
- "What it covers" section
- "Who needs it" section with cross-links to relevant industry pages
- "How it works with other coverages" section
- FAQ section (4-6 natural-language Q&As)
- CTA section
- Published/updated date visible
- Then convert /coverages into a visual grid/card hub page linking to all individual pages

### Page List (Priority Order)

**Core 12 (first pass):**
1. /coverages/general-liability
2. /coverages/commercial-auto
3. /coverages/commercial-property
4. /coverages/workers-compensation
5. /coverages/professional-liability
6. /coverages/cyber-liability
7. /coverages/umbrella-excess
8. /coverages/business-owners-policy
9. /coverages/liquor-liability
10. /coverages/cargo-inland-marine
11. /coverages/business-interruption
12. /coverages/product-liability

**Secondary 8 (second pass):**
13. /coverages/epli
14. /coverages/directors-officers
15. /coverages/surety-bonds
16. /coverages/pollution-liability
17. /coverages/garage-garagekeepers
18. /coverages/crime-fidelity
19. /coverages/homeowners
20. /coverages/personal-auto

### Template Structure (Each Page)
Each coverage page should follow the same structure as the restaurant industry page (/industries/restaurants), which is the strongest existing page. The template:

1. **Hero + Definition** — H1 with coverage name + 2-3 sentence direct answer paragraph (AEO gold)
2. **Inline lead capture form** (same form component used on industry pages)
3. **What It Covers** — 4-6 specific things, with real detail
4. **Who Needs It** — 3-5 business types with cross-links to industry pages
5. **How It Works With Other Coverages** — 2-3 sentences on interaction
6. **FAQ Section** — 4-6 Q&As using the .anvo-faq-item component
7. **Bottom CTA** — Quote form or link
8. **Published/Updated date** — Visible at bottom: "Last updated: March 2026"

### Deliverable Needed
Draft full HTML/CSS code for 2-3 model coverage pages (General Liability, Commercial Auto, Workers' Comp) that Edward can replicate across all 20. Code should:
- Use the existing .anvo-* CSS class system
- Follow the updated color palette (white cards, no red headings, etc.)
- Match the structure of /industries/restaurants
- Include the form component with the Google Apps Script endpoint
- Be ready to paste directly into Squarespace code blocks

Also draft the new /coverages hub page as a visual grid/card layout linking to all individual coverage pages.

---

## Future Tasks (After Coverages Breakout)

### Priority 2: llms.txt Drafting
- Create /llms.txt (brief site summary) and /llms-full.txt (full content of best pages)
- Squarespace hosting workaround needed (can't host .txt at root natively)
- Content becomes much more valuable after coverages pages exist

### Priority 3: Blog Content Engine
- Deep posts (2,000-4,000 words) targeting food industry vertical
- First 3 posts suggested:
  1. "Restaurant Insurance in Kansas City: What KC Restaurant Owners Need to Know" (local SEO + AEO)
  2. "How Much Does Restaurant Insurance Cost in 2026?" (high search volume)
  3. Chinese-language version of one of these for /zh section
- Follow Latent's model: FAQ sections, data citations, internal cross-links, published/updated dates

### Priority 4: Schema Markup
- FAQPage schema on every page with FAQ sections
- LocalBusiness schema sitewide (KC address, phone, service areas)
- InsuranceAgency / Organization schema on about page
- hreflang tags connecting English and Chinese page pairs

### Priority 5: Additional Optimizations
- Video strategy (GSC showed 0 videos — opportunity for AEO)
- Add published/updated dates to all existing pages
- Chinese-language industry pages (zh-restaurants, zh-nail-salons, etc.)
- Google Business Profile optimization
- Backlink strategy

---

## Key Competitive Intelligence

### Latent Insurance (latentinsure.com)
- CA-based independent brokerage, targets med spas, restaurants, tech/AI companies
- **AEO strategy:** llms.txt + llms-full.txt files, 3,000-7,000 word blog posts with FAQ sections, published/updated dates, dense internal cross-linking, cited sources (FDA, CDC, PMC)
- **Weakness:** No local presence outside SF, no multilingual content, no food distribution specialty

### Harper Insure (harperinsure.com)
- $47M funded AI-native brokerage
- **SEO strategy:** 50+ industry landing pages, coverage-type pages as separate URLs, blog split into Engineering + Insurance Insights
- **Weakness:** Templated/repetitive content, zero deep blog posts answering specific questions, zero Chinese content, zero local KC content

### Anvo's Moat
- Nobody else produces Chinese-language commercial insurance content for the US market at this depth
- Nobody else combines food industry expertise + KC local + multilingual in one brokerage
- First-mover advantage on AEO in this niche — when someone asks AI "What insurance does a Chinese restaurant in Kansas City need?" there should be exactly one authoritative source

---

## Internal Linking & Citation Strategy

### Why This Matters for AEO
AI models build a "knowledge graph" of your site by following links. Isolated pages = weak signal. Densely interconnected pages = strong authority signal. When Claude, ChatGPT, or Perplexity crawls your site and sees that your restaurant page links to liquor liability, which links to bars & nightclubs, which links back to restaurants — it interprets Anvo as a deeply knowledgeable source on the entire restaurant insurance ecosystem. This is exactly what Latent does (every post links to 3-5 related posts) and what Harper does NOT do (their pages are isolated).

External citations (linking to real data sources) tell AI models that your claims are research-backed and verifiable. AI models are trained to prefer sources that cite evidence over sources that make unsupported assertions. A page that says "kitchen fires cost $1M+ on average (NFPA, 2024)" is far more likely to be cited by AI than one that just says "kitchen fires are expensive."

### Internal Linking Rules (Apply to Every Page)

**Rule 1: Every coverage page links to 3-5 industry pages that need that coverage.**
Example: /coverages/liquor-liability should link to:
- /industries/restaurants
- /industries/bars-nightclubs
- /industries/hotels
- /industries/food-trucks (if they serve alcohol at events)

**Rule 2: Every industry page links to 4-6 coverage pages that the industry needs.**
Example: /industries/restaurants should link to:
- /coverages/general-liability
- /coverages/liquor-liability
- /coverages/commercial-property
- /coverages/workers-compensation
- /coverages/business-interruption
- /coverages/umbrella-excess

**Rule 3: Every page links to at least 1 related blog post (once blog posts exist).**
Example: /industries/restaurants links to "How Much Does Restaurant Insurance Cost in 2026?"

**Rule 4: Every page links back to the parent hub.**
- Coverage pages → /coverages hub
- Industry pages → /industries hub

**Rule 5: Chinese pages link to their English equivalents and vice versa.**
- /zh-home ↔ / (homepage)
- /zh-food-distribution ↔ /industries/food-distribution

**Rule 6: Use natural anchor text, not "click here."**
- Good: "Restaurants serving alcohol need [liquor liability coverage](/coverages/liquor-liability) to protect against..."
- Bad: "For more info on liquor liability, [click here](/coverages/liquor-liability)"
- AI models use anchor text to understand what the linked page is about. Descriptive anchors = stronger signal.

### Internal Linking Map (Coverage → Industry)

| Coverage Page | Links TO These Industry Pages |
|---|---|
| General Liability | Restaurants, Contractors, Retail, Hotels, All (foundation for every business) |
| Commercial Auto | Food Distribution, Trucking, Contractors, Delivery operations |
| Commercial Property | Restaurants, Hotels, Retail/Convenience Stores, Apartment Complexes |
| Workers' Comp | Restaurants (kitchen injuries), Contractors (falls), Manufacturing, Trucking |
| Professional Liability/E&O | Technology/SaaS, Accounting/CPA, Consulting, Real Estate Agents |
| Cyber Liability | Technology/SaaS, E-Commerce, Medical Offices, Any business with customer data |
| Liquor Liability | Restaurants, Bars & Nightclubs, Hotels, Food Trucks (events) |
| Umbrella/Excess | All industries — especially restaurants, contractors, trucking (high-exposure) |
| Business Interruption | Restaurants (kitchen fires), Hotels, Retail, Manufacturing |
| Cargo/Inland Marine | Food Distribution, Trucking, Moving Companies |
| Product Liability | Food Manufacturing, E-Commerce, Retail, Bakeries |
| BOP | Small restaurants, retail storefronts, professional services, nail salons |
| EPLI | Any business with employees — restaurants, hotels, medical offices |
| D&O | Technology/SaaS, Fintech, any company with investors or board |
| Surety Bonds | Contractors, Auto Dealers, Trucking (DOT bonds) |
| Garage/Garagekeepers | Auto Repair, Used Car Dealers, Towing |

### External Citation Sources (Use These for Data Points)

**Government & Regulatory:**
- NFPA (National Fire Protection Association) — restaurant fire data, commercial property fire statistics
- OSHA — workplace injury rates by industry, workers' comp data
- FMCSA — trucking safety data, DOT compliance stats
- FDA — food safety regulations, recall data
- SBA (Small Business Administration) — small business statistics, failure rates
- Bureau of Labor Statistics — industry employment data, injury rates by sector
- State DOI (Department of Insurance) — state-specific requirements, minimum limits

**Industry Associations:**
- National Restaurant Association — restaurant industry statistics, revenue data
- American Trucking Association — freight industry data
- Associated General Contractors of America — construction industry stats
- Professional Beauty Association — salon/spa industry data

**Insurance Industry:**
- NAIC (National Association of Insurance Commissioners) — insurance market data
- Insurance Information Institute (III) — claims data, cost statistics, industry trends
- AM Best — carrier ratings (when mentioning carrier partnerships)
- IRMI (International Risk Management Institute) — coverage definitions, technical reference

**Legal/Claims Data:**
- Jury Verdict Reporter — average verdicts by claim type
- Nuclear Verdicts research — trucking industry verdict trends
- State court records — for specific case examples

### Citation Format for AEO
When citing data on your pages, use this format:
- Inline: "Restaurant fires cause an average of $1.2M in damage per incident (NFPA, 2024)"
- Link the source name to the actual report/page when possible
- For FAQ answers, include the source naturally: "According to the Bureau of Labor Statistics, restaurant workers experience injury rates 40% above the national average."
- Don't over-cite — 2-4 citations per page section is ideal. More than that reads like an academic paper, not a business page.

### Retrofit Plan for Existing Pages
After the coverages breakout is complete, do a systematic pass through existing industry pages to add:
1. Internal links to the new coverage pages (biggest impact)
2. Internal links between related industry pages
3. External citations for any uncited statistics or claims
4. Cross-links to Chinese equivalents where they exist

Priority order for retrofit:
1. /industries/restaurants (strongest page, most to link to)
2. /industries/food-distribution (core vertical)
3. /industries/nail-salons (high-traffic niche)
4. Homepage (add links to top coverage + industry pages)
5. All remaining industry pages

---

## Keyword & Question Research Process (Cowork-Ready)

### Purpose
Before writing any page (coverage page, industry page, or blog post), research what questions real people are actually asking about that topic. This ensures every piece of content is built around real demand, not guesses. This process works for both English and Chinese content.

### The Process (Step by Step)

**Step 1: Google "People Also Ask" Mining (Free, 5 min per topic)**

Search Google for your target topic. Example: "restaurant insurance"

Look at two things:
- **"People Also Ask" box** — Google shows 4-6 related questions. Click each one to reveal more (they expand infinitely). Capture 15-20 questions per topic.
- **"Related searches"** at the bottom of the page — these are additional query variations.

Do this for 3-5 variations of the query:
- "restaurant insurance"
- "restaurant insurance cost"
- "what insurance does a restaurant need"
- "restaurant liability insurance"
- "restaurant insurance Kansas City"

Collect all PAA questions into a spreadsheet. These become your FAQ sections and blog post topics.

**Step 2: AlsoAsked.com (Free tier: 3 searches/day)**

Go to alsoasked.com, enter your seed keyword (e.g., "food distributor insurance"), and select United States as the region. The tool shows a branching tree of People Also Ask questions — how questions relate to each other and what follow-up questions people ask after the first one. This is gold for structuring FAQ sections because it shows the natural flow of questions.

Export the results. These questions map directly to your FAQ sections and content structure.

**Step 3: AnswerThePublic (Free tier: 3 searches/day)**

Go to answerthepublic.com, enter your keyword, select United States. It generates questions organized by who/what/when/where/why/how, plus prepositions (with, without, for, near) and comparisons (vs, or, like). This gives you question formats you wouldn't think of on your own.

Example output for "restaurant insurance":
- Why is restaurant insurance so expensive?
- What restaurant insurance covers grease fires?
- Restaurant insurance vs food truck insurance
- Restaurant insurance for new restaurants
- Restaurant insurance without liquor license

**Step 4: Reddit & Forum Mining (Free, 10 min per topic)**

Search Reddit for real conversations:
- Google: `site:reddit.com "restaurant insurance"`
- Google: `site:reddit.com "food distributor insurance"`
- Also try: `site:reddit.com "commercial insurance" restaurant`

Read the actual threads. Reddit reveals pain points, frustrations, and questions that don't show up in SEO tools because they're phrased conversationally. These are the exact queries people will ask AI chatbots.

Key subreddits for insurance questions:
- r/smallbusiness
- r/Insurance
- r/restaurateur
- r/Truckers (for trucking/freight)
- r/Contractors

**Step 5: Google Search Console Data (Ongoing)**

Once you have traffic, GSC's "Queries" report shows what people actually searched to find your pages. This is the most valuable data because it's real demand hitting your real site. Check weekly.

**Step 6: Competitor Content Gap Analysis**

For each topic, check what Latent and Harper have written:
- Search: `site:latentinsure.com [topic]`
- Search: `site:harperinsure.com [topic]`
- Look at their FAQ sections specifically — what questions are they answering that you aren't?
- Look for questions they DON'T answer — those are your content gaps to own.

### Chinese-Language Research Process

**Important context:** Your Chinese content targets Chinese-speaking business owners IN THE US, not users in China. This means they're searching on Google (not Baidu), but in Chinese characters. The research approach is different from China-market SEO.

**Step 1: Google PAA Mining in Chinese**

Search Google (not Baidu) for Chinese-language queries. Examples:
- "餐厅保险" (restaurant insurance)
- "商业保险 餐馆" (commercial insurance restaurant)
- "食品配送保险" (food distribution insurance)
- "美甲店保险" (nail salon insurance)
- "华人商业保险" (Chinese business insurance)
- "小企业保险 美国" (small business insurance USA)

Capture the People Also Ask results (they'll appear in Chinese). These are what Chinese-speaking Americans are actually asking Google.

**Step 2: Google Autocomplete in Chinese**

Start typing Chinese queries in Google and see what autocomplete suggests. Examples:
- Type "餐馆保险" and see what Google suggests
- Type "商业保险怎么" and see completions (怎么买, 怎么选, etc.)
- Type "食品批发保险" and see completions

These reveal the natural phrasing Chinese speakers use when searching.

**Step 3: Chinese-Language Forum Mining**

Search for Chinese-language discussions about insurance in the US:
- Google: "商业保险" site:huaren.us (popular Chinese-American forum)
- Google: "保险" site:mitbbs.com (Chinese-American community)
- Google: "餐馆保险" site:1point3acres.com (Chinese professional community)
- WeChat article search (if accessible): "美国商业保险"

These forums reveal the actual vocabulary, concerns, and pain points of Chinese-speaking business owners in America — which is your exact target audience.

**Step 4: Bilingual Keyword Mapping**

For each English keyword you target, create a Chinese equivalent:

| English Query | Chinese Query | Notes |
|---|---|---|
| restaurant insurance | 餐厅保险 / 餐馆保险 | Both variants used |
| food distributor insurance | 食品配送保险 / 食品批发保险 | 批发 = wholesale |
| general liability insurance | 一般责任保险 / 普通责任险 | Multiple translations |
| workers compensation | 工人赔偿保险 / 工伤保险 | 工伤 more colloquial |
| liquor liability | 酒类责任保险 | Less commonly searched |
| commercial auto insurance | 商业汽车保险 | Straightforward |
| nail salon insurance | 美甲店保险 | Direct translation works |

This mapping ensures your Chinese pages target the right terms, not awkward translations.

### How to Use This Research in Content Creation

**For coverage pages:**
1. Run Steps 1-3 for the coverage type (e.g., "general liability insurance")
2. Use the top 4-6 questions as your FAQ section
3. Use the question themes to structure your "What It Covers" and "Who Needs It" sections
4. Note any questions competitors answer that you should too

**For industry pages:**
1. Run Steps 1-4 for the industry + insurance combination (e.g., "restaurant insurance")
2. Use the top 6-8 questions for your FAQ
3. Use Reddit pain points for your "Why you need a specialist" section
4. Cross-reference with competitor pages for gap opportunities

**For blog posts:**
1. Run the full process (all 6 steps)
2. Pick one high-demand question as the blog post title
3. Use related questions as H2/H3 subheadings
4. Answer each question directly in the first sentence (AEO optimization)
5. Cite sources for any data claims

### Cowork Automation Potential

This process can be partially automated via Cowork:
- **Automate Steps 1, 2, 3:** Have Cowork run the Google PAA, AlsoAsked, and AnswerThePublic searches for a batch of keywords and compile results into a spreadsheet
- **Automate Step 6:** Have Cowork search competitor sites for each topic and extract their FAQ questions
- **Manual steps:** Reddit mining (Step 4) and Chinese forum mining (Step 3 of Chinese process) require human judgment to evaluate quality and relevance
- **Output format:** For each topic, Cowork produces a "Content Brief" with: seed keyword, 15-20 PAA questions, top competitor questions, Reddit insights, and recommended FAQ list

### Recommended Tools Summary

| Tool | Cost | Best For | Language Support |
|---|---|---|---|
| Google PAA (manual) | Free | Real question discovery | English + Chinese |
| AlsoAsked.com | Free (3/day) or $12/mo | Question branching/hierarchy | English (limited Chinese) |
| AnswerThePublic | Free (3/day) or $11/mo | Question format variations | English primarily |
| Google Autocomplete | Free | Natural phrasing discovery | English + Chinese |
| Reddit search | Free | Real pain points/conversations | English |
| Huaren.us / 1point3acres | Free | Chinese-American community insights | Chinese |
| Google Search Console | Free | Actual search data for YOUR site | All languages |
| QuestionDB | Free tier available | Reddit + Quora question mining | English |
| KeywordsPeopleUse | Free tier available | PAA + Reddit + clustering | English |
