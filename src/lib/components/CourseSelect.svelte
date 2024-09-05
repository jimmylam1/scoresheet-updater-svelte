<script>
    import { createEventDispatcher } from "svelte";
    import { percent, roundToThousands, diff } from "$lib/utils/util"
    import { Courses } from '$lib/stores/courses'
    import { User } from '$lib/stores/user'

    const dispatch = createEventDispatcher()

    export let cupName
    export let course1
    export let course2
    export let course3
    export let modeIdx

    let cupUrl = course1.cupUrl

    function color(course) {
        const percent = course.curScore / course.estScore
        const threshold = [[0.85, 'red'], [0.9, 'orange'], [0.95, 'yellow'], [1, 'light-green']]
        for (let [p, t] of threshold) {
            if (percent < p)
                return t
        }
        return 'green'
    }

    function cupVal() {
        const current = course1.curScore + course2.curScore + course3.curScore
        const estimate = course1.estScore + course2.estScore + course3.estScore
        const currentAc = course1.curAc + course2.curAc + course3.curAc
        const estAc = course1.estAc + course2.estAc + course3.estAc
        const options = [
            percent(current, estimate),
            percent(currentAc, estAc),
            roundToThousands(current),
            roundToThousands(estimate),
            diff(current, estimate, true)
        ]
        return options[modeIdx]
    }
    function courseVal(course) {
        const options = [
            percent(course.curScore, course.estScore),
            percent(course.curAc, course.estAc),
            roundToThousands(course.curScore),
            roundToThousands(course.estScore),
            diff(course.curScore, course.estScore, true)
        ]
        return options[modeIdx]
    }

    function incrementDisplayType() {
        dispatch('incrementModeIdx')
    }

    function setCourse(cupName, trackName) {
        const courses = $Courses
        if (courses) {
            const course = courses.find(i => i.cupName === cupName && i.trackName === trackName)
            User.update((u) => {
                u.selectedCourse = { cupName: course.cupName, trackName: course.trackName }
                return u
            })
        }
    }
</script>

<div class="container">
    {#key modeIdx}
        <div class="cup-wrapper">
            <div id="cup" style="background-image: url({cupUrl});"></div>
            <span>({cupVal()})</span>
        </div>
        <div class="option-wrapper">
            <div class="row">
                <div class="item" style="background-image: url('{course1.driverIconUrl}');"></div>
                <button class="course" on:click={() => setCourse(cupName, course1.trackName)}>{course1.trackName}</button>
                <button class="val {color(course1)}" on:click={incrementDisplayType}>{courseVal(course1)}</button>
            </div>
            <div class="row">
                <div class="item" style="background-image: url('{course2.driverIconUrl}');"></div>
                <button class="course" on:click={() => setCourse(cupName, course2.trackName)}>{course2.trackName}</button>
                <button class="val {color(course2)}" on:click={incrementDisplayType}>{courseVal(course2)}</button>
            </div>
            <div class="row">
                <div class="item" style="background-image: url('{course3.driverIconUrl}');"></div>
                <button class="course" on:click={() => setCourse(cupName, course3.trackName)}>{course3.trackName}</button>
                <button class="val {color(course3)}" on:click={incrementDisplayType}>{courseVal(course3)}</button>
            </div>
        </div>
    {/key}
</div>

<style>
    .container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        width: 380px;
        height: 100px;
        margin-bottom: 10px;
    }
    .cup-wrapper {
        text-align: center;
        font-size: 13px;
    }
    #cup {
        width: 70px;
        height: 70px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-bottom: 5px;
    }
    .option-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 5px;
        height: 90px;
    }
    .row {
        display: flex;
        align-items: center;
    }
    button {
        text-align: center;
        border-radius: 5px;
        border: none;
        padding: 4px;
        -webkit-appearance: none;
        appearance: none;
        color: black;
    }
    .course {
        background-color: white;
        font-size: 13px;
        width: 180px;
    }
    .course:hover {
        cursor: pointer;
        background-color: gold;
    }
    .item {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        width: 22px;
        height: 22px;
        border-radius: 5px;
        margin-right: 5px;
    }
    .val {
        width: 50px;
        font-size: 13px;
        margin-left: 5px;
    }
    .val:hover {
        cursor: pointer;
    }

    .red {
        background-color: rgb(247, 88, 88);
    }
    .orange {
        background-color: rgb(250, 189, 75);
    }
    .yellow {
        background-color: rgb(255, 255, 129);
    }
    .light-green {
        background-color: rgb(174, 255, 109);
    }
    .green {
        background-color: rgb(49, 255, 49);
    }
</style>