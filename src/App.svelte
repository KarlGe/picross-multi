<script lang="ts">
  import Board from "./components/Board/board.svelte";
  import { onMount } from "svelte";
  import type {
    BoardData,
    MarginData,
    Puzzle,
    SquareData,
  } from "@customTypes/gameTypes";
  import {
    checkSolution,
    createMargins,
    generatePuzzle,
  } from "@services/generator";
  import Settings from "@components/Settings/Settings.svelte";
  import WindowSize from "@components/Utils/WindowSize.svelte";
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

  const createInitialData = (rowNum: number, colNum: number) => {
    const data: BoardData = [];
    for (let row = 0; row < rowNum; row++) {
      data.push([]);
      for (let column = 0; column < colNum; column++) {
        // const filled = puzzle[row][column];
        data[row].push({
          rowNum: row,
          columnNum: column,
          // state: filled ? "clicked" : "",
          state: "",
        } as SquareData);
      }
    }
    return data;
  };
  const createPuzzle = () => {
    puzzle = generatePuzzle(rows, cols);
    margins = createMargins(puzzle);
    initialData = createInitialData(rows, cols);
  };
  onMount(() => {
    createPuzzle();
  });

  const checkBoard = () => {
    finished = checkSolution(puzzle, boardData);
  };
</script>

<main>
  <div class="App">
    <WindowSize bind:windowWidth bind:windowHeight />
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
      <Settings on:create-puzzle={createPuzzle} bind:rows bind:cols />
    </div>
  </div>
</main>

<style lang="scss" global>
  @import "./styles/index.scss";
</style>
