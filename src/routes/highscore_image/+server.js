import { error } from "@sveltejs/kit";
import { createCanvas } from "canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function GET({ fetch }) {
    const response = await fetch(`/api/user`)
    const user = response.status < 300 ? await response.json() : null
    if (!user)
        return error(401, 'Not logged in')
    if (!user.spreadsheetId)
        return error(500, 'spreadsheet is not configured')

    const url = `https://docs.google.com/spreadsheets/d/${user.spreadsheetId}/export?format=pdf&gid=756412317`
    const doc = await getDocument(url).promise.catch(e => {})
    if (!doc)
        return error(500, 'Failed to fetch the Google Sheet document. Make sure to allow "Anyone with the link" to view the sheet.')
    
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: 5.0 })
    const canvas = createCanvas(viewport.width, viewport.height, 'pdf')
    const ctx = canvas.getContext('2d')
    await page.render({canvasContext: ctx, viewport}).promise;
    const image = canvas.toBuffer('application/pdf');
    return new Response(image, {
        'Content-Type': 'application/pdf'
    })
}