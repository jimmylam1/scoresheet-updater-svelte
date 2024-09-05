<script>
    export let url
    export let leftMargin = false

</script>

<div class="dkg {leftMargin ? 'left-margin' : ''}" style="background-image: url('{url}')"></div>

<style>
    .dkg {
        width: 75px;
        height: 97px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .left-margin {
        margin-left: 10px;
    }
</style>