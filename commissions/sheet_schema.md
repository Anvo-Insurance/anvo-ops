# Commission & Bonus Tracking — Google Sheet Schema

> **Sheet name:** Anvo Commission Tracker  
> **Purpose:** Master data store for all carrier commissions and MIAA bonus payments. Fed by a combination of automated Apps Scripts (CSVs/Excel) and Claude-assisted monthly processing (PDFs).  
> **Drive folder:** [Commission Statements](https://drive.google.com/drive/folders/1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C)

---

## Tab 1: `Commissions`

One row per carrier per month. Populated by:
- **Apps Script** for CSV/Excel files (auto-ingested from the Drive folder)
- **Claude** for PDF statements (processed during monthly Cowork sessions)
- **Manual entry** as fallback

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | `report_month` | YYYY-MM | The month the commission covers |
| B | `carrier` | Text | Canonical carrier name (must match `Carriers` tab) |
| C | `lob` | Text | Line of business: `P/L` (Personal Lines), `C/L` (Commercial Lines), or `Both` |
| D | `premium_volume` | Currency | Written premium for the period |
| E | `gross_commission` | Currency | Commission earned |
| F | `commission_rate` | Percentage | Effective commission rate (E / D), auto-calculated |
| G | `network` | Text | `SIAA`, `MIAA`, or `Direct` — which aggregator, if any |
| H | `source_type` | Text | `csv`, `xlsx`, `pdf`, or `manual` — how data was ingested |
| I | `source_file` | Text | Original filename or Drive link |
| J | `parse_status` | Text | `verified`, `auto_parsed`, `claude_extracted`, or `needs_review` |
| K | `payment_status` | Text | `received` (cash in hand) or `accrued` (earned but not yet paid — e.g., Cochrane/wholesaler reconciliations with AR timing) |
| L | `notes` | Text | Any flags, adjustments, or context |
| M | `ingestion_date` | Date | When the row was created |

### Key rules
- One row per carrier per LOB per month. If a carrier has both P/L and C/L, that's two rows.
- `carrier` values must match canonical names in the `Carriers` config tab.
- `needs_review` rows must be resolved before the monthly report is finalized.
- Negative commissions (chargebacks, audits) are valid — don't zero them out.

---

## Tab 2: `Policy Detail`

Raw policy-level line items from carrier statements. One row per policy transaction. This is the drill-down behind the `Commissions` tab.

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | `report_month` | YYYY-MM | Month this transaction falls in |
| B | `carrier` | Text | Canonical carrier name |
| C | `lob` | Text | `P/L` or `C/L` |
| D | `insured_name` | Text | Policyholder / insured name |
| E | `policy_number` | Text | Policy number |
| F | `transaction_type` | Text | New Business, Renewal, Endorsement, Cancellation, Final Audit, etc. |
| G | `effective_date` | Date | Policy or transaction effective date |
| H | `premium` | Currency | Transaction premium |
| I | `commission_rate` | Percentage | Commission rate for this policy |
| J | `commission_amount` | Currency | Commission earned |
| K | `producer` | Text | Producer name (Edward, Yalu, Alice) if available |
| L | `source_file` | Text | Original filename |
| M | `notes` | Text | Any flags or context |

### Key rules
- Not every carrier provides all fields — leave blank what's not available.
- For CSV/Excel carriers (Travelers, Progressive, Hartford), line items are auto-extractable.
- For PDF carriers, Claude extracts what's readable during monthly processing.
- This tab can grow large — use filters and pivot tables to analyze.

---

## Tab 3: `Bonuses`

One row per bonus payment. Populated by Gmail Apps Script (scans MIAA-labeled emails).

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | `bonus_month` | YYYY-MM | The period the bonus covers |
| B | `source` | Text | `MIAA`, `SIAA`, or carrier name |
| C | `bonus_type` | Text | `contingency`, `profit_sharing`, `growth_bonus`, `override`, `other` |
| D | `amount` | Currency | Bonus amount |
| E | `description` | Text | Brief description from the email or statement |
| F | `email_date` | Date | Date the email was received |
| G | `parse_status` | Text | `auto_parsed` or `needs_review` |
| H | `notes` | Text | Any context |
| I | `ingestion_date` | Date | When the row was created |

---

## Tab 4: `Monthly Summary`

**Formula-driven.** Aggregates `Commissions` and `Bonuses` into a monthly dashboard.

| Column | Header | Formula logic |
|--------|--------|---------------|
| A | `month` | Unique YYYY-MM values |
| B | `total_premium` | `SUMIFS(Commissions!D, Commissions!A, month)` |
| C | `total_commission` | `SUMIFS(Commissions!E, Commissions!A, month)` |
| D | `effective_rate` | `C / B` |
| E | `pl_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!C, "P/L")` |
| F | `cl_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!C, "C/L")` |
| G | `siaa_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!G, "SIAA")` |
| H | `miaa_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!G, "MIAA")` |
| I | `direct_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!G, "Direct")` |
| J | `mga_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!G, "MGA/Wholesale")` |
| K | `total_bonuses` | `SUMIFS(Bonuses!D, Bonuses!A, month)` |
| L | `total_income` | `C + K` |
| M | `accrued_commission` | `SUMIFS(Commissions!E, Commissions!A, month, Commissions!K, "accrued")` — earned but not yet received |
| N | `received_commission` | `C - M` — commission actually received |
| O | `ism_fee` | Manual — MIAA/SIAA fee from ISM Remittance |
| P | `net_income` | `N + K - O` — received commission + bonuses - fees (excludes accrued) |
| O | `mom_change_pct` | `(L - prev month L) / prev month L` |
| P | `yoy_change_pct` | `(L - same month last year L) / same month last year L` |
| Q | `carriers_reporting` | `COUNTIFS(Commissions!A, month)` |
| R | `carriers_pending` | `COUNTIFS(Commissions!A, month, Commissions!J, "needs_review")` |
| S | `notes` | Manual — monthly context |

---

## Tab 4: `Commission by Carrier`

**Pivot view.** Rows = carriers. Columns = months. Cell values = gross commission.

Built using `QUERY()` against the `Commissions` tab:
```
=QUERY(Commissions!A:E, "SELECT B, SUM(E) WHERE A = '2026-01' GROUP BY B LABEL SUM(E) 'Jan 2026'")
```

- Bottom row: monthly totals
- Rightmost column: trailing 12-month total per carrier
- Enables quick visual comparison of carrier trends

---

## Tab 5: `ISM Cross-Check`

For SIAA/MIAA carrier verification. After Claude processes individual carrier statements AND the ISM Remittance is available, compare totals.

| Column | Header | Notes |
|--------|--------|-------|
| A | `report_month` | YYYY-MM |
| B | `carrier` | Carrier name |
| C | `ism_commission` | Commission amount from ISM Remittance |
| D | `statement_commission` | Commission amount from individual carrier statement |
| E | `variance` | `C - D` (should be $0.00 if matched) |
| F | `status` | `matched`, `variance`, or `pending` |

---

## Tab 6: `Carriers` (Config)

Reference data for carrier normalization.

| Column | Header | Notes |
|--------|--------|-------|
| A | `carrier_name` | Canonical name used across all tabs |
| B | `aliases` | Comma-separated alternate names found in files (e.g., "BH Guard, Berkshire Hathaway Guard") |
| C | `network` | `SIAA`, `MIAA`, or `Direct` |
| D | `statement_format` | `pdf`, `csv`, `xlsx`, or `mixed` |
| E | `typical_lob` | `P/L`, `C/L`, or `Both` |
| F | `active` | TRUE/FALSE |
| G | `notes` | Any parsing notes or quirks |

### Initial carrier list (from Jan/Feb 2026 statements):

| Carrier | Network | Format | LOB |
|---------|---------|--------|-----|
| American Modern Insurance Group | SIAA | pdf | P/L |
| Berkshire Hathaway Guard | SIAA | pdf | C/L |
| Hartford | SIAA | pdf | C/L |
| Markel Corporation | SIAA | pdf | C/L |
| Nationwide | SIAA | pdf | P/L |
| Progressive | SIAA | pdf | P/L |
| State Auto Insurance | SIAA | pdf | P/L + C/L |
| Travelers | SIAA | pdf | P/L + C/L |
| Risk Placement Services | SIAA | pdf | C/L |

<!-- TODO: Edward to add non-SIAA/MIAA carriers and any carriers with CSV/Excel formats -->

---

## Setup Instructions

1. Create a new Google Sheet named "Anvo Commission Tracker"
2. Create all 6 tabs with the exact names listed above
3. Add headers to each tab matching the column definitions
4. Populate the `Carriers` tab with the initial carrier list above + any missing carriers
5. Note the Sheet ID from the URL — needed for the Apps Scripts
6. Share the Sheet with the service account running the Apps Scripts (editor access)

**Sheet ID:** `13CT2DuKgbyCq3N18on-fHLC4K-HxUIMokZN3kf0wNow`  
**Sheet URL:** https://docs.google.com/spreadsheets/d/13CT2DuKgbyCq3N18on-fHLC4K-HxUIMokZN3kf0wNow/edit
