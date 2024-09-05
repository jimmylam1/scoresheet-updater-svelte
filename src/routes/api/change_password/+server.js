import { userCollection } from '$lib/server/db/mongo.js'
import { error, json } from '@sveltejs/kit'
import { hashSync, compareSync } from "bcrypt"

export async function POST({ request, cookies }) {
    const { currentPassword, password } = await request.json()
    const sessionId = cookies.get('sessionId')

    const result = await userCollection.findOne({ 'sessions.sessionId': sessionId })
    if (!result || compareSync(currentPassword, result.passwordHash))
        return error(401, `Not logged in`)

    try {
        await userCollection.updateOne(
            { 'sessions.sessionId': sessionId },
            { $set: {passwordHash: hashSync(password, 10)}},
            { upsert: false }
        )
        return json('OK')
    } catch(e) {
        console.log(`/api/change_password POST ${e}`)
        return error(500, `Error changing the password`)
    }
}