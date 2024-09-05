import { error, json } from '@sveltejs/kit'
import { userCollection } from '$lib/server/db/mongo.js'

export async function POST({request, cookies }) {
    const sessionId = cookies.get('sessionId')
    const { spreadsheetId } = await request.json()

    const result = await userCollection.findOne({ 'sessions.sessionId': sessionId })
    if (!result)
        return error(401, `Not logged in`)

    try {
        await userCollection.updateOne(
            { 'sessions.sessionId': sessionId },
            { $set: { spreadsheetId }},
            { upsert: false }
        )
        return json('OK')
    } catch(e) {
        console.log(`/api/change_spreadsheet POST ${e}`)
        return error(500, `Error changing the spreadsheet`)
    }
}