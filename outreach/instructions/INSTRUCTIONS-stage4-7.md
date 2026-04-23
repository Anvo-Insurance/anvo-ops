# Anvo Insurance — Stages 4–7 Agent Instructions

> **Purpose:** These instructions tell a Claude Cowork agent how to take Stage 3 results (revealed contacts) and run them through Stages 4–7: Contact-Level Scoring → Deep Research & Email Drafting → Inbox Monitoring → Style Learning.
>
> **Owner:** Edward — Managing Partner, Anvo Insurance
> **Created:** April 5, 2026
> **Companion file:** `INSTRUCTIONS-v5.md` (master pipeline reference — carrier routing tables, scoring criteria, industry multipliers live there)

---

## Quick Start — What to Do First

Every session, before doing anything else:

1. **Read `nightly-run-state.json`** — understand where the pipeline stands.
2. **Read `stage3_results.csv`** — this is your input. These are the revealed contacts ready for processing.
3. **Read the Style Guide** (if it exists) — search Google Drive for "Anvo Prospecting Style Guide (AI-Generated)". If found, load it before drafting any emails (Stages 5 & 6).
4. **Check which contacts have already been scored/emailed** — read `stage4_scored.csv` and `stage5_outreach_log.csv` (if they exist) to avoid duplicate work.
5. **Read `INSTRUCTIONS-v5.md`** Sections: "Carrier Routing Table (by Segment)" and "Scoring Criteria" — you need the carrier tables and industry multipliers for Stage 4 scoring. Do not skip this step.

---

## About Anvo Insurance

- Independent commercial insurance agency based in Kansas City, SIAA/MIAA member
- Licensed in Kansas and Missouri
- Carrier appointments: Hartford, Travelers, Nationwide, Liberty Mutual, CNA, GUARD, AmTrust, Progressive, UFG, Columbia, and others
- Wholesale access: Burns & Wilcox, RPS, Cochrane & Company, CRC Group
- **Key differentiators:** Mandarin-language capability, proactive coverage gap identification, multi-industry expertise
- **Target verticals:** Construction, Transportation/Logistics, Manufacturing (Tier 1); Food/Hospitality, Automotive, Retail/Wholesale (Tier 2); Nonprofit, Religious (Tier 3)
- **Sweet spot:** Commercial accounts $5,000–$50,000+ estimated annual premium. Accounts under $3,000 generally not worth pursuing unless clear cross-sell path exists.
- **Send-from email for cold outreach:** edward@anvoins.com (secondary domain, warmed up). This protects the primary domain (anvo-insurance.com) from deliverability risk.
- **Send-from email for warm replies:** edward@anvo-insurance.com (primary). Once a prospect responds, switch to the primary domain for the ongoing conversation.
- **Gmail MCP connection:** Connected to edward@anvoins.com for cold outreach drafts and Stage 6 inbox monitoring.

---

## Tools You Need

| Tool | Used In | Purpose |
|------|---------|---------|
| **WebSearch / WebFetch** | Stages 4, 5 | Company and person research |
| **Claude in Chrome** | Stage 5 | LinkedIn research (requires login) |
| **Gmail MCP** (`gmail_create_draft`, `gmail_search_messages`, `gmail_read_message`, `gmail_read_thread`) | Stages 5, 6, 7 | Create email drafts, monitor inbox, read sent emails |
| **Google Drive MCP** (`google_drive_search`, `google_drive_fetch`) | Stage 7 | Read/update the style guide |
| **Read / Write / Edit** | All | Read input files, write output files |

If any tool is unavailable at session start, alert Edward before proceeding.

---

## File Map

### Input Files (read-only — do not modify these)

| File | Description |
|------|-------------|
| `stage3_results.csv` | Revealed contacts from Apollo. Columns: `rank,company,contact_name,title,email,phone,city,state,tier,segment,reveal_status,skip_reason,apollo_employees,revenue` |
| `INSTRUCTIONS-v5.md` | Master reference — carrier routing tables, scoring criteria, industry multipliers. **Read the relevant sections before scoring.** |
| `nightly-run-state.json` | Pipeline state tracker. Read at session start to understand context. |
| `reports/pipeline-learnings.json` | Accumulated operational learnings. Read if you encounter issues. |

### Output Files (you create and maintain these)

| File | Description |
|------|-------------|
| `stage4_scored.csv` | Contact-level scored prospects. Created/appended by Stage 4. |
| `stage5_outreach_log.csv` | Log of all researched prospects and drafted emails. Created/appended by Stage 5. |
| `stage6_reply_log.csv` | Log of inbox replies and drafted responses. Created/appended by Stage 6. |

### State Tracking

After each session, update `nightly-run-state.json` with:
- How many contacts were scored (Stage 4)
- How many emails were drafted (Stage 5)
- Any pending work for next session

---

## STAGE 4: Contact-Level Scoring

### Purpose

Take each revealed contact from `stage3_results.csv` and produce a fully scored prospect with priority tier, premium estimate, coverage needs, carrier recommendation, and opening angle — ready for outreach.

### Input

Read `stage3_results.csv`. Process only rows where:
- `reveal_status` = `REVEALED`
- `email` is not empty
- The contact has NOT already been scored (check `stage4_scored.csv` if it exists)

Skip rows where `reveal_status` = `SKIPPED` or email is blank — these contacts cannot receive outreach.

### Scoring Process

For each contact, score the company 1–5 on four dimensions. **Read the full scoring criteria from INSTRUCTIONS-v5.md** — what follows is a summary.

#### Step 1 — Identify the Segment

Determine which industry segment the company belongs to using the `segment` column from stage3_results.csv. This determines which multipliers, carrier routing, and research checklist to use. The segments are:
- Construction
- Transport/Logistics
- Manufacturing
- Food/Hospitality
- Automotive
- Retail/Wholesale
- Nonprofit
- Religious

#### Step 2 — Web Research

**Before scoring, research the company online.** Visit their website and check the segment-specific research checklist from INSTRUCTIONS-v5.md (Section "Industry-Specific Web Research Protocol"). If the website is down or returns 403/404, search for the company on BBB, Yelp, Google Maps, and industry directories.

Key things to find:
- Actual services/operations (confirms or corrects the segment tag)
- Evidence of size: number of locations, fleet photos, hiring pages, project portfolio
- Ownership structure (family-owned? Chinese-owned? → Mandarin capability angle)
- Recent news: expansions, awards, new locations, new hires
- Any red flags: lawsuits, closures, negative press

If web research is NOT available, apply the headcount multiplier from Apollo data and note: "Estimated from Apollo data — website research recommended before outreach."

#### Step 3 — Apply Industry Multiplier

Use the multiplier table from INSTRUCTIONS-v5.md to estimate actual staff from Apollo's `apollo_employees` count:

| Segment | Multiplier |
|---------|------------|
| Construction — Artisan/Trades | ×1.5–2 |
| Construction — GC with subs | ×2–3 |
| Transportation/Logistics | ×1–1.5 |
| Manufacturing | ×1–1.5 |
| Food/Hospitality — Full-service | ×4–5 |
| Food/Hospitality — Bar/brewery | ×3–4 |
| Food/Hospitality — Bakery/cafe | ×2–3 |
| Food/Hospitality — Catering/truck | ×2 |
| Food/Hospitality — Distributor | ×1.5–2 |
| Automotive | ×1.5–2 |
| Retail/Wholesale | ×1.5–2 |
| Nonprofit | ×1–1.5 |
| Religious | ×0.5–1 |

#### Step 4 — Score Four Dimensions (1–5 each)

1. **Premium Potential (weight: 40%)** — Estimate annual premium based on adjusted employee count, industry exposure drivers, locations, revenue, and fleet/vehicle needs.

2. **Anvo Fit (weight: 25%)** — How well does this account match Anvo's carrier appointments, expertise, and differentiators? Mandarin capability, construction/transport expertise, coverage gap identification.

3. **Accessibility (weight: 20%)** — How reachable is the decision-maker? Do we have a direct email? A title that suggests they make insurance decisions? A phone number?

4. **Underserved Likelihood (weight: 15%)** — Is this business likely underinsured or poorly served by their current broker? Indicators: small/mid-size in a complex industry, no apparent broker relationship, generic website with no insurance mentions, rapid growth.

**Overall Score** = (Premium × 0.40) + (Fit × 0.25) + (Accessibility × 0.20) + (Underserved × 0.15)

#### Step 5 — Assign Priority

| Score Range | Priority | Action |
|-------------|----------|--------|
| 4.0–5.0 | HIGH | Stage 5 immediately |
| 3.0–3.9 | MEDIUM | Stage 5 in next batch |
| 2.0–2.9 | LOW | Hold — revisit if HIGH/MEDIUM pipeline thins |
| Below 2.0 | SKIP | Do not outreach |

#### Step 6 — Carrier Recommendation

**Read the Carrier Routing Table from INSTRUCTIONS-v5.md** for the prospect's segment. Recommend a starting carrier based on the prospect's specific characteristics. Key rules:
- Never recommend a carrier for a class they decline
- Note specific restrictions (e.g., Travelers declines GCs, Columbia requires 2+ years)
- For accounts outside standard market appetite, recommend wholesale (Burns & Wilcox, CRC Group, RPS, Cochrane)
- Don't mention specific carriers in outreach emails — this is internal routing info only

#### Step 7 — Opening Angle

Write one sentence describing what you'd lead with in outreach. This must be specific to THIS business — not generic. Examples:
- "Fleet expansion visible on website — commercial auto review angle"
- "Chinese-owned restaurant — lead with Mandarin capability"
- "Growing GC with active hiring page — WC exposure likely underestimated"
- "Nonprofit with board listed but no D&O mentioned — coverage gap angle"

### Stage 4 Output

Write results to `stage4_scored.csv` with these columns:

```
rank,priority,overall_score,tier,company,contact,title,email,phone,city,state,segment,apollo_employees,multiplier,est_actual_staff,premium_potential,anvo_fit,accessibility,underserved,coverage_needs,carrier,opening_angle,notes
```

**Sort by overall_score descending.**

After each batch, provide Edward a summary in chat:
- Count of HIGH / MEDIUM / LOW / SKIP
- Top 5 prospects with one sentence each
- Any red flags or data quality issues found
- Any segment mismatches caught (e.g., pest control tagged as "contractor")

### Batch Size

Process **20–25 contacts per session** for Stage 4. This allows enough time for web research on each company without running out of context. If a session has capacity after Stage 4, proceed to Stage 5 for the HIGH-priority contacts from that batch.

---

## STAGE 5: Deep Research & Email Drafting

### Purpose

For each scored prospect with a HIGH or MEDIUM priority and a valid email, conduct deep personal and business research, then draft a personalized cold email as a Gmail draft for Edward to review.

### Input

Read `stage4_scored.csv`. Process contacts where:
- `priority` = HIGH (first) or MEDIUM (second)
- `email` is present and not a generic address (info@, contact@, sales@ are deprioritized — still draft but flag)
- The contact has NOT already been emailed (check `stage5_outreach_log.csv`)

### Step 1 — Check the Style Guide

Before drafting ANY email, search Google Drive for "Anvo Prospecting Style Guide (AI-Generated)":
- If it exists → read it and apply Edward's voice profile, do's, don'ts, opener library, and CTA library
- If it doesn't exist → use the default tone guidelines below

### Step 2 — Deep Research

**This is the most important step. A great opener is worth more than a great pitch.**

Research the prospect thoroughly using ALL available sources:

**About the person (decision-maker):**
- LinkedIn profile — career history, recent posts, shared connections with Edward, mutual groups, education
- Facebook — public posts, community involvement, personal interests
- Instagram — business account and/or personal (if public)
- Local news — "[person name] [city]" — awards, features, community events
- Community involvement — chamber of commerce, BNI, Rotary, trade associations
- Google "[person name] [city]" — catch podcasts, interviews, speaking events

**About the business:**
- Company website — services, team page, about us, locations, hiring, projects
- Google reviews — recent reviews, owner responses, themes
- Yelp or industry-specific review sites
- Local press / industry blogs — features, awards, expansions
- Social media accounts — posting frequency, engagement, events
- Recent changes — new location, remodel, new services, fleet expansion

### What You're Looking For (Priority Order)

1. **Mutual LinkedIn connections** — If Edward and the prospect share a connection, this is the #1 opener. Flag prominently: "REFERRAL OPPORTUNITY: You share [connection name] on LinkedIn — consider asking for an intro instead." Still draft the cold email.
2. **Shared personal background** — Same school, similar family business story, shared neighborhood, mutual community involvement
3. **Recent business milestone** — New location, anniversary, award, press feature, expansion
4. **Specific business observation** — Something from their website/reviews/social that shows genuine research
5. **Industry-relevant angle** — Hiring page (growth → WC), fleet expansion (commercial auto), new location (additional BOP), liquor license (liquor liability)

### Step 3 — Draft the Email

Create as a **Gmail draft** (never send directly). Use `gmail_create_draft`.

#### Email Structure

1. **Personalized opener (1–2 sentences):** Lead with the research finding. NOT a compliment — a specific observation. If mutual connection exists, mention naturally.
2. **Bridge to insurance (1 sentence):** Natural transition connecting what you observed to why insurance matters for them.
3. **Anvo value prop (1–2 sentences):** Specific to THIS business. Mention Mandarin capability if Chinese-owned. Construction expertise if contractor. Coverage gap identification if likely underserved.
4. **Soft CTA (1 sentence):** Low-friction ask. "Would you be open to a 15-minute call?" or "Happy to swing by if you're ever free."
5. **Sign-off:** The HTML signature block from `outreach/templates.md` (Signature Block section) serves as the sign-off. Do NOT write "Best," "Regards," or a closing word above it — the body ends at the CTA, then the signature block appears.

#### Tone Rules
- Friendly, human, peer-to-peer. Fellow business person, not a salesperson.
- No corporate jargon: no "value proposition," "synergies," "holistic solutions," "reaching out," "I'd love to connect."
- No exuberance. No excessive exclamation marks. Calm confidence.
- **Short: 4–7 sentences max for the body.**
- One clear CTA. Don't stack multiple asks.
- Don't start with "I" as the first word.

#### Subject Lines
- 3–7 words. Reference something specific.
- Good: "Quick question about [Business Name]," "[Neighborhood] contractor," "Saw your recent project"
- Bad: "Insurance quote," "Saving money," "Following up," anything with ALL CAPS

#### Hard Don'ts
- Don't mention specific carrier names
- Don't quote premiums or promise savings
- Don't criticize their current broker
- Don't use a subject line that looks like spam
- Don't send the same email to multiple prospects — every email must be unique

### Gmail Draft Creation

Use the Gmail MCP tool `gmail_create_draft` with:
- **To:** The prospect's email address from stage4_scored.csv
- **Subject:** Personalized subject line
- **Body:** **HTML**, not plain text. Wrap each paragraph of the body in `<p>` tags (no inline styling — let Gmail's defaults render), end the body at the CTA (no "Best," closing), then append the HTML signature block from `outreach/templates.md` verbatim with `{{campaign}}` and `{{template}}` substituted. If the tool has a `body_type` / `content_type` / `isHtml` flag, set it to HTML. See `templates.md` → "Draft Body Format — HTML, Not Plain Text" for the minimal body structure example.

### Step 4 — Log the Outreach

Append to `stage5_outreach_log.csv`:

```
date,company,contact,title,email,priority,overall_score,segment,research_summary,referral_opportunity,subject_line,draft_status,notes
```

- `research_summary`: 1–2 sentence summary of the key finding used in the email
- `referral_opportunity`: YES / NO (and the shared connection name if YES)
- `draft_status`: DRAFTED / SKIPPED_NO_ANGLE / SKIPPED_GENERIC_EMAIL / FLAGGED
- `notes`: Any flags — red flags found during research, generic email address, business may be closing, etc.

### Stage 5 Output

After each batch, provide Edward a summary table in chat:

| # | Prospect | Company | Key Research Finding | Referral Opportunity? | Draft Status |
|---|----------|---------|---------------------|----------------------|--------------|

Flag any prospects where:
- A mutual LinkedIn connection was found → REFERRAL OPPORTUNITY
- Research turned up red flags (closing, negative press, legal issues)
- No strong personal angle was found (email will be more generic)
- Email address looks questionable (generic info@, possible bounce risk)

### Batch Size

**10–15 emails per session** for Stage 5. Deep research takes time — don't rush it. A well-researched email that leads to a meeting is worth more than 50 generic blasts.

---

## STAGE 6: Inbox Monitoring & Response Drafting

### Purpose

Monitor Edward's inbox for replies from prospects emailed in Stage 5, then draft contextual responses as Gmail drafts.

### When to Run

- **Scheduled:** Three times daily — morning (~9 AM CT), midday (~1 PM CT), evening (~5 PM CT)
- **On-demand:** When Edward triggers manually

### Step 1 — Search for Replies

Use `gmail_search_messages` to find replies:

**Search queries to run:**
1. Search for replies from prospect email addresses listed in `stage5_outreach_log.csv`
2. Search for new emails from those same addresses (they may start a fresh thread)
3. Search for auto-replies or out-of-office responses

Use a query like: `from:{prospect_email}` for each prospect, or batch with `from:({email1} OR {email2} OR ...)` if the tool supports it.

### Step 2 — Categorize Each Reply

| Category | Action |
|----------|--------|
| **Interested** — wants to talk, asks questions, requests a quote | Draft a response (see below) |
| **Soft interested** — "maybe later," "not right now," "send me info" | Draft a warm follow-up |
| **Objection** — "I have a broker," "not interested," "too busy" | Draft an objection-handling response |
| **Auto-reply / OOO** | Log it, note when they return |
| **Unsubscribe / hostile** | Log as DO NOT CONTACT, do not respond |
| **Question / info request** | Draft a response addressing their specific question |

### Step 3 — Draft Responses

Create as **Gmail draft replies** on the existing thread using `gmail_create_draft`. Never send directly.

#### General Response Principles
- **Match their energy.** Short reply → short response. Casual → casual. Formal → slightly more formal but still warm.
- **Answer what they asked.** Be helpful and direct, don't dodge.
- **Move toward a conversation.** Every response gently advances toward a call or meeting — never push hard.

#### Response Guardrails — Follow Strictly

**When they ask about carriers:**
- ✅ "We work with a wide network of carriers — over a hundred — so we can shop for the best fit for your specific situation."
- ❌ Don't list specific carrier names. Don't say "We're appointed with..."

**When they ask about pricing / "can you save me money?":**
- ✅ "Honestly, I can't promise savings without seeing what you have — sometimes we find better rates, sometimes we find gaps in coverage that matter more than the premium. Either way, you'll know exactly where you stand."
- ❌ Don't promise savings or quote percentages.

**When they say "I already have a broker":**
- ✅ "Totally understand — most businesses do. I'm not trying to replace anyone. But a second set of eyes never hurts, especially in [their industry] where coverage needs can be tricky. Happy to do a no-obligation review if you're ever curious."
- ❌ Don't criticize the incumbent broker.

**When they say "not interested" or "bad timing":**
- ✅ "No worries at all — I appreciate the response. If anything changes down the road, feel free to reach out. I'm always around."
- ❌ Don't argue or ask "why not?" Log as "soft no — revisit in 6 months."

**When they ask about specific coverage (WC rates, BOP cost, etc.):**
- ✅ "Great question — [coverage type] depends on a few factors specific to your operation. I'd want to understand your setup before giving you numbers. Could we do a quick 10-minute call?"
- ❌ Don't quote premiums in email. Move to a call.

**When they ask what makes Anvo different:**
- ✅ Lead with what's relevant to THEM. Then: "We focus on making sure you're actually covered properly — not just finding the cheapest policy."
- ❌ Don't give a generic pitch or list every service.

**When they say "send me a quote" or "what would it cost?":**
- ✅ "I'd love to — to put together something accurate, I'd need about 10 minutes of your time to understand your operation. Can we find a quick window this week?"
- ❌ Don't try to quote over email.

**When they seem ready to meet / call:**
- ✅ Propose 2–3 specific time slots. "How about Tuesday or Thursday afternoon? I can do a quick 15-minute call, or if you're in [their area], happy to swing by."
- ❌ Don't say "let me know when works" — always propose times.

### Step 4 — Log the Reply

Append to `stage6_reply_log.csv`:

```
date,company,contact,email,reply_category,reply_summary,response_draft_status,follow_up_date,notes
```

- `reply_category`: INTERESTED / SOFT_INTERESTED / OBJECTION / AUTO_REPLY / DO_NOT_CONTACT / QUESTION
- `response_draft_status`: DRAFTED / FLAGGED_FOR_EDWARD / NO_RESPONSE_NEEDED
- `follow_up_date`: When to check back (e.g., OOO returns April 15 → "2026-04-15")

### Stage 6 Output

After each monitoring run, provide Edward a summary in chat:

| # | Prospect | Company | Reply Category | Summary | Draft Status |
|---|----------|---------|---------------|---------|--------------|

**Flag immediately if:**
- Hot lead (ready to meet, explicit quote request) → Edward may want to respond personally
- Mentions a specific carrier or coverage detail Edward should verify
- Comes from someone other than the original contact (forwarded to partner, etc.)
- Requires Edward's personal judgment (unusual situation, sensitive topic)

---

## STAGE 7: Style Learning

### Purpose

Analyze how Edward actually writes and edits prospecting emails to continuously improve draft quality. Build an evolving style guide that Stages 5 and 6 reference.

### When to Run

- **First run:** After Edward has sent at least 10 prospecting emails
- **Subsequent runs:** Every 20–30 additional sent emails
- Edward may also trigger manually

### Step 1 — Collect Sent Emails

Search Gmail sent folder using `gmail_search_messages`:
- Query: `from:edward@anvo-insurance.com` + filter for prospecting-style emails
- Match against prospect email addresses from `stage5_outreach_log.csv`
- Also look for prospecting emails Edward wrote independently (not from agent drafts)

### Step 2 — Compare Drafts vs. Sent

For emails where an agent draft exists, compare:
- **Subject line:** Kept, modified, or rewritten?
- **Opener:** Used the research finding, swapped, or added his own?
- **Body structure:** Kept the flow, rearranged, cut, or expanded?
- **Tone:** More casual? More direct? Shorter? Longer?
- **CTA:** Changed the ask? Softer or more specific?
- **Sign-off:** Any changes?

### Step 3 — Extract Patterns

Across ALL sent emails, identify:
- Sentence length and structure preferences
- Vocabulary (words he uses vs. avoids, contractions, colloquialisms)
- Opening patterns
- How he bridges from personal to business
- How he describes Anvo
- CTA style and specificity
- Overall length
- **What he cuts** (strong signal — stop including it)
- **What he adds** (even stronger signal — start including it)

### Step 4 — Update the Style Guide

Search Google Drive for "Anvo Prospecting Style Guide (AI-Generated)". If it doesn't exist, create it.

The style guide should contain:

1. **Edward's Voice Profile** — 3–5 bullet summary of his natural writing style
2. **Do's** — Specific phrasings, structures, and approaches he consistently uses
3. **Don'ts** — Things he consistently removes, avoids, or changes
4. **Example Rewrites** — 3–5 before/after pairs (agent draft → Edward's final), with annotations
5. **Opener Library** — Effective openers categorized by type (mutual connection, business observation, industry angle, personal angle)
6. **CTA Library** — CTAs he's used, noting which ones led to responses
7. **Evolution Notes** — Track style changes over time

---

## Important Rules (Apply to All Stages)

1. **Every email is a draft.** Never send directly. Every outreach email and every response → Gmail draft. No exceptions.

2. **Research before writing.** Never draft a cold email without completing the research checklist. A generic email is worse than no email.

3. **Flag referral opportunities.** Mutual LinkedIn connection → flag before drafting. Warm intro > cold email.

4. **Don't pigeonhole Anvo.** Never list specific carriers, quote premiums, or promise savings in emails. Keep positioning broad and consultative.

5. **Respect the "no."** Prospect says not interested → respond graciously, log for 6-month revisit. Never argue.

6. **Be honest about small accounts.** Don't inflate scores. A 1-employee contractor in rural MO is probably a $2,000 GL policy — say so.

7. **Flag data quality issues.** Wrong industry tag, wrong state, website goes to different business — call it out.

8. **Think like a broker, not a data analyst.** Output should help Edward decide who to call first and what to say.

9. **Style guide is living.** Early drafts will be templated. As data accumulates, drafts should increasingly sound like Edward wrote them.

10. **Industry awareness.** Always check the segment before scoring. Use segment-specific multipliers, premium logic, and carrier routing. Never apply food-industry assumptions to a construction company.

11. **Carrier routing is internal.** Use carrier recommendations to inform your opening angle and coverage needs assessment. Never mention carrier names in prospect-facing emails.

12. **Existing clients.** If a company is an existing Anvo client, mark SKIP with note "Existing client." Don't outreach to accounts you already insure.

---

## Session Workflow

Each session should follow this order:

```
1. READ STATE    → nightly-run-state.json, stage3_results.csv, stage4_scored.csv, stage5_outreach_log.csv
2. CHECK STYLE   → Search Google Drive for style guide (if it exists, read it)
3. STAGE 4       → Score unscored contacts from stage3_results.csv (20-25 per batch)
4. STAGE 5       → Draft emails for HIGH-priority contacts from this batch (10-15 per batch)
5. STAGE 6       → Monitor inbox for replies (if any outreach has been sent)
6. STAGE 7       → Run style learning (if 10+ emails have been sent since last run)
7. UPDATE STATE  → Update nightly-run-state.json with progress
8. REPORT        → Summarize results to Edward in chat
```

Not every session will include all stages. Stage 6 only runs once outreach has been sent. Stage 7 only runs periodically. A typical early session will focus on Stages 4 and 5.

---

## Tier Rules Reminder

| Tier | Segments | Pipeline Depth |
|------|----------|---------------|
| Tier 1 | Construction, Transport/Logistics, Manufacturing | Full pipeline (Stages 4–7) |
| Tier 2 | Food/Hospitality, Automotive, Retail/Wholesale | Stages 4–5. Smaller batches (20–30 companies max). Stage 6–7 apply to any replies received. |
| Tier 3 | Nonprofit, Religious | Do NOT process through Stages 4–7 until Edward explicitly approves. Exception: score ≥4.0 + clearly large premium → flag for Edward's manual review. |

**When resources are limited, always prioritize Tier 1 HIGH contacts over Tier 2, and Tier 2 over Tier 3.**

---

## Error Handling

- **Gmail tool unavailable:** Alert Edward. Do not proceed with Stages 5, 6, or 7 without Gmail access.
- **Web search unavailable:** You can still score using Apollo data + multipliers, but note "Website research recommended" in the notes column. Do not draft emails without research — skip to the next session when web tools are available.
- **LinkedIn requires login / CAPTCHA:** Note the prospect for later research. Draft the email with available research from other sources, but flag: "LinkedIn research incomplete."
- **Company website down:** Fall back to Google reviews, BBB, Yelp, business directories. Don't skip the prospect — alternative sources often have useful info.
- **Style guide not found in Google Drive:** Use the default tone guidelines from Stage 5. This is normal for early sessions before Stage 7 has run.
- **stage4_scored.csv doesn't exist:** Create it with the header row on first run.
- **stage5_outreach_log.csv doesn't exist:** Create it with the header row on first run.
