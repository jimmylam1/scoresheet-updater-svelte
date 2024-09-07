<script>
    import CreateAccount from './CreateAccount.svelte';
    import { page } from '$app/stores';

    let isCreateAccount = false

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

        if (response.status >= 300)
            alert(`The username or password is incorrect`)

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