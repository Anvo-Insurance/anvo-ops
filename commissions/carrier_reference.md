# Carrier Commission Statement Reference

> **Purpose:** Parsing notes for each carrier's commission statement format. Used by Claude during monthly PDF processing and by the auto-ingestion script for CSV/Excel files.  
> **Updated from:** January and February 2026 actual statements.

---

## How to use this file

When processing commission statements (either manually or via Claude), refer to this file for:
- Where to find the key numbers in each carrier's statement
- What the canonical carrier name is (for consistency in the Sheet)
- Known quirks or gotchas with each format

When a new carrier is added or a format changes, update this file.

---

## Carrier Profiles

### Hartford
- **Canonical name:** Hartford
- **Aliases:** The Hartford, HF
- **Network:** SIAA
- **Statement format:** PDF
- **LOB:** C/L (Commercial Lines)
- **Key data location:**
  - Line items: table with columns `Account Number`, `Policy Number`, `Named Insured`, `Transaction`, `Eff Date`, `Premium`, `Rate`, `Comm Amount`
  - **Monthly total:** Look for `PRODUCER TOTAL THIS MONTH` — shows total premium and total commission
  - **YTD total:** `PRODUCER TOTAL THIS YEAR` (useful for cross-check but not needed monthly)
- **Jan 2026:** Premium $18,814.00, Commission $2,601.98
- **Feb 2026:** Premium $1,681.00, Commission $235.34
- **Notes:** Clean, easy-to-read format. Commission rates vary by policy (11.5%, 14%, 20%).

### Travelers (Personal Insurance)
- **Canonical name:** Travelers PI
- **Aliases:** TRV PI, Travelers Personal
- **Network:** SIAA
- **Statement format:** PDF and Excel (Excel available starting March 2026)
- **LOB:** P/L (Personal Lines)
- **Key data location:**
  - Header: `PERSONAL INSURANCE COMMISSION & ACCOUNTING INFORMATION STATEMENT - TRAVELERS [MONTH] [YEAR]`
  - Line items: fixed-width columns — `NAME OF INSURED`, `POLICY NUMBER`, `PAYMENT RECEIVED`, `PAID COMMISSION`, `COMM RATE`, `POLICY TERM COMMISSION`, `PREMIUM FOR COMMISSION`
  - **Monthly total:** Look for the summary page or calculate from `PAID COMMISSION` column
  - Columns use `¡` as delimiters in OCR output
- **Jan 2026:** Commission $5,611.83 (from ISM Remittance cross-reference)
- **Feb 2026:** Commission $1,528.04 (from ISM Remittance)
- **Notes:** Complex format. Multi-page, fixed-width. Policy-level detail is dense. The `PAID COMMISSION` column is the amount actually paid in this statement period. `POLICY TERM COMMISSION` is the full annual commission. Use `PAID COMMISSION` for monthly reporting. Some entries show negative amounts (cancellations, corrections). The statement may include `PMT-CORRECT` entries that are adjustments.

### Travelers (Bond & Business Insurance)
- **Canonical name:** Travelers BI
- **Aliases:** TRV Bond, TRV BI, Travelers Bond and BI
- **Network:** SIAA
- **Statement format:** PDF and Excel (Excel available starting March 2026)
- **LOB:** C/L (Commercial Lines)
- **Key data location:**
  - Line items: `NAME OF INSURED`, `ACCOUNT NUMBER`, `POLICY NUMBER`, `TRANSACTION TYPE`, `EFFECTIVE DATE`, `TRANSACTION PREMIUM`, `COMM. RATE`, `COMM. DUE`
  - **Monthly total:** `TOTAL COMM. ACTIVITY DIRECT BILL` — shows total premium and total commission
  - **Commission payable:** `[MONTH] COMMISSION PAYABLE` — the actual payment amount
  - **YTD:** `YEAR TO DATE COMMISSION`
- **Jan 2026:** Premium $5,012.00, Commission $629.03
- **Feb 2026:** Premium $33,925.00, Commission $3,324.87
- **Notes:** Clean tabular format. Commission rates vary (9%, 10%, 12%, 15%). May include negative entries for cancellations and audit adjustments.

### Berkshire Hathaway Guard
- **Canonical name:** Guard
- **Aliases:** BH Guard, Berkshire Hathaway Guard, Guard Insurance
- **Network:** SIAA
- **Statement format:** PDF
- **LOB:** C/L (Commercial Lines)
- **Key data location:**
  - Header: `DIRECT BILL COMMISSION STATEMENT FOR [MONTH] [YEAR]`
  - Agency code: `NEMIAA50`
  - Line items by LOB subtotals: `SubTotal for Businessowner's`, `SubTotal for Workers' Compensation`
  - **Monthly total:** `TOTAL COMMISSION AMOUNT` — this is the key number
- **Jan 2026:** Commission $1,883.42
- **Feb 2026:** Commission $2.76
- **Notes:** Clean format. Groups by LOB with subtotals. May include negative entries (`PRODUCER FEE AMOUNT DUE` with future dates — these are fee chargebacks, not commissions).

### Progressive
- **Canonical name:** Progressive
- **Aliases:** PR, Progressive Casualty
- **Network:** SIAA
- **Statement format:** PDF (summary page)
- **LOB:** P/L (Personal Lines — primarily Auto)
- **Key data location:**
  - `Commission Statement Summary` header
  - Table: `Description`, `Current` (NWP and Commission), `YTD` (NWP and Commission)
  - **Key line items:** Auto, Commercial Vehicle, Motorcycle (if applicable)
  - **Agent Total:** The sum row
  - **Net Amount Due Agent:** Actual payout after chargebacks (MVR Chargeback, Adjustments)
- **Jan 2026:** NWP $9,902.72, Commission $843.15, Net Due $838.03 (MVR Chargeback -$5.12)
- **Feb 2026:** NWP $14,260.35, Commission $1,234.54, Net Due $1,234.54
- **Notes:** Use "Agent Total" commission for the gross commission in the Sheet. Note `Net Amount Due Agent` separately if it differs (means there were chargebacks). Feb 2026 added Commercial Vehicle and Motorcycle lines.

### Nationwide
- **Canonical name:** Nationwide
- **Aliases:** NW, Nationwide Mutual
- **Network:** SIAA
- **Statement format:** PDF (multi-section, complex layout)
- **LOB:** P/L (Personal Lines)
- **Key data location:**
  - Header: `Nationwide® Insurance Monthly UAC Commission Statement`
  - `TOTAL COMMISSION SUMMARY` section:
    - `Direct Bill Commission Amount`
    - `GIP Commission Amount` (Growth Incentive Program — usually $0.00)
    - **`Total Commission Amount`** — use this
  - `Total YTD Commission Amount` — for cross-check
  - Policy-level details at the bottom
- **Jan 2026:** Total Commission $78.48
- **Feb 2026:** Total Commission $196.51
- **Notes:** The PDF contains the same information twice (UAC Statement and Agency Statement) — they should match. GIP commission is usually $0. The statement is dense but the `TOTAL COMMISSION SUMMARY` section has everything needed.

### Markel
- **Canonical name:** Markel
- **Aliases:** Markel Corporation, Markel Insurance
- **Network:** SIAA
- **Statement format:** PDF
- **LOB:** C/L (primarily Workers' Comp)
- **Key data location:**
  - Header: `Direct Bill Commission Statement`
  - `Statement Period: [date range]`
  - Line items: `Comm Account #`, `Policy #`, `Insured Name`, `Line`, `Eff Date`, `Premium`, `Rate`, `Amount`
  - **Total:** Sum of the `Amount` column (bottom of table)
  - Also: `Statement Total` near the top — this is the net including balance forward
  - `Current Due` — the current period's earned commission
- **Jan 2026:** Current Due ($22.56) — negative (chargeback exceeded new commissions)
- **Feb 2026:** Total Earned $66.39, Statement Total $43.83 (includes balance forward)
- **Notes:** Use `Total Earned` for the gross commission column, NOT `Statement Total` (which includes prior balances). Negative amounts are normal (audit adjustments, cancellations). Product codes: BOP = Business Owners Policy, WC = Workers Compensation.

### State Auto
- **Canonical name:** State Auto
- **Aliases:** State Auto Insurance, State Automobile Mutual
- **Network:** SIAA
- **Statement format:** PDF
- **LOB:** P/L + C/L
- **Key data location:**
  - Header shows `MO MONTHLY STATEMENT`
  - Line items: `INSURED NAME`, `ACCOUNT NUMBER`, `POLICY NUMBER`, `EFFECT`, `EXPIRE`, `ENTRY DESCR`, `PREMIUM`, `COMM %`, `COMMISSION AMOUNT`
  - Subtotals by sub-producer code
  - **Agency total:** `AGENCY TOTALS` — premium and commission
  - Also: `EFT - DIRECT DEPOSIT` amount (should match agency total commission)
- **Jan 2026:** Premium $8,089.00, Commission $1,213.35
- **Notes:** OCR quality can be rough on this one due to the legacy formatting with special characters. The `AGENCY TOTALS` line is the most reliable number.

### American Modern Insurance Group
- **Canonical name:** American Modern
- **Aliases:** AMIG, American Modern Insurance
- **Network:** SIAA
- **Statement format:** PDF
- **LOB:** P/L
- **Jan 2026:** Premium $8,780.00, Commission $965.68 (from ISM Remittance)
- **Feb 2026:** Premium $5,385.00, Commission $538.50 (from ISM Remittance)
- **Notes:** Individual statement not yet reviewed. Data pulled from ISM Remittance. Update this section when the actual statement format is reviewed.

<!-- TODO: Add individual statement parsing notes once a sample is reviewed -->

### Risk Placement Services
- **Canonical name:** Risk Placement Services
- **Aliases:** RPS, Risk Placement
- **Network:** SIAA
- **Statement format:** PDF
- **LOB:** C/L
- **Feb 2026:** Premium $3,567.00, Commission $356.70 (from ISM Remittance)
- **Notes:** Not present in January. Individual statement not yet reviewed.

<!-- TODO: Add parsing notes once a sample is reviewed -->

### ISM Remittance Summary (SIAA/MIAA Aggregator Report)
- **Canonical name:** ISM Remittance
- **Purpose:** Not a carrier — this is the SIAA/MIAA aggregator report that consolidates ALL network carrier commissions. Used for cross-checking, NOT for primary data entry.
- **Key data location:**
  - `Premium and Commission` table: columns `Company`, `LOB`, `Premium Volume`, `Gross Commission`
  - All SIAA/MIAA carriers listed with P/L and C/L subtotals
  - **Grand total:** `Total:` rows at the bottom of each page
  - `Adjusted Gross Commission` — total after any base adjustments
  - `Calculation of Fees` — the MIAA fee breakdown (tiered: 10% of first $10K, 8% of next $8K, etc.)
  - `Monthly Fee` — the greater of calculated fee or $300 minimum
- **Jan 2026:** Gross Commission $13,804.36, MIAA Fee $1,304.35
- **Feb 2026:** Gross Commission $7,483.65, MIAA Fee $748.37
- **Notes:** Use this to populate the `ISM Cross-Check` tab and to verify individual carrier totals match.

---

---

## MGA / Wholesalers / Brokers

### Cochrane & Company
- **Canonical name:** Cochrane
- **Aliases:** Cochrane & Company, Cochrane Co
- **Network:** MGA/Wholesale
- **Statement format:** Excel (monthly account reconciliation emailed by Desseray Ellis)
- **LOB:** C/L (Commercial — trucking/commercial auto)
- **Contact:** Desseray Ellis, dellis@cochraneco.com, 800-441-4535
- **Key data location:**
  - Row 1: Policy number and insured name
  - Row 2: Headers — `Gross`, `Commission`, `Net`, `Comment`
  - Line items: Each row is an endorsement (add/delete vehicles, units)
  - **Balance Due row:** Current period totals
  - **Balance row (bottom):** Running total — Gross, Commission, Net
  - Commission rate: 10% of gross premium
- **March 2026 example:** Heng Feng Food Services, Policy# 72APS128060
  - Commission: $4,734.20
  - Net balance due to carrier: $44,974.88
- **CRITICAL — Payment timing:** Cochrane commissions are **accrued, not received**. Due to AR days, the balance does not true up until the policy renews. Track as `payment_status = "accrued"` in the Commissions tab. Do NOT include in net income until actually paid.
- **Notes:** Alice receives these reconciliations at baosinsurance@gmail.com. One reconciliation per policy per month. May have multiple Cochrane policies — sum across all reconciliations for the monthly total.

<!-- TODO: Edward to add other MGA/wholesaler carriers as they come in -->

---

## Adding a New Carrier

When a new carrier starts sending commission statements:

1. Get a sample statement and determine the format (PDF, CSV, Excel)
2. Identify where the key numbers live (total commission, premium, LOB)
3. Add a section to this file following the template above
4. Add the carrier to the `Carriers` config tab in the Google Sheet
5. If the carrier provides CSV/Excel, the auto-ingestion script should pick it up
6. If PDF-only, update the Claude processing prompt if needed
