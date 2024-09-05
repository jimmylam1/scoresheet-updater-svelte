import { userCollection } from '$lib/server/db/mongo.js'
import { error, json } from '@sveltejs/kit'

export async function POST({ request, cookies }) {
    const { selectedCourse } = await request.json()
    const sessionId = cookies.get('sessionId')

    try {
        await userCollection.updateOne(
            { 'sessions.sessionId': sessionId },
            { $set: {'sessions.$.selectedCourse': selectedCourse}},
            { upsert: false }
        )
        return json('OK')
    } catch(e) {
        console.log(`/api/change_password POST ${e}`)
        return error(500, `Error setting the course for the current session`)
    }
}