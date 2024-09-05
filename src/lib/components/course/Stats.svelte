<script>
    import { percent, diff } from "$lib/utils/util"

    export let curScore
    export let estScore
    export let curAc
    export let estAc
    export let driverIconUrl
</script>

<div class="centered">
    <h3>Score Goal</h3>
    <h1>{estScore.toLocaleString()}</h1>
    <h4>({diff(curScore, estScore, true)} pts, {percent(curScore, estScore)})</h4>
</div>
<div class="centered lm60">
    <h3>Actions Goal</h3>
    <div class="ac-wrapper">
        <div class="icon" style="background-image: url('{driverIconUrl}');"></div>
        <h1>{estAc}</h1>
    </div>
    <h4>({diff(curAc, estAc)} ac, {percent(curAc, estAc)})</h4>
</div>

<style>
    .lm60 {
        margin-left: 60px;
    }
    .centered {
        text-align: center;
    }
    .centered h1, 
    .centered h3, 
    .centered h4 {
        margin: 0;
    }
    .ac-wrapper {
        display: flex;
        align-items: center;
    }
    .icon {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 10px;
    }
</style>