<script>
    import { onMount } from 'svelte';
    import WhiteMessageBox from '../../lib/components/WhiteMessageBox.svelte';

    let serviceEmail = ''

    onMount(async () => {
        const response = await fetch(`/api/get_service_account_email`)
        if (response.status < 300) {
            const { email } = await response.json()
            serviceEmail = email
        }
    })

    async function handleSubmit(event) {
        const data = new FormData(event.currentTarget)
        const url = data.get('spreadsheet')

        if (!url.startsWith('https://docs.google.com/spreadsheets'))
            return alert(`Error: The spreadsheet url should start with https://docs.google.com/spreadsheets`)

        const payload = {
            spreadsheetId: url.split("/")[5]
        }
        const response = await fetch(`/api/change_spreadsheet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.status >= 300) {
            return alert('There was a problem changing your spreadsheet')
        }

        window.location.href = '/'
    }
</script>

<WhiteMessageBox>
    On the spreadsheet, make sure to share the spreadsheet with the following email and give it edit access: {serviceEmail}
</WhiteMessageBox>
<br>
<WhiteMessageBox>
    Click <a href="https://docs.google.com/spreadsheets/d/1C2dR5pO1rcKlle62dPRb5MqCbbDDubKeT87A54N6w00/copy" target="_blank">here</a> to get a copy of the scoresheet if you don't have it already.
</WhiteMessageBox>
<form on:submit|preventDefault={handleSubmit}>
    <div class="input">
        <label for="spreadsheet">Spreadsheet Url</label> <br>
        <input type="text" name="spreadsheet" id="spreadsheet" required />
    </div>
    <input class="space" type="submit" value="Update Spreadsheet">
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;
    }
    .input {
        margin: 10px 0;
    }
    .input input {
        width: 300px;
        margin-top: 5px;
    }
    .space {
        margin-top: 10px;
    }
</style>