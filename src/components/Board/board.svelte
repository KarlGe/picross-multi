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
  export let marginRowWidth: number;
  export let rows: number;
  export let cols: number;
  export let margins: MarginData;
  export let finished: boolean;
  export let initialData: BoardData;
  export let boardData: BoardData;
  export let screenWidth;

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
  let styleVars;
  $: gameWidth = screenWidth - marginRowWidth;

  const getSquareSize = (totalWidth: number, numberOfSquares: number) => {
    return Math.min((totalWidth - 50) / numberOfSquares, 50);
  };

  $: styleVars = `
  --board-size: ${gameWidth}px; 
  --col-number: ${cols}; 
  --square-size: ${getSquareSize(gameWidth, cols)}px`;
</script>

<div id="board-wrapper" style={styleVars}>
  {#if margins.rows && margins.columns && boardData}
    <Margins bind:marginData={margins} bind:rowWidth={marginRowWidth} />
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
  <BoardFooter on:clearBoard={clearBoard} on:checkBoard bind:finished />
</div>

<style lang="scss">
  @import "./board.scss";
</style>
