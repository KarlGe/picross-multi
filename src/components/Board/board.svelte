<script lang="ts">
  import Square from "@components/Square/Square.svelte";
  import type {
    BoardData,
    MarginData,
    SquareData,
  } from "@customTypes/gameTypes";
  import { createEventDispatcher, onMount } from "svelte";
  export let margins: MarginData;
  export let finished: boolean;
  export let initialData: BoardData;
  let boardData: BoardData;

  onMount(() => {
    boardData = initialData;
  });

  $: initialData, (boardData = initialData);

  const dispatch = createEventDispatcher();

  const checkBoard = () => {
    dispatch("checkBoard", { boardData });
  };

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
  {#if margins.rows && margins.columns && boardData}
    <div class="row-data">
      {#each margins.rows as rowData}
        <div>
          {#each rowData as rowNumber}
            <div class="row-number">{rowNumber}</div>
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
        <div class="row">
          {#each squareRow as square}
            <Square bind:squareData={square} />
          {/each}
        </div>
      {/each}
    </div>
  {/if}
  <div id="board-footer">
    <button on:click={clearBoard}>Clear</button>
    <button on:click={checkBoard}>Check</button>
    <span>Completed: {finished}</span>
  </div>
</div>

<style lang="scss">
  @import "./board.scss";
</style>
