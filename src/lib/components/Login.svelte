<script>
    import { User } from '$lib/stores/user'
    import { Courses } from '$lib/stores/courses'

    async function handleSubmit(event) {
        const data = new FormData(event.currentTarget)
        const payload = {
            username: data.get('username'),
            password: data.get('password')
        }
        const response = await fetch(`/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status < 300) {
            refreshData()
        }
        else {
            alert(`The username or password is incorrect`)
        }
    }

    async function refreshData() {
        const response = await fetch(`/api/user`)
        const user = response.status < 300 ? await response.json() : null

        if (user) {
            User.set(user)
            const response = await fetch(`/api/courses`)
            if (response.status < 300) {
                const courses = await response.json()
                Courses.set(courses)
            }
        }
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <div class="input">
        <label for="username">Username</label> <br>
        <input type="text" name="username" id="username" required />
    </div>
    <div class="input">
        <label for="password">Password</label> <br>
        <input type="password" name="password" id="password" required />
    </div>
    <input type="submit" value="Login">
</form>
<a id="new-account" href="/create_account">Create a new account</a>

<style>
    .input {
        margin: 10px 0;
    }
    #new-account {
        font-size: 0.8em;
        margin-top: 20px;
    }
</style>