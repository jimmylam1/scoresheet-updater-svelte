<script>
    import { onDestroy } from 'svelte'
    import { User } from '$lib/stores/user'
    import { Courses } from '$lib/stores/courses'
    import Navbar from "$lib/components/Navbar.svelte";
    import { invalidateAll } from '$app/navigation';
    import Login from '$lib/components/Login.svelte';

    export let data

    let user = data.user
    const unsubscribe = User.subscribe((value) => {
        user = value
    })
    onDestroy(unsubscribe)

    async function handleLogout() {
        User.set(null)
        Courses.set(null)
        await invalidateAll()
    }
</script>
{#if user}
    <Navbar isAdmin={user.isAdmin} on:logout={handleLogout} />
    <div class="body">
        <slot />
    </div>
{:else}
    <div class="body">
        <Login />
    </div>
{/if}

<style>
    .body {
        font-family: system-ui;
        background-image: url('/images/assets/newBg.png'), linear-gradient(rgba(31,199,255,1), rgba(1,81,214,1));
        color: white;
        display: flex;
        justify-content: center;
        flex-direction: column;
        min-height: 100vh;
        align-items: center;
    }
</style>