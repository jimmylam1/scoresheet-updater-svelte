import { error, json } from "@sveltejs/kit";
import { addSession } from "$lib/server/utils/session.js";
import { verifyRecaptcha } from "$lib/server/utils/verifyRecaptcha.js";

export async function POST({ request, cookies }) {
    const { username, password, recaptchaResponse } = await request.json()
    const success = await verifyRecaptcha(recaptchaResponse).catch(e => console.error(`/api/login recaptcha failed ${e}`))
    if (!success)
        return error(500, `Recaptcha failed`)
    const { sessionId, err, status } = await addSession(username, password)
    if (!sessionId)
        return error(status, err)
    cookies.set('sessionId', sessionId, { path: '/', secure: false });
    return json('OK')
}
