<script>
    import DarkBox from "$lib/components/DarkBox.svelte";

    export let score
    export let ac
</script>

<DarkBox>
    <div class="container">
        <div>
            <label for="score">Score</label> <br>
            <input type="number" name="score" id="score" pattern="\d*" placeholder={score} min={parseInt(score)+1} required />
        </div>
        <div>
            <label for="ac">Action Count</label> <br>
            <input type="number" name="ac" id="ac" placeholder={ac} pattern="\d*" min="1" />
        </div>
    </div>
</DarkBox>

<style>
    .container {
        display: flex;
        justify-content: space-evenly;
    }
    input {
        width: 85px;
        font-size: large;
        text-align: center;
        margin-top: 10px;
    }
</style>