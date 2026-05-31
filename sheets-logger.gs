/**
 * Mas Mentality — Carnival 2026 Registration Logger
 * Google Apps Script Web App (doGet)
 *
 * Deployment:
 *   1. Open https://script.google.com and paste this file
 *   2. Deploy > New Deployment > Web App
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   3. Copy the deployment URL into index.html → SHEETS_URL
 *
 * To update an existing deployment after code changes:
 *   Deploy > Manage Deployments > edit the existing deployment
 */

function doGet(e) {
  try {
    const ss    = SpreadsheetApp.openById('1990cIYlP-vL-TD5Wy6Ct0JsPmNf6t2qN5isYNB67Rbk');
    const sheet = ss.getActiveSheet();
    const p     = e.parameter;

    const HEADERS = [
      'Timestamp',
      'Masquerader Count',
      'Masqueraders',          // full text summary — one line per masquerader
      'Parent Name',
      'Phone',
      'Email',
      'Instagram',
      'Crew Name',             // populated when 4+ masqueraders
      'T-Shirts',
      'Promo Code',
      'Photo Consent',
      'Modelling Interest 2027',
      'Notes',
      'Estimated Total',
      'Deposit Due',
    ];

    // Write header row on first use
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);

      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1a1a');
      headerRange.setFontColor('#C8971A');   // gold on black

      // Widen the Masqueraders column so the summary text is readable
      sheet.setColumnWidth(3, 420);
      sheet.setColumnWidth(1, 160);  // Timestamp
    }

    sheet.appendRow([
      new Date(),
      p.masqueraderCount     || '1',
      p.masqueraders         || '',
      p.parentName           || '',
      p.phone                || '',
      p.email                || '',
      p.instagram            || 'N/A',
      p.crewName             || 'N/A',
      p.tshirts              || 'None',
      p.promoCode            || 'None',
      p.photoConsent         || 'No',
      p.modellingInterest    || 'No',
      p.notes                || 'None',
      p.estimatedTotal       || '',
      p.depositDue           || '',
    ]);

    return ContentService.createTextOutput('OK');

  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.toString());
  }
}
