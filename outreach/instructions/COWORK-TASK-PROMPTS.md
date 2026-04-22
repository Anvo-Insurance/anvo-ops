# Anvo Prospecting — Cowork Task Prompts (v2)
# Use these copy-paste prompts with INSTRUCTIONS-v5.md in your Anvo-Prospecting folder

---

## FULL PIPELINE (all four stages in one session)

Use this when you have a fresh Apollo company export and want to go from raw list to scored, outreach-ready prospects in one session. Requires Claude in Chrome with Apollo.io logged in.

```
Read INSTRUCTIONS-v5.md in this folder first.

I'm logged into Apollo.io in Chrome.

I have a new Apollo company export: [FILENAME].csv

Run all four stages of the pipeline:

STAGE 1: Score every company using the company-level scoring criteria.

STAGE 2: For every company scored HIGH, run the full business 
verification via Chrome (status, identity match, territory).

STAGE 3: For every company verified as REVEAL, go into Apollo 
and reveal the top decision-maker contact (Owner/President/GM). 
Start with the first 3 as a test — stop and show me before 
continuing.

STAGE 4: After all reveals are done, run full contact-level 
scoring on every revealed contact. Visit websites for HIGHs. 
Assign priority tiers, carrier recommendations, and opening angles.

Flag as SKIP any existing Anvo clients:
- [LIST EXISTING CLIENTS HERE]

Output files:
- [BATCH-NAME]-stage1-scored.csv
- [BATCH-NAME]-stage2-verified.csv  
- [BATCH-NAME]-stage3-revealed.csv
- [BATCH-NAME]-stage4-final.csv

Give me a final summary:
- Companies scored / verified / revealed / final scored
- Credits spent and credits saved
- HIGH / MEDIUM / LOW / SKIP counts at each stage
- Top 5 prospects to call this week with one line each
```

---

## STAGE 1 ONLY (scoring without verification)

```
Read INSTRUCTIONS-v5.md in this folder first.

I have a new Apollo company export: [FILENAME].csv

Run Stage 1 only — score every company using the company-level 
scoring criteria. No web verification or Apollo work needed.

Output as [BATCH-NAME]-stage1-scored.csv, sorted by overall score.

Summary: how many HIGH / MEDIUM / LOW / SKIP, top 10 companies.
```

---

## STAGE 2 ONLY (verification on a pre-scored list)

Requires Claude in Chrome.

```
Read INSTRUCTIONS-v5.md in this folder first.

I have a scored company list: [FILENAME].csv

Run Stage 2 — business verification on every company marked HIGH 
(or HIGH and MEDIUM if specified).

For each company, verify via Chrome:
A) Is it still open? (website, Google Maps, Yelp)
B) Is it the right business? (matches Apollo data, correct location)
C) Is it actually in MO or KS?

Flag as SKIP any existing Anvo clients:
- [LIST EXISTING CLIENTS HERE]

Output as [BATCH-NAME]-stage2-verified.csv

Summary: REVEAL / SKIP / MANUAL CHECK counts, list every SKIP 
with reason.
```

---

## STAGE 3 ONLY (Apollo reveals on a verified list)

Requires Claude in Chrome with Apollo.io logged in.

```
Read INSTRUCTIONS-v5.md in this folder first.

I'm logged into Apollo.io in Chrome.

I have a verified company list: [FILENAME].csv
Only process companies where recommendation = REVEAL.

For each REVEAL company, go into Apollo:
1. Search for the company
2. Find the Owner / President / GM / top decision-maker
3. Reveal their contact (1 credit each)
4. Record: company, contact name, title, email, phone

Start with the first 3 as a test. Stop and show me results. 
Wait for my approval before continuing.

Rules:
- ONE contact per company only
- Skip if company not found, no decision-maker, or ambiguous match
- Do NOT reveal SKIP or MANUAL CHECK companies
- Stop immediately if Apollo shows billing/upgrade prompts

Output as [BATCH-NAME]-stage3-revealed.csv

Summary: credits spent, credits saved, any skips and why.
```

---

## STAGE 4 ONLY (scoring on already-revealed contacts)

```
Read INSTRUCTIONS-v5.md in this folder first.

I have revealed contacts: [FILENAME].csv

Run Stage 4 — full contact-level scoring on every revealed contact.
- Apply headcount multipliers
- Score all four dimensions
- For HIGHs, visit their website via Chrome for enrichment
- Assign priority tiers, carrier recommendations, opening angles
- List coverage needs and note red flags

Incorporate any enrichment from earlier Stage 2 verification 
if that data is available in the file.

Output as [BATCH-NAME]-stage4-final.csv, sorted by overall score.

Summary: HIGH / MEDIUM / LOW / SKIP counts, top 5 to call 
this week with one line each.
```

---

## STAGES 3+4 COMBINED (reveal and score in one pass)

Use when you already have a verified list and want to reveal + score without stopping between stages.

```
Read INSTRUCTIONS-v5.md in this folder first.

I'm logged into Apollo.io in Chrome.

I have a verified company list: [FILENAME].csv
Only process companies where recommendation = REVEAL.

STEP 1 — REVEAL: For each REVEAL company, find and reveal the 
top decision-maker in Apollo. Start with the first 3 as a test. 
Stop and show me. Wait for approval before continuing.

STEP 2 — SCORE: After all reveals, run Stage 4 scoring on every 
revealed contact. Visit websites for HIGHs. Full scoring with 
priority tiers, carriers, opening angles, coverage needs.

Output as [BATCH-NAME]-final.csv

Summary: credits spent, credits saved, HIGH/MEDIUM/LOW/SKIP counts,
top 5 prospects to call this week.
```

---

## OVERNIGHT BATCH (Stages 1+2, queue for morning)

No credits spent. Run this before bed, review results in the morning, then run Stages 3+4 manually.

```
Read INSTRUCTIONS-v5.md in this folder first.

I have a new Apollo company export: [FILENAME].csv

Run Stage 1 (scoring) and Stage 2 (verification via Chrome) 
on the full list. This is a large batch — take your time.

DO NOT proceed to Stage 3 (reveals). I'll review the verified 
list in the morning and run reveals myself.

Flag as SKIP any existing Anvo clients:
- [LIST EXISTING CLIENTS HERE]

Output:
- [BATCH-NAME]-stage1-scored.csv
- [BATCH-NAME]-stage2-verified.csv

Summary when done: total companies, HIGH/MEDIUM/LOW/SKIP counts,
REVEAL/SKIP/MANUAL CHECK counts, top 20 recommended reveals.
```

---

## MONTHLY ANALYSIS (schedule for 1st of each month)

```
Read INSTRUCTIONS-v5.md in this folder first.

Read the Prospect Ledger Google Sheet (or latest ledger CSV).

Analyze this month's prospecting data:

1. CREDIT EFFICIENCY
   - Credits spent per batch
   - Stage 2 verification savings (how many SKIPs prevented wasted credits?)
   - Reveal → Contact → Response → Quote → Bind rates per batch

2. SCORING ACCURACY
   - Do HIGHs convert better than MEDIUMs?
   - Premium estimates vs actual quotes
   - Which scoring dimension best predicts conversion?

3. VERIFICATION ACCURACY
   - Any REVEALs that turned out closed/wrong?
   - Any MANUAL CHECKs that were actually good leads?

4. SEGMENT COMPARISON
   - Conversion by industry, business type, geography
   - Average premium by segment
   - Best and worst Apollo filters

5. RECOMMENDATIONS
   - Filter adjustments for next month
   - Credit allocation shifts between batches
   - Scoring weight changes needed

Save as month-[N]-analysis.md. Give me 5-bullet summary in chat.
```

---

## TIPS

- Always replace [FILENAME], [BATCH-NAME], and [LIST EXISTING CLIENTS HERE]
- Batch naming: A1-Restaurants-Apr26, A2-FoodDist-Apr26, B1-Contractors-Apr26
- For Stages 3+4, keep Chrome open on Apollo — no pop-ups blocking
- Laptop must stay awake for overnight runs  
- The test-first protocol (3 reveals then stop) is mandatory for Stage 3 — never skip it
- If Cowork gets stuck during verification or reveals, it should skip that company and mark MANUAL CHECK rather than hanging
