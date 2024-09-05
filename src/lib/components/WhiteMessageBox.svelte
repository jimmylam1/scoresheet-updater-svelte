
<div class="wrapper">
    <div class="container">
        <slot />
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
    }
    .container {
        width: 300px;
        padding: 30px;
        border: 2px solid lightgray;
        border-radius: 10px;
        background-color: #FFF;
        color: black;
    }
</style>