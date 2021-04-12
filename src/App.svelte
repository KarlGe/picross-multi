<script>
  import Square from "./components/Square.svelte";
  import { onMount } from "svelte";
  import Connection from "./components/Connection.svelte";
  let boardData = [];
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
</script>

<div class="App">
  <div class="App-main">
    {#each boardData as squareRow}
      <div>
        {#each squareRow as square}
          <Square bind:squareData={square} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "./styles/index.scss";
  .App-main {
    background-color: #f9f6f6;
    min-height: 100vh;
    display: flex;
    color: $test;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }
</style>
