const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

async function test() {
    try {
        const keyFilePath = path.join(__dirname, 'config', 'google_key.json');
        const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

        const auth = new google.auth.JWT({
            email: keyData.client_email,
            key: keyData.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        await auth.authorize();
        console.log('AUTH SUCCESS');

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1cPPv4GhsdC_zxm6O1yo5bc1EqBLu2jKNB0Qsml-_KCo';

        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:I',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [['TEST-99', 'Test User', 'testuser@test.com', '9999999999', 'MBA', 'Test College', '2nd Year', 'new', new Date().toISOString()]]
            },
        });

        console.log('SHEET WRITE SUCCESS!');
        console.log('Updated range:', result.data.updates.updatedRange);
    } catch (err) {
        console.error('ERROR:', err.message);
        if (err.response) {
            console.error('Response status:', err.response.status);
            console.error('Response data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

test();
