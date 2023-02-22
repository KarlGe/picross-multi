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
  let margins: MarginData = { rows: [], columns: [] };
  let puzzle: Puzzle = undefined;
  let finished = false;
  let initialData: BoardData = [];
  let boardData: BoardData;
  // const rows = data.height;
  // const cols = data.width;
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

  const checkBoard = (event) => {
    finished = checkSolution(puzzle, event.detail.boardData);
  };
  $: puzzle, console.log(puzzle);
</script>

<main>
  <div class="App">
    <!-- <Connection /> -->
    <div class="App-main">
      <Board
        bind:boardData
        bind:margins
        bind:finished
        bind:initialData
        on:checkBoard={checkBoard}
      />
      <Settings on:create-puzzle={createPuzzle} bind:rows bind:cols />
    </div>
  </div>
</main>

<style lang="scss" global>
  @import "./styles/index.scss";
</style>
