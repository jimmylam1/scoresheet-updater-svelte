<script>
    import CreateAccount from './CreateAccount.svelte';
    import { page } from '$app/stores';
    import Recaptcha from './Recaptcha.svelte';

    let isCreateAccount = false

    async function handleSubmit(event) {
        const data = new FormData(event.currentTarget)
        const payload = {
            username: data.get('username'),
            password: data.get('password'),
            recaptchaResponse: data.get('g-recaptcha-response')
        }
        if (!payload.recaptchaResponse)
            return alert('You need to verify with Recaptcha!')
        const response = await fetch(`/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status >= 300) {
            const json = await response.json()
            return alert(json.message || 'Login failed')
        }

        window.location.href = $page.url.pathname // goto() and invalidateAll() don't work...
    }
</script>

{#if isCreateAccount}
    <CreateAccount on:login={() => isCreateAccount = false} />
{:else}
    <form on:submit|preventDefault={handleSubmit}>
        <div class="input">
            <label for="username">Username</label> <br>
            <input type="text" name="username" id="username" required />
        </div>
        <div class="input">
            <label for="password">Password</label> <br>
            <input type="password" name="password" id="password" required />
        </div>
        <Recaptcha />
        <input type="submit" value="Login">
    </form>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a id="new-account" on:click={() => isCreateAccount = true}>Create a new account</a>
{/if}

<style>
    .input {
        margin: 10px 0;
    }
    #new-account {
        font-size: 0.8em;
        margin-top: 20px;
        text-decoration: underline;
        color: white;
    }
    #new-account:hover {
        cursor: pointer;
    }
</style>