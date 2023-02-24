<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let rows: number;
  export let cols: number;

  const dispatch = createEventDispatcher();

  const createPuzzle = (numCols: number, numRows: number) => {
    dispatch("create-puzzle", { numCols, numRows });
  };

  const handleSubmit = (e: SubmitEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    createPuzzle(
      parseInt(formData.get("cols") as string),
      parseInt(formData.get("rows") as string)
    );
  };
</script>

<div class="game-settings">
  <div class="presets">
    <button type="button" on:click={() => createPuzzle(5, 5)}>5x5</button>
    <button type="button" on:click={() => createPuzzle(8, 8)}>8x8</button>
    <button type="button" on:click={() => createPuzzle(10, 10)}>10x10</button>
    <button type="button" on:click={() => createPuzzle(15, 15)}>15x15</button>
  </div>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="number" name="cols" value={cols} />
    <input type="number" name="rows" value={rows} />
    <button type="submit">Generate</button>
  </form>
</div>

<style lang="scss">
  @import "./settings.scss";
</style>
