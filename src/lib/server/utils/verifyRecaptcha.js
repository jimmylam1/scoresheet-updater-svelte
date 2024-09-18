import { RECAPTCHA_SECRET } from '$env/static/private';

export async function verifyRecaptcha(responseToken) {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${responseToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    const json = await response.json()
    return json.success
}