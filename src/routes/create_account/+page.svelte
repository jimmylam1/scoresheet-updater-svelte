<script>
    import { goto } from '$app/navigation';

    async function handleSubmit(event) {
        const data = new FormData(event.currentTarget)

        if (data.get('password') !== data.get('password2'))
            return alert(`The passwords do not match`)

        const payload = {
            username: data.get('username'),
            password: data.get('password')
        }
        const response = await fetch(`/api/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status >= 300) {
            const { message } = await response.json()
            return alert(`There was a problem creating your account: ${message}`)
        }

        goto('/')
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
    <div class="input">
        <label for="password2">Re-enter Password</label> <br>
        <input type="password2" name="password2" id="password2" required />
    </div>
    <input type="submit" value="Create Account">
</form>
<a id="login" href="/">Already have an account?</a>

<style>
    .input {
        margin: 10px 0;
    }
    #login {
        font-size: 0.8em;
        margin-top: 20px;
    }
</style>