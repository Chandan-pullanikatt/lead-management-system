function sendReminders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Column Indices (Assuming standard order from backend)
  // ID, Name, Email, Phone, Course, College, Year, Status, CreatedAt
  const STATUS_COL = 7; // Column H (0-indexed)
  const CREATED_AT_COL = 8; // Column I
  const REMINDER_SENT_COL = 9; // Column J (New column for tracking)

  const DATA_START_ROW = 1; // Skip header

  const now = new Date();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (let i = DATA_START_ROW; i < data.length; i++) {
    const row = data[i];
    const status = row[STATUS_COL];
    const createdAtStr = row[CREATED_AT_COL];
    const reminderSent = row[REMINDER_SENT_COL];

    if (status === 'new' && !reminderSent) {
      const createdAt = new Date(createdAtStr);
      const diff = now - createdAt;

      if (diff > ONE_DAY_MS) {
        const name = row[1];
        const email = row[2];
        const course = row[4];

        sendEmail(email, name, course);
        
        // Mark as reminder sent
        sheet.getRange(i + 1, REMINDER_SENT_COL + 1).setValue('Yes');
      }
    }
  }
}

function sendEmail(email, name, course) {
  const subject = `Reminder: Complete your enrollment for ${course}`;
  const body = `Dear ${name},\n\nThis is a reminder to complete your enrollment for the ${course} course at GlobalEd.\n\nPlease contact us if you have any questions.\n\nBest regards,\nGlobalEd Team`;
  const adminEmail = 'admin@globaled.in'; // Replace with actual admin email

  MailApp.sendEmail({
    to: email,
    cc: adminEmail,
    subject: subject,
    body: body
  });
}

function createTrigger() {
  ScriptApp.newTrigger('sendReminders')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}
