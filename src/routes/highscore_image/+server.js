import { error } from "@sveltejs/kit";
import { createCanvas, Canvas } from "canvas";
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
    const canvas = createCanvas(viewport.width, viewport.height)
    const ctx = canvas.getContext('2d')
    await page.render({canvasContext: ctx, viewport}).promise;
    const cropped = getCroppedImage(canvas)
    const image = cropped.toBuffer('image/png');
    return new Response(image, {
        'Content-Type': 'image/png'
    })
}

/**
 * 
 * @param {Canvas} canvas 
 */
function getCroppedImage(canvas) {
    const { left, right, top, bottom } = findEdges(canvas)
    const newCanvas = createCanvas(right-left, bottom-top)
    const newCtx = newCanvas.getContext('2d')

    newCtx.drawImage(canvas, -left, -top)
    return newCanvas
}

/**
 * 
 * @param {Canvas} canvas 
 */
function findEdges(canvas) {
    const ctx = canvas.getContext('2d')
    const halfWidth = Math.floor(canvas.width/2)
    const halfHeight = Math.floor(canvas.height/2)
    let left = 0
    let right = canvas.width
    let top = 0
    let bottom = canvas.height

    for (let i = 0; i < canvas.width; i++) {
        let pixel = ctx.getImageData(i, halfHeight, 1, 1).data
        if (pixel[0] !== 255) {
            left = i
            break
        }
    }
    for (let i = canvas.width -1; i >= 0; i--) {
        let pixel = ctx.getImageData(i, halfHeight, 1, 1).data
        if (pixel[0] !== 255) {
            right = i
            break
        }
    }
    for (let i = 0; i < canvas.height; i++) {
        let pixel = ctx.getImageData(halfWidth, i, 1, 1).data
        if (pixel[0] !== 255) {
            top = i
            break
        }
    }
    for (let i = canvas.height-1; i >= 0; i--) {
        let pixel = ctx.getImageData(halfWidth, i, 1, 1).data
        if (pixel[0] !== 255) {
            bottom = i
            break
        }
    }
    
    return { left, right, top, bottom }
}
