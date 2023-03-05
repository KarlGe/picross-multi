<script lang="ts">
  import Board from "./components/Board/board.svelte";
  import { onMount } from "svelte";
  import type { BoardData, MarginData, Puzzle } from "@customTypes/gameTypes";
  import {
    checkSolution,
    createInitialData,
    createMargins,
    generatePuzzle,
  } from "@services/generator";
  import Settings from "@components/Settings/Settings.svelte";
  import { eventTypes } from "@utils/events";
  let margins: MarginData = { rows: [], columns: [] };
  let puzzle: Puzzle = undefined;
  let finished = false;
  let initialData: BoardData = [];
  let boardData: BoardData;
  let windowHeight: number;
  let windowWidth: number;
  let marginRowWidth;
  let rows = 5;
  let cols = 5;

  const createPuzzle = (numRows: number, numCols: number) => {
    rows = numRows;
    cols = numCols;
    puzzle = generatePuzzle(numRows, numCols);
    margins = createMargins(puzzle);
    initialData = createInitialData(rows, cols);
    window.dispatchEvent(new Event(eventTypes.newGame));
    window.dispatchEvent(new Event(eventTypes.clear));
  };
  onMount(() => {
    createPuzzle(rows, cols);
  });

  const checkBoard = () => {
    finished = checkSolution(puzzle, boardData);
  };
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<main>
  <div class="App">
    <!-- <Connection /> -->
    <div class="App-main">
      <Board
        bind:rows
        bind:cols
        bind:marginRowWidth
        bind:boardData
        bind:margins
        bind:finished
        bind:initialData
        bind:screenWidth={windowWidth}
        on:checkBoard={checkBoard}
      />
      <Settings
        on:create-puzzle={(e) =>
          createPuzzle(e.detail.numRows, e.detail.numCols)}
        bind:rows
        bind:cols
      />
    </div>
  </div>
</main>

<style lang="scss" global>
  @import "./styles/index.scss";
</style>
