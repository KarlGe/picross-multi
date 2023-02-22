<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let rows: number;
  export let cols: number;

  const dispatch = createEventDispatcher();

  const createPuzzle = () => {
    dispatch("create-puzzle");
  };
</script>

<div class="game-settings">
  <input type="number" bind:value={rows} />
  <input type="number" bind:value={cols} />
  <button on:click={createPuzzle}>Generate</button>
</div>

<style lang="scss">
  @import "./settings.scss";
</style>
