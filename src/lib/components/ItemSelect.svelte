<script>
    import DarkBox from "$lib/components/DarkBox.svelte";

    export let inputName
    export let title
    export let itemList = [{text: 'None', value: '', url: ''}]
    export let selectedIdx = 0

    let selectedClass = Array(itemList.length).map(i => false)
    selectedClass[0] = true

    $: selectedItem = itemList[selectedIdx].value

    function handleSelect(idx) {
        selectedClass[selectedIdx] = false
        selectedClass[idx] = true
        selectedIdx = idx
    }
</script>

<DarkBox>
    <label for={inputName}>{title}</label> <br>
    <input name={inputName} value={selectedItem} hidden />
    <div class="grid-container">
        {#each itemList as item, idx}
            {#if !item.url}
                <button type="button" class="grid-item" class:selected={selectedClass[idx]} on:click={() => handleSelect(idx)}>{item.text}</button>
            {:else}
                <button type="button" class="grid-item" class:selected={selectedClass[idx]} style="background-image: url('{item.url}')" on:click={() => handleSelect(idx)}></button>
            {/if}
        {/each}
    </div>
</DarkBox>

<style>
    button {
        background: none;
        color: white;
        font-size: 0.95em;
        padding: 0;
    }
    .grid-container {
        display: grid;
        grid-template-columns: 55px 55px 55px 55px 55px;
        gap: 5px;
        justify-content: center;
        margin-top: 15px;
    }
    .grid-item {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        border: 2px solid lightgray;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .grid-item:hover {
        cursor: pointer;
    }
    .selected {
        border: 2px solid white;
        background-color: rgba(255, 215, 0, 0.9);
    }
</style>