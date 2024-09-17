import { compareSync, hashSync } from "bcrypt"
import { userCollection } from "../db/mongo"
import { MAX_SESSION_TIME, MAX_SESSIONS } from '$env/static/private';

export async function addSession(username, password) {
    const query = { _id: username }
    const result = await userCollection.findOne(query)
    if (!result)
        return { sessionId: null, err: 'Failed to find user', status: 401 }

    const expires = new Date()
    expires.setTime(expires.getTime() + parseInt(MAX_SESSION_TIME))
    if (compareSync(password, result.passwordHash)) {
        if (result.sessions.length >= parseInt(MAX_SESSIONS))
            return { sessionId: null, err: 'Max sessions reached', status: 500 }
        
        const sessionId = hashSync(`${username}.${Math.random().toString()}`, 10)
        const session = {
            sessionId, 
            expires
        }
        await userCollection.updateOne(query, {$push: { "sessions": session }})
        return { sessionId, err: null, status: 200 }
    }
    return { sessionId: null, err: 'Incorrect Username or Password', status: 401 }
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