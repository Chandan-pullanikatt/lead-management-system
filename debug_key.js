const fs = require('fs');
const path = require('path');

const keyFilePath = path.join(__dirname, 'config', 'google_key.json');
const raw = fs.readFileSync(keyFilePath, 'utf8');
const keyData = JSON.parse(raw);

const pk = keyData.private_key;
console.log('Type:', typeof pk);
console.log('Length:', pk ? pk.length : 'NULL');
console.log('First 60 chars:', pk ? JSON.stringify(pk.substring(0, 60)) : 'NULL');
console.log('Last 60 chars:', pk ? JSON.stringify(pk.substring(pk.length - 60)) : 'NULL');
console.log('Contains actual newlines:', pk ? pk.includes('\n') : false);
console.log('Contains literal backslash-n:', pk ? pk.includes('\\n') : false);
