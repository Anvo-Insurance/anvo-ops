# Monthly Commission & Bonus Report — Workflow

> **Owner:** Edward / Alice  
> **Frequency:** Monthly, by the 10th of the following month  
> **Inputs:** Carrier commission statements (PDF, CSV, Excel), MIAA bonus emails  
> **Output:** Populated Google Sheet with monthly summary, carrier breakdown, and trend data

---

## Overview

The monthly commission report combines four data streams:

1. **CSV/Excel commission statements** — Auto-ingested by a Google Apps Script that monitors the Drive folder
2. **PDF commission statements** — Extracted by Claude during a monthly Cowork session
3. **MGA/Wholesaler/Broker commissions** — Received via email (attachments or body text), labeled in Gmail, processed by Claude during monthly Cowork sessions
3. **MIAA bonus emails** — Auto-ingested by a separate Gmail Apps Script

Everything flows into the **Anvo Commission Tracker** Google Sheet. See `sheet_schema.md` for the full structure.

---

## Step 1: Collect Commission Statements (Days 1-5 of month)

### Who does this: Edward or Alice

As commission statements arrive from carriers (via email, carrier portals, or SIAA/MIAA):

1. Download the statement (PDF, CSV, or Excel — use CSV/Excel when available)
2. Upload to the Google Drive folder: **Commission Statements > [Year] > [Month]**
   - Folder: https://drive.google.com/drive/folders/1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C
   - Follow existing naming: `2026 > Feb`, `2026 > Mar`, etc.
3. Name files clearly: include carrier name and month (e.g., `Hartford Mar 2026.pdf`, `Progressive_March_2026.csv`)

### What happens automatically:
- The **Commission Ingestion Script** runs every 6 hours
- It picks up new CSV/Excel files, parses them, and writes rows to the `Commissions` tab
- PDFs are skipped — they're handled in Step 2

### Checklist of expected carriers (update as carriers change):

| Carrier | Network | Statement Format |
|---------|---------|-----------------|
| American Modern | SIAA | PDF |
| Berkshire Hathaway Guard | SIAA | PDF |
| Hartford | SIAA | PDF |
| Markel | SIAA | PDF |
| Nationwide | SIAA | PDF |
| Progressive | SIAA | PDF |
| State Auto | SIAA | PDF |
| Travelers (PI) | SIAA | Excel (March 2026+), PDF (prior) |
| Travelers (Bond/BI) | SIAA | Excel (March 2026+), PDF (prior) |
| Risk Placement Services | SIAA | PDF |

<!-- TODO: Edward to add non-SIAA carriers and update formats as CSV/Excel versions become available -->

---

## Step 2: Process PDF Statements in Claude (Day 5-7)

### Who does this: Edward's Claude Code session (has both Google Drive + Google Sheets MCP access)

Once all statements for the month are uploaded to the Drive folder, tell Claude:

```
Process [Month] commissions. Search the Drive folder for all files in 
the [Month] subfolder, read each PDF, extract carrier name, commission 
total, premium volume, LOB, and policy-level detail. Write summary rows 
to the Commissions tab and line items to the Policy Detail tab of the 
Anvo Commission Tracker Sheet. Flag anything unclear as "needs_review".
```

**Drive folder:** https://drive.google.com/drive/folders/1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C
**Sheet ID:** `1z1OjIfOT91WAtzQeT8ef7qM3BSbC0N5eW17u0VZQYVk`

### How it works (end-to-end, no manual steps):
1. Claude searches Google Drive for files in the month's subfolder
2. Reads each PDF/CSV/Excel via Google Drive MCP (`read_file_content`)
3. Extracts: carrier name, report month, LOB, premium, gross commission, policy-level line items
4. Writes summary rows to `Commissions` tab via Google Sheets MCP (`update_cells` / `add_rows`)
5. Writes policy-level rows to `Policy Detail` tab
6. Sets `parse_status` = `claude_extracted` (Edward reviews and flips to `verified`)
7. Flags anything ambiguous as `needs_review`
8. Reports a summary of what was processed

### Required MCP connections (Edward's session):
- **Google Drive MCP** — reads PDFs and file listings from the Commission Statements folder
- **Google Sheets MCP** (`mcp-google-sheets`) — writes directly to the Anvo Commission Tracker
  - Credentials: `C:\Users\ehsye\OneDrive\Desktop\Claude Code\.secrets\anvo-oauth-credentials.json`
  - Token: `C:\Users\ehsye\OneDrive\Desktop\Claude Code\.secrets\anvo-oauth-token.json`
  - Configured in `.mcp.json` in the anvo-ops repo

### For wholesaler/MGA invoices (Burns & Wilcox, RPS, Cochrane, etc.):
These come as individual policy invoices rather than monthly statements. Upload to the same Drive folder, or share the PDF directly in the session. Claude extracts:
- Premium (excluding surplus tax and broker fees — commission is calculated on premium lines only)
- Broker commission amount and rate
- Insured name, policy number, effective date, transaction type
- Writes to both Commissions (Network = `MGA/Wholesale`) and Policy Detail tabs

### Key extraction points per carrier (see `carrier_reference.md` for full details):

- **Hartford:** Look for "PRODUCER TOTAL THIS MONTH" line — has premium and commission
- **Travelers PI:** Look for the summary totals at the bottom of the fixed-width table
- **Travelers Bond/BI:** Look for "TOTAL COMM. ACTIVITY DIRECT BILL" line
- **Guard:** Look for "TOTAL COMMISSION AMOUNT" line
- **Progressive:** Look for "Net Amount Due Agent" (actual payout) and "Commissions" column in the summary table
- **Nationwide:** Look for "Total Commission Amount" in the TOTAL COMMISSION SUMMARY section
- **Markel:** Look for the total at the bottom of the line-item table
- **State Auto:** Look for "AGENCY TOTALS" line
- **ISM Remittance:** This is the SIAA/MIAA aggregator report — use it to cross-check individual carrier totals

---

## Step 3: ISM Remittance Cross-Check (Day 7-8)

### Who does this: Edward or Alice

After the ISM Remittance Summary is submitted and downloaded:

1. Upload it to the same month's Drive folder
2. In a Cowork session, have Claude read the ISM Remittance and populate the `ISM Cross-Check` tab
3. Compare ISM totals against the individual carrier statement totals
4. Resolve any variances

This step ensures the data flowing through SIAA/MIAA matches what the carriers reported directly.

---

## Step 3b: MGA/Wholesaler Commission Processing (Day 5-7)

### Who does this: Edward, Alice, or Ling (in a Cowork session, same as Step 2)

MGA, wholesaler, and broker commissions arrive via email — some as attachments, some in the email body. These are carriers outside of SIAA/MIAA.

### Setup (one-time):
1. Create Gmail label: `MGA Commissions`
2. Create Gmail filter for known MGA/wholesaler senders — apply the label automatically
3. For new/unknown senders, manually apply the label when you see a commission email

### Monthly processing:
During the same Cowork session as Step 2, include this in your prompt:

```
Also process MGA/wholesaler commission emails labeled "MGA Commissions" 
in Gmail. For each email, extract the carrier/MGA name, commission 
amount, premium if available, and line of business. Write to the 
Commissions tab with Network = "MGA/Wholesale". Add policy-level 
detail to the Policy Detail tab where available.
```

### Key differences from SIAA carriers:
- Network column = `MGA/Wholesale` (not `SIAA`)
- These won't appear on the ISM Remittance — no cross-check needed
- Commission rates may vary more than SIAA carriers
- Add new MGAs to the `Carriers` config tab as they appear

---

## Step 3c: Policy Detail Entry (Day 5-7)

### Who does this: Claude (during the same Cowork session)

When processing carrier statements (Steps 2 and 3b), Claude also extracts **policy-level line items** into the `Policy Detail` tab. This gives you drill-down capability from the carrier summary.

Each row in Policy Detail represents one policy transaction: insured name, policy number, transaction type, premium, commission rate, commission amount, and producer (where available).

Not every carrier provides the same level of detail, but Excel/CSV statements (Travelers, Progressive, Hartford) have clean line items. For PDF statements, Claude extracts what's available.

---

## Step 4: Bonus Email Processing (Ongoing)

### Automated — no manual action needed

The **Bonus Ingestion Script** runs daily at 8 AM:
- Scans Gmail for unread emails under the "MIAA Bonuses" label
- Extracts dollar amounts, bonus type, and period
- Writes rows to the `Bonuses` tab
- Marks emails as read

### Manual setup required (one-time):
1. Create Gmail label: `MIAA Bonuses`
2. Create Gmail filter:
   - From: MIAA sender address
   - Subject contains: `bonus` OR `contingency` OR `profit sharing` OR `override`
   - Apply label: `MIAA Bonuses`
3. Deploy the bonus_ingestion.js script (see `scripts/bonus_ingestion.js`)

---

## Step 5: Review and Finalize (Day 8-10)

### Who does this: Edward

1. Open the Anvo Commission Tracker Sheet
2. Check the `Commissions` tab for any `needs_review` rows — resolve them
3. Check the `Bonuses` tab for any `needs_review` rows — resolve them
4. Verify the `Monthly Summary` tab numbers look reasonable
5. Check `ISM Cross-Check` for any variances
6. Add any manual notes in the `Monthly Summary` notes column
7. Done — the Sheet is now the monthly report

---

## File Locations

| What | Where |
|------|-------|
| Commission statements (raw files) | [Google Drive folder](https://drive.google.com/drive/folders/1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C) |
| Anvo Commission Tracker (data) | Google Sheets (link TBD after creation) |
| Commission ingestion script | `commissions/scripts/commission_ingestion.js` |
| Bonus ingestion script | `commissions/scripts/bonus_ingestion.js` |
| Sheet structure docs | `commissions/sheet_schema.md` |
| Carrier parsing notes | `commissions/carrier_reference.md` |
| This workflow | `commissions/workflow.md` |

---

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| CSV/Excel not auto-processing | Check Apps Script execution log. Verify Sheet ID and folder ID in config. |
| Carrier name shows as "UNKNOWN" | Add the carrier and aliases to the `Carriers` config tab in the Sheet |
| PDF data looks wrong | Compare against the original PDF in Drive. Update `carrier_reference.md` if the format changed. |
| Bonus email not picked up | Check the Gmail label is applied. Check the email is unread. |
| Month detection fails | Name files with clear month/year. Use folder names like "Mar" or "March 2026". |
| ISM cross-check shows variance | Usually timing differences. Check if the carrier statement covers a different period. |
