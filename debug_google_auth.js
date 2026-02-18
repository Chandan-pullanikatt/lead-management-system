require('dotenv').config();
const { google } = require('googleapis');

const checkAuth = async () => {
    console.log('Checking Google Auth...');
    console.log('Sheet ID from ENV:', process.env.GOOGLE_SHEETS_ID);
    console.log('Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (privateKey) {
        // Same logic as in utils/googleSheets.js
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '');
        console.log('Private Key length:', privateKey.length);
        console.log('Private Key starts with:', privateKey.substring(0, 30));
        console.log('Private Key ends with:', privateKey.substring(privateKey.length - 30));
    } else {
        console.log('Private Key is MISSING in ENV');
        return;
    }

    try {
        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            privateKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        await auth.authorize();
        console.log('Authentication SUCCESSFUL!');
    } catch (error) {
        console.error('Authentication FAILED:', error.message);
    }
};

checkAuth();
