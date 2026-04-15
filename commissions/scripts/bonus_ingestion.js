/**
 * Bonus Email Ingestion — Google Apps Script
 *
 * Scans Gmail for MIAA bonus/contingency emails (identified by a Gmail label),
 * extracts payment data, and writes rows to the "Bonuses" tab of the
 * Anvo Commission Tracker Google Sheet.
 *
 * SETUP:
 * 1. In Gmail, create a label called "MIAA Bonuses" (or update GMAIL_LABEL below)
 * 2. Create a Gmail filter:
 *    - From: contains "miaa" or the specific MIAA sender address
 *    - Subject: contains "bonus" OR "contingency" OR "profit sharing" OR "override"
 *    - Action: Apply label "MIAA Bonuses", Never send to Spam
 * 3. Open Google Apps Script (script.google.com)
 * 4. Create a new project named "Anvo Bonus Ingestion"
 * 5. Paste this file into Code.gs
 * 6. Update the CONFIG section below
 * 7. Run setupTrigger() once
 * 8. Authorize when prompted (needs Gmail + Sheets access)
 *
 * HOW IT WORKS:
 * - Runs daily at 8 AM (configurable)
 * - Finds unread emails under the MIAA Bonuses label
 * - Extracts dollar amounts and bonus type from the email body
 * - Writes rows to the Bonuses tab
 * - Marks emails as read so they're not re-processed
 */

// ============================================================
// CONFIG
// ============================================================
const BONUS_CONFIG = {
  // Google Sheet ID
  SHEET_ID: '13CT2DuKgbyCq3N18on-fHLC4K-HxUIMokZN3kf0wNow',

  // Tab name
  BONUSES_TAB: 'Bonuses',

  // Gmail label for bonus emails
  GMAIL_LABEL: '[03] Commission, Bonuses/MIAA Bonuses',

  // Trigger time (hour of day, 0-23)
  TRIGGER_HOUR: 8,
};

// ============================================================
// TRIGGER SETUP — Run once
// ============================================================

function setupBonusTrigger() {
  // Remove existing triggers
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processBonusEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('processBonusEmails')
    .timeBased()
    .atHour(BONUS_CONFIG.TRIGGER_HOUR)
    .everyDays(1)
    .create();

  Logger.log('Trigger created: processBonusEmails daily at ' + BONUS_CONFIG.TRIGGER_HOUR + ':00');
}

// ============================================================
// MAIN PROCESSING
// ============================================================

function processBonusEmails() {
  const label = GmailApp.getUserLabelByName(BONUS_CONFIG.GMAIL_LABEL);

  if (!label) {
    Logger.log('Label "' + BONUS_CONFIG.GMAIL_LABEL + '" not found. Create it in Gmail first.');
    return;
  }

  // Get unread threads with this label
  const threads = label.getThreads();
  const sheet = SpreadsheetApp.openById(BONUS_CONFIG.SHEET_ID)
    .getSheetByName(BONUS_CONFIG.BONUSES_TAB);

  let processedCount = 0;

  for (const thread of threads) {
    const messages = thread.getMessages();

    for (const message of messages) {
      // Skip already-read messages (already processed)
      if (!message.isUnread()) continue;

      Logger.log('Processing email: ' + message.getSubject());

      try {
        const result = extractBonusData(message);

        // Dedupe: check if this bonus already exists in the Sheet
        // Match on carrier description + bonus type + original email date
        if (isDuplicate(sheet, result, message.getDate())) {
          message.markRead();
          Logger.log('Skipped duplicate: ' + message.getSubject());
          continue;
        }

        sheet.appendRow([
          result.bonusMonth,         // A: bonus_month
          result.source,             // B: source
          result.bonusType,          // C: bonus_type
          result.amount,             // D: amount
          result.description,        // E: description
          message.getDate(),         // F: email_date
          result.parseStatus,        // G: parse_status
          result.notes,              // H: notes
          new Date(),                // I: ingestion_date
        ]);

        message.markRead();
        processedCount++;
        Logger.log('Success: $' + result.amount + ' (' + result.bonusType + ')');

      } catch (error) {
        // Write error row
        sheet.appendRow([
          '',                        // bonus_month (unknown)
          'MIAA',                    // source
          'unknown',                 // bonus_type
          0,                         // amount
          '',                        // description
          message.getDate(),         // email_date
          'needs_review',            // parse_status
          'Parse error: ' + error.message + '. Subject: ' + message.getSubject(),
          new Date(),                // ingestion_date
        ]);

        message.markRead(); // Don't retry
        Logger.log('Error: ' + error.message);
      }
    }
  }

  Logger.log('Done. Processed ' + processedCount + ' bonus emails.');
}

// ============================================================
// DEDUPLICATION
// ============================================================

/**
 * Check if a bonus already exists in the Sheet.
 * Matches on: bonus_type (col C) + amount (col D) + description keywords.
 *
 * Why not match on email date? Because the original email and a forward
 * of the same email have different dates, causing false negatives.
 * Instead we match on type + amount + carrier name extracted from description.
 * Two genuinely different bonuses from the same carrier would almost never
 * be the exact same amount.
 */
function isDuplicate(sheet, result, emailDate) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return false;

  // Extract carrier keyword from description for matching
  // e.g., "Travelers Fixed, Value-Based Comp — OPPORTUNITY DIST..." -> "travelers"
  const resultCarrier = extractCarrierKeyword(result.description);

  for (let i = 1; i < data.length; i++) {
    const rowType = String(data[i][2] || '').trim();        // C: bonus_type
    const rowAmount = Number(data[i][3]) || 0;               // D: amount
    const rowDesc = String(data[i][4] || '');                 // E: description

    // Must match bonus type
    if (rowType !== result.bonusType) continue;

    // Must match amount (within 1 cent)
    if (Math.abs(rowAmount - result.amount) > 0.01) continue;

    // Must match carrier keyword from description
    const rowCarrier = extractCarrierKeyword(rowDesc);
    if (resultCarrier && rowCarrier && resultCarrier === rowCarrier) {
      return true;
    }

    // If we can't extract carrier but type + amount match exactly, still flag as dupe
    if (!resultCarrier || !rowCarrier) {
      if (Math.abs(rowAmount - result.amount) < 0.01 && rowAmount !== 0) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extract a carrier keyword from a bonus description for dedup matching.
 * Looks for known carrier names in the text.
 */
function extractCarrierKeyword(desc) {
  const lower = (desc || '').toLowerCase();
  const carriers = [
    'travelers', 'hartford', 'nationwide', 'state auto', 'liberty mutual',
    'guard', 'berkshire', 'markel', 'progressive', 'american modern', 'amig',
  ];
  for (const c of carriers) {
    if (lower.includes(c)) return c;
  }
  return '';
}

// ============================================================
// DATA EXTRACTION
// ============================================================

/**
 * Extract bonus data from an email message.
 * Parses the subject and body for amount, type, and period.
 *
 * MIAA/SIAA bonus emails follow a consistent pattern:
 *   "share of the profit is $X,XXX.XX"
 *   "Agency's share of the profit is $X,XXX.XX"
 * The emails also contain a large written premium number — ignore that.
 */
function extractBonusData(message) {
  const subject = message.getSubject();
  // Use getBody() (HTML) as primary — many MIAA emails are HTML-only
  // and getPlainBody() returns empty for those.
  // Strip HTML tags to get readable text.
  let body = message.getPlainBody();
  if (!body || body.trim().length < 20) {
    body = message.getBody().replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ').trim();
  }
  const combined = subject + ' ' + body;

  // Detect bonus type from subject/body keywords
  const bonusType = detectBonusType(combined);

  // Detect the period/month the bonus covers — fall back to email date month (cashflow basis)
  let bonusMonth = detectBonusMonth(combined);
  if (!bonusMonth) {
    const d = message.getDate();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    bonusMonth = d.getFullYear() + '-' + mm;
  }

  // Build description: extract carrier/program name from "bonus with [NAME]" pattern
  const carrierMatch = combined.match(/(?:bonus|profit sharing) with\s+([A-Z][A-Z\s,.'&-]+?)(?:\.|$)/im);
  const carrierName = carrierMatch ? carrierMatch[1].trim() : '';
  const description = carrierName
    ? carrierName + ' — ' + subject.substring(0, 150)
    : subject.substring(0, 200);

  // Check for "did not qualify" emails — these are $0 payouts, not errors
  if (/did not qualify|you did not qualify/i.test(combined)) {
    return {
      bonusMonth: bonusMonth,
      source: 'MIAA',
      bonusType: bonusType,
      amount: 0,
      description: description,
      parseStatus: 'auto_parsed',
      notes: 'Did not qualify for this distribution.',
    };
  }

  // Primary extraction: look for "share of the profit is $X"
  const profitPattern = /share of the profit is\s*\$\s*([\d,]+\.?\d*)/i;
  const profitMatch = combined.match(profitPattern);

  if (profitMatch) {
    const amount = parseFloat(profitMatch[1].replace(/,/g, ''));
    if (!isNaN(amount) && amount > 0) {
      // Also extract the written premium for context
      const premiumPattern = /produced\s*\$\s*([\d,]+\.?\d*)\s*(?:of|in)\s*written premium/i;
      const premiumMatch = combined.match(premiumPattern);
      const premiumNote = premiumMatch ? 'Written premium: $' + premiumMatch[1] : '';

      return {
        bonusMonth: bonusMonth,
        source: 'MIAA',
        bonusType: bonusType,
        amount: amount,
        description: description,
        parseStatus: 'auto_parsed',
        notes: premiumNote,
      };
    }
  }

  // Fallback: look for other common payout patterns
  const fallbackPatterns = [
    /your (?:agency'?s?\s+)?(?:share|portion|payment|bonus)\s+(?:is|of)\s+\$\s*([\d,]+\.?\d*)/i,
    /(?:payment|bonus|amount)\s+(?:of|is|due)\s+\$\s*([\d,]+\.?\d*)/i,
    /\$\s*([\d,]+\.?\d*)\s+(?:will be|has been)\s+(?:deposited|released|sent|paid)/i,
  ];

  for (const pattern of fallbackPatterns) {
    const match = combined.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        return {
          bonusMonth: bonusMonth,
          source: 'MIAA',
          bonusType: bonusType,
          amount: amount,
          description: description,
          parseStatus: 'auto_parsed',
          notes: 'Matched via fallback pattern. Verify.',
        };
      }
    }
  }

  // Last resort: extract all amounts, use the SMALLEST (profit share is always
  // smaller than written premium in these emails)
  const allAmounts = extractAmounts(combined);

  if (allAmounts.length === 0) {
    return {
      bonusMonth: bonusMonth,
      source: 'MIAA',
      bonusType: bonusType,
      amount: 0,
      description: description,
      parseStatus: 'needs_review',
      notes: 'No dollar amounts found. Manual entry required.',
    };
  }

  const smallest = allAmounts.sort((a, b) => a - b)[0];
  return {
    bonusMonth: bonusMonth,
    source: 'MIAA',
    bonusType: bonusType,
    amount: smallest,
    description: description,
    parseStatus: 'needs_review',
    notes: 'Could not match profit share pattern. Used smallest amount ($' + smallest + '). All amounts: $' + allAmounts.join(', $') + '. Verify.',
  };
}

/**
 * Detect the type of bonus from email content.
 */
function detectBonusType(text) {
  const lower = text.toLowerCase();

  if (lower.includes('contingency') || lower.includes('contingent')) return 'contingency';
  if (lower.includes('profit sharing') || lower.includes('profit-sharing')) return 'profit_sharing';
  if (lower.includes('growth bonus') || lower.includes('growth incentive')) return 'growth_bonus';
  if (lower.includes('override')) return 'override';
  if (lower.includes('incentive')) return 'growth_bonus';
  if (lower.includes('bonus')) return 'contingency'; // Default bonus type

  return 'other';
}

/**
 * Extract all dollar amounts from text.
 */
function extractAmounts(text) {
  const matches = [...text.matchAll(/\$\s*([\d,]+\.?\d*)/g)];
  return matches
    .map(m => parseFloat(m[1].replace(/,/g, '')))
    .filter(v => !isNaN(v) && v > 0);
}

/**
 * Detect the bonus period from email content.
 * Looks for patterns like "Q1 2026", "January 2026", "2025 Annual", etc.
 */
function detectBonusMonth(text) {
  const lower = text.toLowerCase();

  // Quarter patterns: "Q1 2026", "1st Quarter 2026"
  const quarterMap = { 'q1': '03', 'q2': '06', 'q3': '09', 'q4': '12',
                       '1st quarter': '03', '2nd quarter': '06',
                       '3rd quarter': '09', '4th quarter': '12' };
  for (const [pattern, month] of Object.entries(quarterMap)) {
    const regex = new RegExp(pattern + '\\s*(20\\d{2})', 'i');
    const match = lower.match(regex);
    if (match) return match[1] + '-' + month;
  }

  // Annual pattern: "2025 annual", "annual 2025"
  const annualMatch = lower.match(/(20\d{2})\s*annual|annual\s*(20\d{2})/i);
  if (annualMatch) return (annualMatch[1] || annualMatch[2]) + '-12';

  // Month + Year: "January 2026", "Jan 2026"
  const monthNames = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    january: '01', february: '02', march: '03', april: '04',
    june: '06', july: '07', august: '08', september: '09',
    october: '10', november: '11', december: '12',
  };

  for (const [name, num] of Object.entries(monthNames)) {
    const regex = new RegExp(name + '\\s*(20\\d{2})', 'i');
    const match = lower.match(regex);
    if (match) return match[1] + '-' + num;

    const regex2 = new RegExp('(20\\d{2})\\s*' + name, 'i');
    const match2 = lower.match(regex2);
    if (match2) return match2[1] + '-' + num;
  }

  return ''; // Could not detect — needs manual entry
}

// ============================================================
// ATTACHMENT PROCESSING (for bonus statements as PDF attachments)
// ============================================================

/**
 * If the bonus email has a PDF attachment, attempt to extract text via Drive OCR.
 * Falls back to email body parsing if OCR fails.
 */
function extractFromAttachment(message) {
  const attachments = message.getAttachments();

  for (const attachment of attachments) {
    if (attachment.getContentType() === 'application/pdf') {
      try {
        // Upload PDF to Drive temporarily
        const tempFile = DriveApp.createFile(attachment);

        // Convert to Google Doc (triggers OCR)
        const ocrResource = {
          title: 'TEMP_bonus_ocr_' + Date.now(),
          mimeType: MimeType.GOOGLE_DOCS,
        };
        const ocrFile = Drive.Files.copy(ocrResource, tempFile.getId());
        const doc = DocumentApp.openById(ocrFile.id);
        const text = doc.getBody().getText();

        // Cleanup temp files
        DriveApp.getFileById(ocrFile.id).setTrashed(true);
        tempFile.setTrashed(true);

        return text;
      } catch (e) {
        Logger.log('Could not OCR attachment: ' + e.message);
      }
    }
  }

  return null;
}

// ============================================================
// MANUAL RUN
// ============================================================

function manualBonusRun() {
  Logger.log('Starting manual bonus email processing...');
  processBonusEmails();
  Logger.log('Manual run complete.');
}
