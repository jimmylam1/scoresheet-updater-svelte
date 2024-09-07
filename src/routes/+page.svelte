<script>
    import CourseSelect from "$lib/components/CourseSelect.svelte";
    import WhiteMessageBox from "$lib/components/WhiteMessageBox.svelte";
    import { User } from '$lib/stores/user'
    import { Courses } from '$lib/stores/courses'
    import { onDestroy } from 'svelte'

    export let data

    let user =  data.user
    let courses = data.courses
    let cupList = []
    $: cups = courses ? parseCourses(courses) : {}
    let modeIdx = 0

    const modes = ['Score Percent', 'AC Percent', 'Score', 'Score Goal', 'Score Diff']

    const unsubscribeUser = User.subscribe((value) => {
        user = value
    })
    const unsubscribeCourses = Courses.subscribe((value) => {
        courses = value
    })
    onDestroy(() => {
        unsubscribeUser()
        unsubscribeCourses()
    })

    function parseCourses(courses) {
        const tmpCupList = []
        const c = {}
        for (let course of courses) {
            if (!c[course.cupName]) {
                c[course.cupName] = []
                tmpCupList.push(course.cupName)
            }
            c[course.cupName].push(course)
        }
        cupList = tmpCupList
        return c
    }
</script>

{#if user}
    <div class="centered">
        {#if !user.spreadsheetId && !user.isAdmin}
            <div class="full-height">
                <WhiteMessageBox>
                    Before you can use this app, you will need to provide the link to your Scoresheet. Click <a href="/change_spreadsheet">here</a> to add it.
                </WhiteMessageBox>
            </div>
        {:else if courses}
            <div class="course-select-wrapper">
                <div class="mode-wrapper">
                    <div class="mode">Mode: {modes[modeIdx]}</div>
                </div>
                {#each cupList as cup}
                    <CourseSelect 
                        cupName={cup} 
                        course1={cups[cup][0]} 
                        course2={cups[cup][1]} 
                        course3={cups[cup][2]} 
                        modeIdx={modeIdx}
                        on:incrementModeIdx={() => modeIdx = (modeIdx+1)%modes.length}
                    />
                {/each}
            </div>
        {:else}
            <div class="full-height">
                <p>Loading...</p>
            </div>
        {/if}
    </div>
{/if}

<style>
    .centered {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .course-select-wrapper {
        padding-top: 50px;
        padding-bottom: 50px;
        margin-top: 50px;
    }
    .full-height {
        height: 100vh;
        display: flex;
        align-items: center;
    }
    .mode-wrapper {
        display: flex;
        justify-content: center;
    }
    .mode {
        background-color: #ddd;
        color: black;
        padding: 2px 10px;
        border-radius: 10px;
        font-size: 0.7em;
        margin-bottom: 20px;
    }
</style>
