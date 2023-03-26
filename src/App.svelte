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
  import { getLevelSize, setLevelSize } from "@utils/utils";
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
    setLevelSize(rows, cols);
    puzzle = generatePuzzle(numRows, numCols);
    const [generatedMargins, solution] = createMargins(puzzle);
    margins = generatedMargins;
    initialData = createInitialData(rows, cols, solution);
    finished = false;
    window.dispatchEvent(new Event(eventTypes.newGame));
    window.dispatchEvent(new Event(eventTypes.clear));
  };
  onMount(() => {
    const startSize = getLevelSize();
    createPuzzle(startSize.rowSize, startSize.columnSize);
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
