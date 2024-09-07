<script>
    import DkgFrame from "$lib/components/course/DkgFrame.svelte";
    import CupAndTrack from "$lib/components/course/CupAndTrack.svelte";
    import Stats from "$lib/components/course/Stats.svelte";
    import ScoreAcInput from "$lib/components/course/ScoreAcInput.svelte";
    import ChangeCourse from "$lib/components/course/ChangeCourse.svelte";
    import ItemSelect from "$lib/components/ItemSelect.svelte";
    import { sleep } from "$lib/utils/util"
    import { Courses } from '$lib/stores/courses'
    import { onMount } from "svelte";

    export let data

    // reactive statements ($:) run AFTER regular code
    $: index = data.index
    $: course = $Courses?.[index] || {}
    $: frenzyItemList = course.frenzyList?.map(i => ({ text: '', value: i, url: `/images/items/${i.replace("'", "%27")}.png` })) || []
    $: singlesItemList = course.singlesList?.map(i => ({ text: '', value: i, url: `/images/singles/${i}.png` })) || []
    $: placementsItemList = course.placementsList?.map(i => ({ text: '', value: i, url: `/images/placements/${i}.png` })) || []
    let brokenComboItemList = [0, 1, 2, 3, 4].map(i => ({ text: `${i}`, value: i, url: `` }))
    let showSuccessMessage = false
    let refresh = false // toggling between true/false will refresh the data with #key
    let top

    onMount(() => {
        if (top)
            top.scrollIntoView() // scroll to top of page
    })

    $: {
        frenzyItemList.unshift({text: 'None', value: '', url: ''})
        if (course.singlesList?.length > 0 && course.singlesList[0] === '')
            singlesItemList[0] = {text: 'None', value: '', url: ''}
    }

    async function animateSuccessMessage() {
        await sleep(100)
        showSuccessMessage = true
        await sleep(3000)
        showSuccessMessage = false
    }
    async function handleSubmit(event) {
        const formData = new FormData(event.currentTarget)
        const data = {
            rowNum: course.rowNum,
            curScore: parseInt(formData.get('score')),
            curAc: parseInt(formData.get('ac')) || course.curAc,
            note: formData.get('notes') || course.note || '',
            frenzy1: formData.get('frenzy1'),
            frenzy2: formData.get('frenzy2'),
            frenzy3: formData.get('frenzy3'),
            box: formData.get('singles') || '',
            fin: formData.get('placement'),
            broke: parseInt(formData.get('broke'))
        }

        const response = await fetch(`/api/update_course`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (response.status >= 300)
            return alert(`There was an issue updating the spreadsheet`)

        Courses.update((c) => {
            c[course.index].curScore = data.curScore
            if (data.curAc)
                c[course.index].curAc = data.curAc
            return c
        })

        top.scrollIntoView() // scroll to top of page
        animateSuccessMessage()
        refresh = !refresh
    }
</script>

{#key (refresh)}
{#if course.index}
    <div class="body">
        <ChangeCourse {index}/>
        <div class="top" bind:this={top}></div>
        <div class="success-message {showSuccessMessage ? 'show' : 'hide'}">Submission successful!</div>
        <div class="main">
            <div class="cup-track br">
                <CupAndTrack cupUrl={course.cupUrl} TrackUrl={course.trackUrl} trackName={course.trackName} />
            </div>
            <div class="dkg-wrapper br">
                <DkgFrame url={course.driverUrl} />
                <DkgFrame url={course.kartUrl} leftMargin />
                <DkgFrame url={course.gliderUrl} leftMargin />
            </div>
            <div class="stats br">
                <Stats 
                curScore={course.curScore} 
                estScore={course.estScore} 
                curAc={course.curAc} 
                estAc={course.estAc} 
                driverIconUrl={course.driverIconUrl} 
            />
            </div>
        </div>
        <form class="main" on:submit|preventDefault={handleSubmit}>
            <div class="container">
                <ScoreAcInput score={course.curScore} ac={course.curAc} />
                <ItemSelect inputName="frenzy1" title="Frenzy 1" itemList={frenzyItemList} />
                <ItemSelect inputName="frenzy2" title="Frenzy 2" itemList={frenzyItemList} />
                <ItemSelect inputName="frenzy3" title="Frenzy 3" itemList={frenzyItemList} />
                
                {#if singlesItemList.length > 0}
                    <ItemSelect inputName="singles" title="Singles" itemList={singlesItemList} />
                {/if}

                <ItemSelect inputName="placement" title="Placement" itemList={placementsItemList} />
                <ItemSelect inputName="broke" title="Number of Times Combo Broke" itemList={brokenComboItemList} />

                <div class="wrapper br">
                    <label for="notes">Notes</label> <br>
                    <input name="notes" id="notes">
                </div>
                <div class="submit-btn-wrapper">
                    <input class="button" type="submit" value="Update Spreadsheet" id="submit-btn">
                </div>
            </div>
        </form>
    </div>
{/if}
{/key}

<style>
    .body {
        width: 100vw;
        margin-top: 50px;
    }
    .main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .main .container {
        display: flex;
        flex-direction: column;
    }
    input {
        padding: 3px;
    }
    label {
        margin-bottom: 10px;
    }

    .wrapper {
        padding: 20px;
        border-radius: 15px;
        background-color: rgba(0, 0, 0, 0.25);
        border: 2px solid lightgray;
        text-align: center;
    }
    .submit-btn-wrapper {
        text-align: center;
        margin-top: 15px;
        margin-bottom: 100px;
    }
    .stats {
        display: flex;
        flex-direction: row;
    }
    .dkg-wrapper {
        display: flex;
    }

    .cup-track {
        display: flex;
        align-items: center;
        margin-top: 50px;
    }
    .br {
        margin-bottom: 20px;
    }
    #notes {
        width: 200px;
        margin-top: 15px;
    }

    .button {
        background-color: #444;
        color: white;
        border-radius: 5px;
        border: 2px solid white;
        padding: 7px 14px;
        font-size: 13px;
        -webkit-appearance: none;
        appearance: none;
    }
    .button:hover {
        background-color: rgba(255, 215, 0, 0.9);
        cursor: pointer;
    }

    .success-message {
        background-color: rgb(21, 238, 21);
        color: white;
        width: 170px;
        padding: 2px 10px;
        border-radius: 5px;
        text-align: center;
        position: fixed;
        left: 50%;
        margin-left: -85px;
        font-size: 0.7em;
        transition: all 1s ease-in;
        z-index: 999;
    }
    .hide {
        top: 0px;
        opacity: 0;
        transition: all 0.3s ease-out;
    }
    .show {
        top: 15px;
        opacity: 1;
        transition: all 0.3s ease-in;
    }
    .top {
        opacity: 0;
        position: absolute;
        top: 0;
    }
</style>

