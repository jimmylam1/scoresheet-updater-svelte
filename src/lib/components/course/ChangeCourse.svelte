<script>
    import { goto } from '$app/navigation';

    export let index

    function resetTrack() {
        goto('/')
    }
    function nextTrack(isRight) {
        function changeIdx(idx) {
            idx = parseInt(idx)
            if (isRight)
                return (idx+1) % 45
            return idx === 0 ? 44 : idx-1
        }

        goto(`/course?index=${changeIdx(index)}`)
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