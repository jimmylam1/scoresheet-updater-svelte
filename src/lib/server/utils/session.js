import { compareSync, hashSync } from "bcrypt"
import { userCollection } from "../db/mongo"
import { MAX_SESSION_TIME } from '$env/static/private';

export async function addSession(username, password) {
    const query = { _id: username }
    const result = await userCollection.findOne(query)
    if (!result)
        return null

    if (compareSync(password, result.passwordHash)) {
        const sessionId = hashSync(`${username}.${Math.random().toString()}`, 10)
        const session = {
            sessionId, 
            expires: Date.now() + parseInt(MAX_SESSION_TIME)
        }
        await userCollection.updateOne(query, {$push: { "sessions": session }})
        return sessionId
    }
    return null
}