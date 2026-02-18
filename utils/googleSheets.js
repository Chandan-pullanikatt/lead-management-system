const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const getAuthClient = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            scopes: SCOPES
        });
        return await auth.getClient();
    } catch (error) {
        console.error('Error loading Google Auth:', error);
        return null;
    }
};

exports.appendLeadToSheet = async (lead) => {
    try {
        const auth = await getAuthClient();
        if (!auth) return null;

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

        if (!spreadsheetId) {
            console.warn('Google Sheet ID missing.');
            return null;
        }

        const resource = {
            values: [[
                lead.id,
                lead.name,
                lead.email,
                lead.phone,
                lead.course,
                lead.college,
                lead.year,
                lead.status,
                lead.created_at
            ]],
        };

        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:I', // Assuming Sheet1 and columns A-I
            valueInputOption: 'USER_ENTERED',
            resource,
        });

        // Parse the range to get the row number. Example: "Sheet1!A2:I2"
        const updatedRange = result.data.updates.updatedRange;
        // Basic extraction, might need robustness
        const match = updatedRange.match(/!A(\d+):/);
        const rowId = match ? parseInt(match[1]) : null;

        return rowId;

    } catch (error) {
        console.error('Error appending to sheet:', error);
        return null;
    }
};

exports.updateLeadInSheet = async (rowId, status) => {
    try {
        const auth = await getAuthClient();
        if (!auth || !rowId) return;

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

        // Assuming status is in column H (8th column)
        const range = `Sheet1!H${rowId}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[status]]
            }
        });

    } catch (error) {
        console.error('Error updating sheet:', error);
    }
};
