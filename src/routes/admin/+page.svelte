<script>
    import DarkBox from "$lib/components/DarkBox.svelte";
    import { User } from '$lib/stores/user'
    import { onDestroy } from 'svelte'

    let user = null
    const unsubscribeUser = User.subscribe((value) => {
        user = value
    })
    onDestroy(unsubscribeUser)

    // TODO: add api route and option in this file to change user password

    async function changeAllowNewAccounts(event) {
        const data = parseFormData(event.currentTarget)
        if (!data.allow)
            return alert('You need to select Yes or No')
        data.allow = data.allow === 'true' ? true : false
        const response = await postData(data, '/api/admin/allow_new_accounts')
        const json = await response.json()
        alert(response.status < 300 ? `Successfully updated the data with ${data.allow}` : `Error: ${json.message}`)
    }

    function parseFormData(target) {
        const formData = new FormData(target)
        const data = {}
        for (let key of formData.keys()) {
            data[key] = formData.get(key)
        }
        return data
    }
    async function postData(payload, url) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return response
    }
</script>

{#if user?.isAdmin}
    <div class="body">
        <div class="container">
            <DarkBox>
                <h3>Disable New Accounts</h3>
                <form on:submit|preventDefault={changeAllowNewAccounts}>
                    <div class="input">
                        <label>
                            Set status <br>
                            <select name="allow">
                                <option value={null}>--- Select an option ---</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </label>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </DarkBox>
        </div>
    </div>
{:else}
    Unauthorized
{/if}

<style>
    .container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        min-height: 100vh;
        align-items: center;
    }
    .input {
        margin: 10px 0;
    }
</style>