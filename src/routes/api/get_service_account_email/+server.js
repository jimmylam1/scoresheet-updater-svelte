import { SERVICE_ACCOUNT_EMAIL } from '$env/static/private'
import { json } from '@sveltejs/kit'

export function GET() {
    return json({email: SERVICE_ACCOUNT_EMAIL})
}