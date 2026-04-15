/**
 * Commission CSV/Excel Auto-Ingestion — Google Apps Script
 *
 * Monitors the Commission Statements Drive folder for new CSV/XLSX files.
 * Parses them and writes structured rows into the "Commissions" tab of the
 * Anvo Commission Tracker Google Sheet.
 *
 * PDFs are NOT processed by this script — they're handled by Claude
 * during monthly Cowork sessions. This script skips PDFs and only
 * processes CSV and Excel files.
 *
 * SETUP:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project named "Anvo Commission Ingestion"
 * 3. Paste this entire file into Code.gs
 * 4. Enable the Google Drive API:
 *    - In the Apps Script editor, click "Services" (+ icon on the left)
 *    - Scroll to "Drive API" and click "Add"
 * 5. Update the CONFIG section below with your IDs
 * 6. Run setupTrigger() once to create the scheduled trigger
 * 7. Authorize when prompted (needs Drive + Sheets access)
 *
 * HOW IT WORKS:
 * - Runs every 6 hours (configurable)
 * - Scans ALL subfolders under the upload folder (e.g., 2026/Jan, 2026/Feb)
 * - Processes only CSV and XLSX files that haven't been logged yet
 * - Skips PDFs entirely (those are for Claude)
 * - Uses a "Processed Files" tracking mechanism to avoid re-processing
 * - Each file becomes one or more rows in the Commissions tab
 */

// ============================================================
// CONFIG — Update these values after setup
// ============================================================
const CONFIG = {
  // Google Sheet ID (from URL: docs.google.com/spreadsheets/d/{THIS_PART}/edit)
  SHEET_ID: '13CT2DuKgbyCq3N18on-fHLC4K-HxUIMokZN3kf0wNow',

  // Root Drive folder ID for commission statements
  // (from URL: drive.google.com/drive/folders/{THIS_PART})
  ROOT_FOLDER_ID: '1z1W_KpWoG3ue83XSAnUsr0ddGFXtdQ5C',

  // Tab names (must match sheet_schema.md)
  COMMISSIONS_TAB: 'Commissions',
  CARRIERS_TAB: 'Carriers',

  // Trigger interval
  CHECK_INTERVAL_HOURS: 6,

  // Property key for tracking processed files
  PROCESSED_KEY: 'processed_file_ids',
};

// ============================================================
// TRIGGER SETUP — Run once
// ============================================================

function setupTrigger() {
  // Remove existing triggers for this function
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processNewFiles') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('processNewFiles')
    .timeBased()
    .everyHours(CONFIG.CHECK_INTERVAL_HOURS)
    .create();

  Logger.log('Trigger created: processNewFiles every ' + CONFIG.CHECK_INTERVAL_HOURS + ' hours');
}

// ============================================================
// MAIN PROCESSING
// ============================================================

function processNewFiles() {
  const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
    .getSheetByName(CONFIG.COMMISSIONS_TAB);
  const carrierConfig = loadCarrierConfig();
  const processedIds = getProcessedIds();

  let newCount = 0;
  let skipCount = 0;

  // Recursively scan all subfolders
  const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
  const files = getAllFilesRecursive(rootFolder);

  for (const file of files) {
    const fileId = file.getId();
    const mimeType = file.getMimeType();

    // Skip already-processed files
    if (processedIds.has(fileId)) continue;

    // Skip PDFs — those are handled by Claude
    if (mimeType === 'application/pdf') {
      skipCount++;
      continue;
    }

    // Only process CSV and Excel
    if (!isCsvOrExcel(mimeType)) {
      continue;
    }

    Logger.log('Processing: ' + file.getName());

    try {
      const rows = parseFile(file, mimeType, carrierConfig);
      for (const row of rows) {
        sheet.appendRow(row);
      }
      processedIds.add(fileId);
      newCount++;
      Logger.log('Success: ' + file.getName() + ' (' + rows.length + ' rows)');
    } catch (error) {
      // Write an error row so it shows up for review
      sheet.appendRow([
        detectMonthFromPath(file),    // report_month
        'UNKNOWN',                     // carrier
        '',                            // lob
        0,                             // premium_volume
        0,                             // gross_commission
        '',                            // commission_rate (auto-calc)
        '',                            // network
        file.getMimeType().includes('csv') ? 'csv' : 'xlsx', // source_type
        file.getName(),                // source_file
        'needs_review',                // parse_status
        'Parse error: ' + error.message, // notes
        new Date(),                    // ingestion_date
      ]);
      processedIds.add(fileId); // Don't retry on next run
      Logger.log('Error: ' + file.getName() + ' - ' + error.message);
    }
  }

  saveProcessedIds(processedIds);
  Logger.log('Done. New files: ' + newCount + ', PDFs skipped: ' + skipCount);
}

// ============================================================
// FILE PARSING
// ============================================================

function parseFile(file, mimeType, carrierConfig) {
  let data;

  if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
    data = parseCsv(file);
  } else {
    data = parseXlsx(file);
  }

  if (!data || data.length < 2) {
    throw new Error('File has no data rows');
  }

  const headers = data[0].map(h => String(h).trim().toLowerCase());
  const carrier = detectCarrier(file.getName(), carrierConfig);
  const month = detectMonthFromPath(file);
  const fileType = mimeType.includes('csv') ? 'csv' : 'xlsx';

  // Detect key columns
  const colMap = detectColumns(headers);

  if (colMap.commission === -1) {
    throw new Error('Could not find commission column. Headers: ' + headers.join(', '));
  }

  // Build output rows
  // If the file has LOB information, create separate rows per LOB
  // Otherwise, create a single summary row
  const lobTotals = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const commission = parseCurrency(String(row[colMap.commission] || ''));
    if (isNaN(commission)) continue;

    const premium = colMap.premium !== -1 ? parseCurrency(String(row[colMap.premium] || '')) : 0;
    const lob = colMap.lob !== -1 ? normalizeLob(String(row[colMap.lob] || '')) : 'Both';

    if (!lobTotals[lob]) {
      lobTotals[lob] = { premium: 0, commission: 0 };
    }
    lobTotals[lob].premium += isNaN(premium) ? 0 : premium;
    lobTotals[lob].commission += commission;
  }

  const outputRows = [];
  for (const [lob, totals] of Object.entries(lobTotals)) {
    outputRows.push([
      month,                                        // A: report_month
      carrier.name || 'UNKNOWN',                    // B: carrier
      lob,                                          // C: lob
      Math.round(totals.premium * 100) / 100,       // D: premium_volume
      Math.round(totals.commission * 100) / 100,     // E: gross_commission
      totals.premium > 0
        ? Math.round((totals.commission / totals.premium) * 10000) / 100 + '%'
        : '',                                        // F: commission_rate
      carrier.network || '',                         // G: network
      fileType,                                      // H: source_type
      file.getName(),                                // I: source_file
      'auto_parsed',                                 // J: parse_status
      '',                                            // K: notes
      new Date(),                                    // L: ingestion_date
    ]);
  }

  return outputRows;
}

function parseCsv(file) {
  const content = file.getBlob().getDataAsString();
  return Utilities.parseCsv(content);
}

function parseXlsx(file) {
  // Convert XLSX to temp Google Sheet for reading
  const resource = {
    title: 'TEMP_commission_parse_' + Date.now(),
    mimeType: MimeType.GOOGLE_SHEETS,
  };
  const tempFile = Drive.Files.copy(resource, file.getId());

  try {
    const tempSheet = SpreadsheetApp.openById(tempFile.id);
    return tempSheet.getSheets()[0].getDataRange().getValues();
  } finally {
    DriveApp.getFileById(tempFile.id).setTrashed(true);
  }
}

// ============================================================
// COLUMN DETECTION
// ============================================================

function detectColumns(headers) {
  return {
    commission: findColumn(headers, [
      'commission', 'comm', 'commission amount', 'gross commission',
      'net commission', 'agency commission', 'commission earned',
      'comm. due', 'comm due', 'total commission',
    ]),
    premium: findColumn(headers, [
      'premium', 'premium volume', 'written premium', 'net written premium',
      'transaction premium', 'policy premium', 'premium collected',
    ]),
    lob: findColumn(headers, [
      'lob', 'line of business', 'line', 'product', 'product type',
      'coverage', 'policy type',
    ]),
  };
}

function findColumn(headers, patterns) {
  // Exact match first
  for (const pattern of patterns) {
    const idx = headers.indexOf(pattern);
    if (idx !== -1) return idx;
  }
  // Partial match
  for (const pattern of patterns) {
    const idx = headers.findIndex(h => h.includes(pattern));
    if (idx !== -1) return idx;
  }
  return -1;
}

// ============================================================
// CARRIER DETECTION
// ============================================================

function detectCarrier(fileName, carrierConfig) {
  const lower = fileName.toLowerCase();

  for (const carrier of carrierConfig) {
    // Check aliases
    for (const alias of carrier.aliases) {
      if (lower.includes(alias.toLowerCase())) return carrier;
    }
    // Check canonical name
    if (lower.includes(carrier.name.toLowerCase())) return carrier;
  }

  return { name: 'UNKNOWN', aliases: [], network: '', format: '' };
}

function loadCarrierConfig() {
  try {
    const configSheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
      .getSheetByName(CONFIG.CARRIERS_TAB);
    const data = configSheet.getDataRange().getValues();
    if (data.length < 2) return [];

    return data.slice(1)
      .filter(row => row[0] && row[5] !== false && row[5] !== 'FALSE')
      .map(row => ({
        name: String(row[0]).trim(),
        aliases: String(row[1] || '').split(',').map(a => a.trim()).filter(a => a),
        network: String(row[2] || '').trim(),
        format: String(row[3] || '').trim(),
        lob: String(row[4] || '').trim(),
      }));
  } catch (e) {
    Logger.log('Could not load carrier config: ' + e.message);
    return [];
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function isCsvOrExcel(mimeType) {
  return [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ].includes(mimeType);
}

function parseCurrency(str) {
  if (!str) return NaN;
  const isNeg = str.includes('(') && str.includes(')');
  const cleaned = str.replace(/[$,\(\)\s]/g, '');
  const val = parseFloat(cleaned);
  return isNeg ? -val : val;
}

function normalizeLob(lob) {
  const lower = lob.toLowerCase();
  if (lower.includes('personal') || lower === 'p/l' || lower === 'pl') return 'P/L';
  if (lower.includes('commercial') || lower === 'c/l' || lower === 'cl') return 'C/L';
  return lob || 'Both';
}

/**
 * Try to detect the report month from the file's parent folder name.
 * Folder naming convention: "2026 Jan", "Feb", "March 2026", etc.
 */
function detectMonthFromPath(file) {
  const monthMap = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    january: '01', february: '02', march: '03', april: '04',
    june: '06', july: '07', august: '08', september: '09',
    october: '10', november: '11', december: '12',
  };

  // Check parent folder names for month/year info
  const parents = file.getParents();
  const folderNames = [];
  while (parents.hasNext()) {
    folderNames.push(parents.next().getName());
  }

  const combined = folderNames.join(' ').toLowerCase();

  // Look for year
  const yearMatch = combined.match(/(20\d{2})/);
  const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();

  // Look for month name
  for (const [name, num] of Object.entries(monthMap)) {
    if (combined.includes(name)) {
      return year + '-' + num;
    }
  }

  // Also try filename
  const fnLower = file.getName().toLowerCase();
  for (const [name, num] of Object.entries(monthMap)) {
    if (fnLower.includes(name)) {
      const fnYear = fnLower.match(/(20\d{2})/);
      return (fnYear ? fnYear[1] : year) + '-' + num;
    }
  }

  return ''; // Needs manual entry
}

/**
 * Recursively get all files from a folder and its subfolders.
 */
function getAllFilesRecursive(folder) {
  const allFiles = [];

  // Get files in this folder
  const files = folder.getFiles();
  while (files.hasNext()) {
    allFiles.push(files.next());
  }

  // Recurse into subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const subFiles = getAllFilesRecursive(subfolders.next());
    allFiles.push(...subFiles);
  }

  return allFiles;
}

// ============================================================
// PROCESSED FILE TRACKING
// ============================================================

function getProcessedIds() {
  const stored = PropertiesService.getScriptProperties()
    .getProperty(CONFIG.PROCESSED_KEY);
  return new Set(stored ? JSON.parse(stored) : []);
}

function saveProcessedIds(ids) {
  PropertiesService.getScriptProperties()
    .setProperty(CONFIG.PROCESSED_KEY, JSON.stringify([...ids]));
}

/**
 * Reset the processed file tracking. Use if you need to re-process files.
 * Run manually from the Apps Script editor.
 */
function resetProcessedTracking() {
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.PROCESSED_KEY);
  Logger.log('Processed file tracking has been reset. Next run will re-process all files.');
}

// ============================================================
// MANUAL RUN
// ============================================================

function manualRun() {
  Logger.log('Starting manual commission ingestion...');
  processNewFiles();
  Logger.log('Manual run complete.');
}
