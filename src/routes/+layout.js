import { User } from '$lib/stores/user'
import { Courses } from '$lib/stores/courses'

export async function load({ fetch }) {
    const response = await fetch(`/api/user`)
    const user = response.status < 300 ? await response.json() : null
    if (user)
        User.set(user)

    let courses = null
    if (user) {
        const response = await fetch(`/api/courses`)
        courses = response.status < 300 ? await response.json() : null
        if (courses)
            Courses.set(courses)
    }

	return { user, courses }
}
