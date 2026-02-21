const { google } = require('googleapis');
require('dotenv').config();

const path = require('path');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const getAuthClient = async () => {
    try {
        let keyData;
        const keyFilePath = path.join(__dirname, '../config/google_key.json');

        if (fs.existsSync(keyFilePath)) {
            keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
        } else if (process.env.GOOGLE_CREDENTIALS) {
            keyData = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        } else {
            console.error('No Google credentials found. Provide config/google_key.json or GOOGLE_CREDENTIALS env var.');
            return null;
        }

        const auth = new google.auth.JWT({
            email: keyData.client_email,
            key: keyData.private_key,
            scopes: SCOPES
        });

        await auth.authorize();
        return auth;
    } catch (error) {
        console.error('Error loading Google Auth:', error.message);
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
