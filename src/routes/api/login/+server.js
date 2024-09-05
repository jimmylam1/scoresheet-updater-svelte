import { error, json } from "@sveltejs/kit";
import { addSession } from "$lib/server/utils/session.js";

export async function POST({ request, cookies }) {
    const { username, password } = await request.json()
    const sessionId = await addSession(username, password).catch(e => console.error(`/api/login POST ${e}`))
    if (!sessionId)
        return error(401, "Incorrect username or password")
    cookies.set('sessionId', sessionId, { path: '/', secure: false });
    return json('OK')
}
