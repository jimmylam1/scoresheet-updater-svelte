import { error, json } from "@sveltejs/kit";
import { userCollection } from "$lib/server/db/mongo.js";

export async function GET({ cookies }) {
    try {
        await userCollection.updateOne(
            { 'sessions.sessionId': cookies.get('sessionId') },
            { $pull: { 'sessions': { sessionId: cookies.get('sessionId') } } }
        );
    } catch(e) {
        console.error(`/api/logout GET ${e}`)
        return error(500, "There was an issue logging out")
    }
    cookies.delete('sessionId', { path: '/' });
    return json('OK')
}
