# Handoff Notes

**Session ended:** 2026-04-15
**Repo:** anvo-ops

## What was accomplished
- Built full monthly commission & bonus reporting system in `commissions/` — committed as `34d074e`
- Created Google Sheet "Anvo Commission Tracker" (Sheet ID: `13CT2DuKgbyCq3N18on-fHLC4K-HxUIMokZN3kf0wNow`) with Jan+Feb SIAA carrier data, formulas, ISM cross-check
- Wrote `commissions/scripts/commission_ingestion.js` — auto-ingests CSV/Excel from Drive folder, skips PDFs and complex Excel formats (TRV PI, Progressive, Nationwide)
- Wrote `commissions/scripts/bonus_ingestion.js` — scans Gmail label `[03] Commission, Bonuses/MIAA Bonuses` for bonus emails, extracts amounts using "share of the profit" pattern, handles HTML-only emails via `getBody()`, deduplicates on carrier+type+amount, detects "did not qualify" emails as $0
- Wrote `commissions/scripts/attachment_saver.js` (NEW, uncommitted) — saves MGA/wholesaler email attachments from personal Gmail to Drive folder, organized by month. Deployed on personal account, watches `MGA Commissions` label
- Added Steadily and MGT Insurance (via Ascend) as new carriers in `commissions/carrier_reference.md`
- Updated `commission_ingestion.js` to handle MGT's `net_amount`/`gross_amount` columns, extract Policy Detail rows, and include `payment_status` column

## What's in progress
- **v3 Excel not yet built** — Google Sheet still has v1 data (Jan+Feb only, no March, no Policy Detail tab, no P/L split, no payment_status column, no MGA/Wholesale). Need to build final Excel with all data and have Edward upload to replace the Sheet.
- **March PDFs not yet processed** — Guard.pdf and Markel.pdf in the March Drive folder need to be read and their data extracted into the Sheet.
- **Uncommitted files:** `commissions/scripts/attachment_saver.js` (new), updated `commissions/carrier_reference.md` (added Steadily + MGT), updated `commissions/scripts/commission_ingestion.js` (MGT format, Policy Detail, skip patterns). Also `Anvo_Commission_Tracker.xlsx` in repo root (don't commit — binary, lives in Drive).
- **Bonuses tab needs cleanup** — has ~70 duplicate/stale rows from multiple script runs. Clear tab and do one clean re-run after all script fixes are deployed.

## What's next
1. Read all remaining PDFs from Drive (Jan, Feb, Mar) and build the final v3 Excel with complete data
2. Clear Bonuses tab, deploy latest bonus_ingestion.js, do clean re-run
3. Commit uncommitted changes (attachment_saver.js, carrier_reference.md, commission_ingestion.js)
4. Push to GitHub (Edward needs to push from his machine — Cowork can't authenticate)
5. Edward considering moving repo to a GitHub org (`anvo-insurance`) — transfer from `edward728/anvo-ops`
6. Write quick-start setup guide for Alice/Ling to connect their Cowork sessions

## Gotchas
- Gmail `getPlainBody()` returns empty for MIAA HTML-only emails — must use `getBody()` with HTML tag stripping as fallback
- Bonus dedupe matches on carrier+type+amount (not email date) because forwards have different dates than originals
- TRV PI Excel, Progressive Excel, and Nationwide Excel are too messy for auto-parsing — script explicitly skips them, Claude handles in monthly sessions
- Cochrane reconciliations are `accrued` not `received` — AR doesn't true up until renewal. Track in Sheet but exclude from net income.
- Attachment saver needed `MIN_FILE_SIZE` lowered from 1000 to 100 bytes for small MGT CSVs, and `text/plain` MIME type only passes if filename ends in `.csv`
- Drive folder: https://drive.google.com/drive/folders/1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C — tracker Sheet is now inside this folder per Edward's reorganization
