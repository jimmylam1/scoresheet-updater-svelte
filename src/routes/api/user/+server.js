import { userCollection, settingsCollection } from '$lib/server/db/mongo.js'
import { error, json } from '@sveltejs/kit'
import { hashSync } from "bcrypt"
import { addSession } from "$lib/server/utils/session.js";
import { ROOT_USERNAME } from '$env/static/private'

// get current user or null if not authenticated
export async function GET({ cookies }) {
    const query = { 'sessions.sessionId': cookies.get('sessionId') || '' }
    const result = await userCollection.findOne(query)
    if (result) {
        const res = {
            username: result._id,
            selectedCourse: result.sessions.find(i => i.sessionId === cookies.get('sessionId')).selectedCourse,
            spreadsheetId: result.spreadsheetId || null
        }
        if (result._id === ROOT_USERNAME)
            res.isAdmin = true
        return json(res)
    }
    cookies.delete('sessionId', { path: '/' });
    return error(401, 'Not logged in')
}

// create a new user
export async function POST({ request, cookies }) {
    // check if new users can be added first before adding
    const query = { _id: 'settings' }
    const settings = await settingsCollection.findOne(query)
    if (!settings?.canCreateAccounts)
        return error(503, `Unable to create new users at this time`)

    const { username, password } = await request.json()
    const user = {
		_id: username,
		passwordHash: hashSync(password, 10),
		sessions: [],
        spreadsheetId: null
	}
    const res = await userCollection.insertOne(user).catch(e => console.error(`/api/user POST insert ${e}`))
    if (!res)
        return error(500, "User already exists")
    const sessionId = await addSession(username, password).catch(e => console.error(`/api/user POST session ${e}`))
    if (!sessionId)
        return error(401, "Unable to create session")
    cookies.set('sessionId', sessionId, { path: '/' });
    return json('OK')
}