import { google } from 'googleapis'
import { GOOGLE } from '$env/static/private'

const googleAuth = new google.auth.GoogleAuth({
    credentials: JSON.parse(GOOGLE),
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
})
let googleSheets = google.sheets({version: "v4"})

export async function getDataEntry(spreadsheetId) {
    const rows = await googleSheets.spreadsheets.values.get({
        auth: googleAuth, 
        spreadsheetId,
        range: `'Data Entry'!A3:AB47`
    })
    return rows.data.values
}

export async function updateRow(spreadsheetId, rowNum, frenzy1, frenzy2, frenzy3, box, fin, broke, ac, score, note) {
    await googleSheets.spreadsheets.values.batchUpdate({
        auth: googleAuth, 
        spreadsheetId,
        requestBody: {
            valueInputOption: "RAW",
            data: [
                {
                    majorDimension: "ROWS",
                    range: `O${rowNum}`,
                    values: [[frenzy1, frenzy2, frenzy3, box, fin, broke, ac]],
                },
                {
                    majorDimension: "ROWS",
                    range: `Y${rowNum}`,
                    values: [[score, note]],
                },
            ],
          },
    })
}
