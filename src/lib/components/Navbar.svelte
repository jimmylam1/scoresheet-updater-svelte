<script>
    import { createEventDispatcher } from "svelte";
    import { goto } from '$app/navigation';
    import { User } from '$lib/stores/user'

    const dispatch = createEventDispatcher()

    export let isAdmin = false

    let showNav = false
    
    async function logout(event) {
        const response = await fetch(`/api/logout`)

        if (response.status < 300) {
            dispatch('logout')
        } else {
            alert("There was an issue logging out")
        }
    }

    function toggleNav() {
        showNav = !showNav
    }
    function closeNav() {
        showNav = false
    }

    function gotoAdminPage() {
        closeNav()
        goto('/admin')
    }

</script>

<div id="header">
    <a href="/"><img id="logo" src="/logo.png" alt="logo"></a>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span id="nav-openbtn" on:click={toggleNav}>&#9776;</span>
    <div id="nav" class={showNav ? 'nav-show' : ''}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span id="nav-closebtn" on:click={toggleNav}>&times;</span>
        {#if isAdmin}
            <button on:click={gotoAdminPage} id="nav-home-btn">Admin Page</button>
        {/if}
        <div class="nav-category nav-top-border">
            <p>Account</p>
            <div class="nav-category-btn-wrapper">
                {#if !$User?.isAdmin}
                    <a href="/change_password" on:click={closeNav} class="nav-enable-hover nav-category-btn">Change Password</a>
                {/if}
                <a href="/change_spreadsheet" on:click={closeNav} class="nav-enable-hover nav-category-btn">Change Spreadsheet</a>
            </div>
        </div>
        <button on:click={logout} id="nav-home-btn">Logout</button>
    </div>
</div>

<style>
    :root {
        --nav-width: 275px;
        --nav-bg-color:#ddd;
        --nav-bg-hover-color: #bbb;
        --nav-text-color-base: #000000;
        --nav-text-color-hover: #000000;
        --transition-speed: 0.3s;
    }
    #header {
        display: flex;
        height: 50px;
        background: #eee;
        justify-content: flex-end;
        position: absolute;
        z-index: 1;
        width: 100vw;
        align-items: center;
        font-family: system-ui;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }
    #logo {
        height: 44px;
        position: absolute;
        top: 3px;
        left: 5px;
    }

@media only screen and (min-width: 501px) {
    #nav {
        transition: var(--transition-speed);
        overflow: hidden;
    }
    #nav button {
        float: left;
        font-size: 16px;
        text-align: left;
        text-decoration: none;
        color: var(--nav-text-color-base);
        height: 50px;
        background: none;
        border: none;
    }
    #nav button:hover {
        cursor: pointer;
    }
    #nav .nav-category {
        float: left;
        overflow: hidden;
    }
    .nav-category p {
        font-size: 16px;
        border: none;
        outline: none;
        color: black;
        padding: 16px;
        background-color: inherit;
        font-family: inherit;
        margin: 0;
    }
    #nav-home-btn {
        /* color: white !important; */
        padding: 16px 20px;
    }

    .nav-category-btn-wrapper {
        display: none;
        position: absolute;
        top: 50px;
        right: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
        padding: 10px 0;
    }
    .nav-category-btn {
        float: none;
        padding: 8px 20px;
        width: auto;
        text-decoration: none;
        display: block;
        text-align: left;
        width: 200px;
        color: var(--nav-text-color-base);
    }

    .nav-category-btn:hover {
        color: var(--nav-text-color-hover) !important;
        background-color: var(--nav-bg-hover-color) !important;
        width: 200px;
    }

    .nav-category:hover .nav-category-btn-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: var(--nav-bg-color);
        
    }
    .nav-category p:hover {
        cursor: default;
    }
    #nav-openbtn {
        display: none;
    }
    #nav-closebtn {
        display: none;
    }
}



@media only screen and (max-width: 500px) {
    #nav {
        background-color: var(--nav-bg-color);
        position: fixed;
        left: calc(100vw + var(--nav-width) + 5px);
        top: 0;
        bottom: 0;
        padding-top: 50px;
        box-shadow: 5px 0px 5px -2px black;
        border-right: none;
        min-width: var(--nav-width);
        width: var(--nav-width);
        transition: var(--transition-speed);
        overflow-y: auto;
    }
    #nav a {
        padding: 8px 0px 8px 15px;
        text-decoration: none;
        color: #000;
        display: block;
        transition: var(--transition-speed);
        margin-left: 15px;
        border-radius: 3px;
    }
    #nav a:hover, #nav-closebtn:hover {
        color: #444;
    }
    #nav button {
        float: left;
        font-size: 16px;
        text-align: left;
        text-decoration: none;
        color: var(--nav-text-color-base);
        height: 50px;
        background: none;
        border: none;
        width: var(--nav-width);
        text-align: center;
        border-top: 1px solid #aaa;
    }
    .nav-enable-hover:hover {
        background-color: var(--nav-bg-hover-color);
        border-left: 3px solid rgb(52, 135, 202);
        transition: 0.1s;
    }
    .nav-show {
        left: calc(100vw - var(--nav-width)) !important;
    }
    #nav-openbtn {
        display: block;
        background: rgba(0, 0, 0, 0);
        padding: 5px;
        color: black;
        font-size: 30px;
        border: none;
        position: absolute;
        top: 0px;
        right: 20px;
        cursor: pointer;
    }
    #nav-closebtn {
        display: block;
        position: absolute;
        text-align: center;
        top: 5px;
        right: 5px;
        font-size: 36px;
        margin: 0;
        cursor: pointer;
        color: #777;
        padding: 0px 10px;
    }

    .nav-category {
        padding-left: 0px;
    }
    .nav-category p {
        font-size: 13px;
        font-weight: bold;
        padding-left: 10px;
        margin-bottom: 5px;
        color: #000000;
    }
    .nav-category a {
        padding-left: 10px !important;
    }
    
    .nav-top-border {
        border-top: 1px solid #aaaaaa;
        margin: 10px 20px;
    }
}
</style>