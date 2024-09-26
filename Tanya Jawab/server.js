// server.js

const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Load credentials from file
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// Configure the Google Sheets API
const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth: client });

const app = express();
app.use(bodyParser.json());

// ID Spreadsheet Anda
const spreadsheetId = '16B5__NO0JMZvWa_3TvTGMtke543NIPlHqbxq-vVQB_4'; // Ganti dengan ID Spreadsheet Anda

// Endpoint untuk mendapatkan semua komentar dari Google Spreadsheet
app.get('/get-comments', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A2:B', // Mengambil data dari kolom A (nama) dan B (komentar)
        });

        const rows = response.data.values;
        if (rows.length) {
            const comments = rows.map((row) => ({
                name: row[0],
                comment: row[1]
            }));
            res.json(comments);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).send('Error fetching comments');
    }
});

// Endpoint untuk menambahkan komentar baru ke Google Spreadsheet
app.post('/post-comment', async (req, res) => {
    const { name, comment } = req.body;

    if (!name || !comment) {
        return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:B',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[name, comment]]
            }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('Error posting comment:', err);
        res.status(500).send('Error posting comment');
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
