<script lang="ts">
  import Square from "./components/Square/Square.svelte";
  import { onMount } from "svelte";
  import type { SquareData } from "./types/squareData";
  // import Connection from "./components/Connection.svelte";
  let boardData: SquareData[][] = [];
  const rows = 5;
  const cols = 5;
  let test = 1;

  onMount(() => {
    const initialData = [];
    for (let row = 0; row < rows; row++) {
      initialData.push([]);
      for (let column = 0; column < cols; column++) {
        initialData[row].push({ rowNum: row, columnNum: column, state: "" });
      }
    }
    boardData = initialData;
  });

  const clearBoard = () => {
    const newData = boardData.map((row) => {
      return row.map((cell) => {
        return { ...cell, state: "" } as SquareData;
      });
    });
    boardData = newData;
  };
</script>

<main>
  <div class="App">
    <!-- <Connection /> -->
    <div class="App-main">
      {#each boardData as squareRow}
        <div>
          {#each squareRow as square}
            <Square bind:squareData={square} />
          {/each}
        </div>
      {/each}
      <button on:click={clearBoard}>Clear</button>
    </div>
  </div>
</main>

<style lang="scss">
  @import "./styles/index.scss";
  .App-main {
    min-height: 100vh;
    display: flex;
    color: var(test);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }
</style>
