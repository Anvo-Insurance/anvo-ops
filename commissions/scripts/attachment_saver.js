/**
 * Email Attachment Saver — Google Apps Script
 *
 * Watches a Gmail label for new emails with attachments, saves the
 * attachments to a Google Drive folder (organized by month), and
 * marks the email as processed.
 *
 * USE CASE: MGA/wholesaler commission emails (MGT via Ascend, Cochrane, etc.)
 * arrive at a personal Gmail account with PDF/Excel attachments. This script
 * auto-saves those attachments to the shared Commission Statements Drive folder
 * so Claude and team can access them during monthly processing.
 *
 * SETUP:
 * 1. Share the Commission Statements Drive folder with the Gmail account
 *    running this script (give it Editor access)
 * 2. Create a Gmail label for MGA commission emails (e.g., "MGA Commissions")
 * 3. Create Gmail filters to auto-label incoming MGA emails
 * 4. Open Google Apps Script (script.google.com) from the personal account
 * 5. Create a new project named "Anvo Attachment Saver"
 * 6. Paste this file into Code.gs
 * 7. Update the CONFIG section below
 * 8. Run setupAttachmentTrigger() once
 * 9. Authorize when prompted (needs Gmail + Drive access)
 *
 * HOW IT WORKS:
 * - Runs every 2 hours (configurable)
 * - Scans for unread emails under the specified label
 * - Saves all attachments to Drive, organized into monthly subfolders
 * - Prefixes filenames with the sender/carrier name for clarity
 * - Marks emails as read after processing
 * - Skips image attachments (logos, signatures) — only saves PDF, Excel, CSV
 */

// ============================================================
// CONFIG
// ============================================================
const ATTACH_CONFIG = {
  // Google Drive folder ID for commission statements
  // This is the root "Commission Statements" folder
  DRIVE_FOLDER_ID: '1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C',

  // Gmail label to watch
  GMAIL_LABEL: 'MGA Commissions',

  // Trigger interval (hours)
  CHECK_INTERVAL_HOURS: 2,

  // File types to save (skip images, signatures, etc.)
  ALLOWED_TYPES: [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',              // CSVs often sent as text/plain
    'application/octet-stream', // Sometimes Excel files come as this
  ],

  // Also match by file extension as fallback (some emails have generic MIME types)
  ALLOWED_EXTENSIONS: ['.pdf', '.xlsx', '.xls', '.csv'],

  // Minimum file size in bytes (skip tiny images disguised as attachments)
  MIN_FILE_SIZE: 100, // 100 bytes — MGA CSVs can be small (few policies)
};

// ============================================================
// TRIGGER SETUP — Run once
// ============================================================

function setupAttachmentTrigger() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'saveAttachments') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('saveAttachments')
    .timeBased()
    .everyHours(ATTACH_CONFIG.CHECK_INTERVAL_HOURS)
    .create();

  Logger.log('Trigger created: saveAttachments every '
    + ATTACH_CONFIG.CHECK_INTERVAL_HOURS + ' hours');
}

// ============================================================
// MAIN PROCESSING
// ============================================================

function saveAttachments() {
  const label = GmailApp.getUserLabelByName(ATTACH_CONFIG.GMAIL_LABEL);
  if (!label) {
    Logger.log('Label "' + ATTACH_CONFIG.GMAIL_LABEL + '" not found.');
    return;
  }

  const rootFolder = DriveApp.getFolderById(ATTACH_CONFIG.DRIVE_FOLDER_ID);
  const threads = label.getThreads();
  let savedCount = 0;

  for (const thread of threads) {
    const messages = thread.getMessages();

    for (const message of messages) {
      if (!message.isUnread()) continue;

      const attachments = message.getAttachments();
      if (attachments.length === 0) {
        message.markRead();
        continue;
      }

      // Determine the month folder based on email date
      const emailDate = message.getDate();
      const monthFolder = getOrCreateMonthFolder(rootFolder, emailDate);

      // Extract carrier/sender name for filename prefix
      const carrierPrefix = extractCarrierPrefix(message);

      for (const attachment of attachments) {
        if (!isAllowedAttachment(attachment)) continue;

        // Build a clear filename: "MGT - Funding Report 2026-04-03.pdf"
        const originalName = attachment.getName();
        const newName = carrierPrefix
          ? carrierPrefix + ' - ' + originalName
          : originalName;

        // Check for duplicates (same filename in the same folder)
        if (fileExistsInFolder(monthFolder, newName)) {
          Logger.log('Skipped duplicate: ' + newName);
          continue;
        }

        monthFolder.createFile(attachment.copyBlob().setName(newName));
        savedCount++;
        Logger.log('Saved: ' + newName + ' -> ' + monthFolder.getName());
      }

      message.markRead();
    }
  }

  Logger.log('Done. Saved ' + savedCount + ' attachments.');
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get or create a monthly subfolder: 2026 > March
 */
function getOrCreateMonthFolder(rootFolder, date) {
  const year = date.getFullYear().toString();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[date.getMonth()];

  // Get or create year folder
  let yearFolder;
  const yearFolders = rootFolder.getFoldersByName(year);
  if (yearFolders.hasNext()) {
    yearFolder = yearFolders.next();
  } else {
    yearFolder = rootFolder.createFolder(year);
  }

  // Get or create month folder (try common naming variations)
  const monthVariations = [monthName, monthName.substring(0, 3),
    year + ' ' + monthName.substring(0, 3)];

  for (const variation of monthVariations) {
    const folders = yearFolder.getFoldersByName(variation);
    if (folders.hasNext()) return folders.next();
  }

  // Create new month folder
  return yearFolder.createFolder(monthName);
}

/**
 * Extract a carrier name prefix from the email for clearer filenames.
 */
function extractCarrierPrefix(message) {
  const subject = message.getSubject().toLowerCase();
  const from = message.getFrom().toLowerCase();
  const body = (message.getPlainBody() || '').toLowerCase();

  // Known MGA/wholesaler patterns
  const patterns = [
    { match: /ascend|useascend/i, carrier: detectAscendPartner(body) || 'Ascend' },
    { match: /cochrane/i, carrier: 'Cochrane' },
    { match: /burns.*wilcox|b&w/i, carrier: 'Burns Wilcox' },
    { match: /rps|risk placement/i, carrier: 'RPS' },
    { match: /amwins/i, carrier: 'Amwins' },
    { match: /crc.*group|crc insurance/i, carrier: 'CRC' },
    { match: /hull.*associates/i, carrier: 'Hull' },
  ];

  const combined = from + ' ' + subject;
  for (const p of patterns) {
    if (p.match.test(combined)) return p.carrier;
  }

  // Fallback: use sender name
  const senderMatch = message.getFrom().match(/^"?([^"<]+)"?\s*</);
  if (senderMatch) return senderMatch[1].trim();

  return '';
}

/**
 * Ascend emails process payments for various MGAs.
 * Extract the actual partner name from the email body.
 */
function detectAscendPartner(body) {
  const partnerMatch = body.match(/partner:\s*(.+)/i);
  if (partnerMatch) return partnerMatch[1].trim();
  return null;
}

/**
 * Check if an attachment should be saved (not an image/logo/signature).
 */
function isAllowedAttachment(attachment) {
  const mimeType = attachment.getContentType();
  const name = attachment.getName().toLowerCase();
  const size = attachment.getSize();

  // Skip tiny files (logos, tracking pixels)
  if (size < ATTACH_CONFIG.MIN_FILE_SIZE) return false;

  // Check MIME type (but for text/plain, require a .csv extension to avoid grabbing .txt junk)
  if (mimeType === 'text/plain') {
    return name.endsWith('.csv');
  }
  if (ATTACH_CONFIG.ALLOWED_TYPES.includes(mimeType)) return true;

  // Check file extension as fallback
  for (const ext of ATTACH_CONFIG.ALLOWED_EXTENSIONS) {
    if (name.endsWith(ext)) return true;
  }

  return false;
}

/**
 * Check if a file with the same name already exists in a folder.
 */
function fileExistsInFolder(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  return files.hasNext();
}

// ============================================================
// MANUAL RUN
// ============================================================

function manualAttachmentRun() {
  Logger.log('Starting manual attachment save...');
  saveAttachments();
  Logger.log('Manual run complete.');
}
