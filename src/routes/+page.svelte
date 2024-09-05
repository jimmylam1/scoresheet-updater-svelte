<script>
    import Login from "$lib/components/Login.svelte";
    import Course from "$lib/components/Course.svelte";
    import CourseSelect from "$lib/components/CourseSelect.svelte";
    import WhiteMessageBox from "$lib/components/WhiteMessageBox.svelte";
    import { User } from '$lib/stores/user'
    import { Courses } from '$lib/stores/courses'
    import { onDestroy } from 'svelte'

    let user =  null
    let courses = null
    let cupList = []
    $: cups = courses ? parseCourses(courses) : {}
    $: currentCourse = user?.selectedCourse && courses ? courses.find(i => i.cupName === user.selectedCourse.cupName && i.trackName === user.selectedCourse.trackName) : null
    let modeIdx = 0
    let showSuccess = false
    $: user && resetTrigger()

    const modes = ['Score Percent', 'AC Percent', 'Score', 'Score Goal', 'Score Diff']

    const unsubscribeUser = User.subscribe((value) => {
        user = value
    })
    const unsubscribeCourses = Courses.subscribe((value) => {
        courses = value
        showSuccess = true
    })
    onDestroy(() => {
        unsubscribeUser()
        unsubscribeCourses()
    })

    function resetTrigger() {
        showSuccess = false
    }

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
                    Before you can use this app, you will need to provide the link to your Scoresheet. Click <a href="/change_spreadsheet">here</a> to add it.'
                </WhiteMessageBox>
            </div>
        {:else if courses && !currentCourse}
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
        {:else if currentCourse}
            {#key currentCourse}
                <Course 
                    trackName={currentCourse.trackName}
                    TrackUrl={currentCourse.trackUrl}
                    cupUrl={currentCourse.cupUrl}
                    driverUrl={currentCourse.driverUrl}
                    kartUrl={currentCourse.kartUrl}
                    gliderUrl={currentCourse.gliderUrl}
                    curScore={currentCourse.curScore}
                    estScore={currentCourse.estScore}
                    curAc={currentCourse.curAc}
                    estAc={currentCourse.estAc}
                    driverIconUrl={currentCourse.driverIconUrl}
                    frenzyList={currentCourse.frenzyList}
                    singlesList={currentCourse.singlesList}
                    placementsList={currentCourse.placementsList}
                    showSuccess={showSuccess}
                />
            {/key}
        {:else}
            <div class="full-height">
                <p>Loading...</p>
            </div>
        {/if}
    </div>
{:else}
    <Login />
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
