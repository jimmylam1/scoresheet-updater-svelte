import { ROOT_USERNAME } from '$env/static/private'
import { userCollection, settingsCollection } from '$lib/server/db/mongo.js'
import { error, json } from '@sveltejs/kit'

export async function POST({ request, cookies }) {
    const sessionQuery = { 'sessions.sessionId': cookies.get('sessionId') || '' }
    const user = await userCollection.findOne(sessionQuery)
    if (!user)
        return error(401, 'Not logged in')
    if (user._id !== ROOT_USERNAME)
        return error(403, 'Forbidden')
    
    const { allow } = await request.json()

    try {
        await settingsCollection.updateOne(
            { _id: 'settings' },
            { $set: {canCreateAccounts: allow}},
            { upsert: false }
        )
        return json('OK')
    } catch(e) {
        console.log(`/api/allow_new_accounts POST ${e}`)
        return error(500, `Error enabling/disabling new accounts`)
    }
}