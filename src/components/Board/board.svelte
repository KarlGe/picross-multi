<script lang="ts">
  import { onMount } from "svelte";
  import type { SquareData } from "@customTypes/squareData";
  import Square from "@components/Square/Square.svelte";
  import data from "@data/1.json";
  let boardData: SquareData[][] = [];
  const rows = data.height;
  const cols = data.width;

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
<div id="board-wrapper">
  <div class="row-data">
    {#each data.rows as rowData}
      <div>
        {#each rowData as rowNumber}
          <div>{rowNumber}</div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="column-data">
    {#each data.columns as columnData}
      <div>
        {#each columnData as columnNumber}
          <div>{columnNumber}</div>
        {/each}
      </div>
    {/each}
  </div>
  <div id="board">
    {#each boardData as squareRow}
      <div>
        {#each squareRow as square}
          <Square bind:squareData={square} />
        {/each}
      </div>
    {/each}
  </div>
  <div id="board-footer">
    <button on:click={clearBoard}>Clear</button>
  </div>
</div>

<style lang="scss">
  @import "./board.scss";
</style>
