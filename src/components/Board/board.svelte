<script lang="ts">
  import { onMount } from "svelte";
  import Square from "../Square/Square.svelte";
  import type { SquareData } from "../../types/squareData";
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

<div>
  {#each boardData as squareRow}
    <div>
      {#each squareRow as square}
        <Square bind:squareData={square} />
      {/each}
    </div>
  {/each}
  <button on:click={clearBoard}>Clear</button>
</div>
