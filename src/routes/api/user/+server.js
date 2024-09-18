import { userCollection, settingsCollection } from '$lib/server/db/mongo.js'
import { error, json } from '@sveltejs/kit'
import { hashSync } from "bcrypt"
import { addSession } from "$lib/server/utils/session.js";
import { ROOT_USERNAME } from '$env/static/private'
import { updateSessionExpiration } from '$lib/server/utils/session.js';
import { verifyRecaptcha } from "$lib/server/utils/verifyRecaptcha.js";

// get current user or null if not authenticated
export async function GET({ cookies }) {
    const query = { 'sessions.sessionId': cookies.get('sessionId') || '' }
    const result = await userCollection.findOne(query)
    if (result) {
        const res = {
            username: result._id,
            spreadsheetId: result.spreadsheetId || null,
            isAdmin: result._id === ROOT_USERNAME,
            sessionsCount: result.sessions.length
        }
        updateSessionExpiration(cookies.get('sessionId'))
        return json(res)
    }
    cookies.delete('sessionId', { path: '/' });
    return error(401, 'Not logged in')
}

// create a new user
export async function POST({ request, cookies }) {
    const { username, password, recaptchaResponse } = await request.json()
    const success = await verifyRecaptcha(recaptchaResponse).catch(e => console.error(`/api/user POST recaptcha failed ${e}`))
    if (!success)
        return error(500, `Recaptcha failed`)

    // check if new users can be added first before adding
    const query = { _id: 'settings' }
    const settings = await settingsCollection.findOne(query)
    if (!settings?.canCreateAccounts)
        return error(503, `Unable to create new users at this time`)

    const user = {
		_id: username,
		passwordHash: hashSync(password, 10),
		sessions: [],
        spreadsheetId: null
	}
    const res = await userCollection.insertOne(user).catch(e => console.error(`/api/user POST insert ${e}`))
    if (!res)
        return error(500, "User already exists")

    const { sessionId } = await addSession(username, password)
    if (!sessionId)
        return error(500, "Unable to create session")
    cookies.set('sessionId', sessionId, { path: '/' });
    return json('OK')
}