<script>
    import { goto } from '$app/navigation';

    async function handleSubmit(event) {
        const data = new FormData(event.currentTarget)

        if (data.get('password') !== data.get('password2'))
            return alert(`The passwords do not match`)

        const payload = {
            currentPassword: data.get('currentPassword'),
            password: data.get('password')
        }
        const response = await fetch(`/api/change_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status >= 300) {
            return alert('There was a problem changing your password')
        }

        goto('/')
    }
</script>

    <form on:submit|preventDefault={handleSubmit}>
        <div class="input">
            <label for="currentPassword">Current Password</label> <br>
            <input type="text" name="currentPassword" id="currentPassword" required />
        </div>
        <div class="input">
            <label for="password">New Password</label> <br>
            <input type="password" name="password" id="password" required />
        </div>
        <div class="input">
            <label for="password2">Re-enter Password</label> <br>
            <input type="password2" name="password2" id="password2" required />
        </div>
        <input type="submit" value="Change Password">
    </form>

<style>
    .input {
        margin: 10px 0;
    }
</style>