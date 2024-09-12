import { compareSync, hashSync } from "bcrypt"
import { userCollection } from "../db/mongo"
import { MAX_SESSION_TIME } from '$env/static/private';

export async function addSession(username, password) {
    const query = { _id: username }
    const result = await userCollection.findOne(query)
    if (!result)
        return null

    const expires = new Date()
    expires.setTime(expires.getTime() + parseInt(MAX_SESSION_TIME))
    if (compareSync(password, result.passwordHash)) {
        const sessionId = hashSync(`${username}.${Math.random().toString()}`, 10)
        const session = {
            sessionId, 
            expires
        }
        await userCollection.updateOne(query, {$push: { "sessions": session }})
        return sessionId
    }
    return null
}

export async function updateSessionExpiration(sessionId) {
    const expires = new Date()
    expires.setTime(expires.getTime() + parseInt(MAX_SESSION_TIME))

    const result = await userCollection.updateOne(
        { "sessions.sessionId": sessionId },
        { $set: {
            "sessions.$.expires": expires
        }}
    ).catch(e => console.error(`session.js updateSessionExpiration() ${e}`)) 
    // console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount}`)
}