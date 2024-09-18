import { json } from "@sveltejs/kit";
import { RECAPTCHA_SITEKEY } from '$env/static/private';

export async function GET() {
    return json({
        recaptcha: RECAPTCHA_SITEKEY
    })
}