import { json } from '@sveltejs/kit'
import { updateCourse } from '$lib/server/utils/courses.js'
import { userCollection } from '$lib/server/db/mongo.js'

export async function POST({request, cookies }) {
    const sessionId = cookies.get('sessionId')

    const result = await userCollection.findOne({ 'sessions.sessionId': sessionId })
    if (!result)
        return error(401, `Not logged in`)

    if (!result.spreadsheetId)
        return error(500, `No spreadsheet specified`)

    try {
        const { rowNum, curScore, curAc, note, frenzy1, frenzy2, frenzy3, box, fin, broke } = await request.json()
        await updateCourse(result.spreadsheetId, rowNum, frenzy1, frenzy2, frenzy3, box, fin, broke, curAc, curScore, note)
        return json('OK')
    } catch(e) {
        return error(500, 'Incorrect body sent')
    }
}
