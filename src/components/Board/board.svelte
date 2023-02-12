<script lang="ts">
  import { onMount } from "svelte";
  import type { MarginData, SquareData } from "@customTypes/gameTypes";
  import Square from "@components/Square/Square.svelte";
  import data from "@data/1.json";
  import { createMargins, generatePuzzle } from "../../services/generator";
  let boardData: SquareData[][] = [];
  let margins: MarginData = { rows: [], columns: [] };
  // const rows = data.height;
  // const cols = data.width;
  const rows = 5;
  const cols = 5;
  onMount(() => {
    const puzzle = generatePuzzle(rows, cols);
    const initialData = [];
    for (let row = 0; row < rows; row++) {
      initialData.push([]);
      for (let column = 0; column < cols; column++) {
        const filled = puzzle[row][column];
        initialData[row].push({
          rowNum: row,
          columnNum: column,
          // state: filled ? "clicked" : "",
          state: '',
        } as SquareData);
      }
    }
    margins = createMargins(puzzle);
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
    {#each margins.rows as rowData}
      <div>
        {#each rowData as rowNumber}
          <div>{rowNumber}</div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="column-data">
    {#each margins.columns as columnData}
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
