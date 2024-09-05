<script>
    import { Courses } from '$lib/stores/courses'
    import { User } from '$lib/stores/user'

    function resetTrack() {
        User.update((u) => {
            u.selectedCourse = null
            return u
        })
    }
    function nextTrack(isRight) {
        function changeIdx(idx) {
            if (isRight)
                return (idx+1) % 45
            return idx === 0 ? 44 : idx-1
        }

        const courses = $Courses
        const user = $User
        if (!courses || !user)
            return

        const { cupName, trackName } = user.selectedCourse
        let idx = courses.findIndex(i => i.cupName === cupName && i.trackName === trackName)
        if (idx < 0)
            return resetTrack()
        idx = changeIdx(idx)
        User.update((u) => {
            u.selectedCourse = { cupName: courses[idx].cupName, trackName: courses[idx].trackName }
            return u
        })
    }
</script>

<div class="wrapper">
    <div class="container">
        <button class="wide" on:click={() => nextTrack(false)}><div class="arrow left"></div></button>
        <button on:click={resetTrack}>Change Course</button>
        <button class="wide" on:click={() => nextTrack(true)}><div class="arrow right"></div></button>
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
    .container {
        display: flex;
        width: 340px;
        justify-content: space-around;
    }
    button {
        padding: 5px 10px;
        background-color: white;
        border-radius: 5px;
        border: none;
    }
    .wide {
        padding: 5px 20px;
    }
    .arrow {
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
    }
    .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
    .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
    }
</style>