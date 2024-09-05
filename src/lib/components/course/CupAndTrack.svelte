<script>
    export let cupUrl
    export let TrackUrl
    export let trackName
</script>

<div class="cup image" style="background-image: url({cupUrl})"></div>
<div>
    <div class="track image" style="background-image: url({TrackUrl})"></div>
    <div class="trackname">{trackName}</div>
</div>

<style>
    .image {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .cup {
        width: 80px;
        height: 80px;
        margin-right: 20px;
    }
    .track {
        width: 166px;
        height: 55px;
    }
    .trackname {
        width: 166px;
        height: 25px;
        background-color: black;
        color: white;
        text-align: center;
        vertical-align: middle;
        line-height: 25px;
        font-size: 14px;
        overflow: hidden; 
        white-space: nowrap;
    }
</style>      