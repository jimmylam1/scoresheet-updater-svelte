import { error, json } from "@sveltejs/kit";
import { addSession } from "$lib/server/utils/session.js";

export async function POST({ request, cookies }) {
    const { username, password } = await request.json()
    const { sessionId, err, status } = await addSession(username, password)
    if (!sessionId)
        return error(status, err)
    cookies.set('sessionId', sessionId, { path: '/', secure: false });
    return json('OK')
}
