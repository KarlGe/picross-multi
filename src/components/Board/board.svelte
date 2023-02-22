<script lang="ts">
  import Margins from "@components/Margins/Margins.svelte";
  import Square from "@components/Square/Square.svelte";
  import type {
    BoardData,
    MarginData,
    SquareData,
  } from "@customTypes/gameTypes";
  import { onMount } from "svelte";
  import BoardFooter from "./BoardFooter/BoardFooter.svelte";
  export let margins: MarginData;
  export let finished: boolean;
  export let initialData: BoardData;
  export let boardData: BoardData;

  onMount(() => {
    boardData = initialData;
  });

  $: initialData, (boardData = initialData);

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
    <Margins bind:marginData={margins} />
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
  <BoardFooter on:clearBoard={clearBoard} bind:finished />
</div>

<style lang="scss">
  @import "./board.scss";
</style>
