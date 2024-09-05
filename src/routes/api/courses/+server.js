import { getCourses } from '$lib/server/utils/courses.js'
import { error, json } from '@sveltejs/kit'
import { userCollection } from '$lib/server/db/mongo.js'

export async function GET({ cookies }) {
    const sessionId = cookies.get('sessionId')

    const result = await userCollection.findOne({ 'sessions.sessionId': sessionId })
    if (!result)
        return error(401, `Not logged in`)

    if (!result.spreadsheetId)
        return error(500, `No spreadsheet specified`)

    const courses = await getCourses(result.spreadsheetId).catch(e => console.error(`${e}`))
    return json(courses)
}