<script lang="ts">
  import Board from "./components/Board/board.svelte";
  import { onMount } from "svelte";
  import type { BoardData, MarginData, Puzzle, SquareData } from "@customTypes/gameTypes";
  import {
    checkSolution,
    createMargins,
    generatePuzzle,
  } from "@services/generator";
  let margins: MarginData = { rows: [], columns: [] };
  let puzzle: Puzzle = undefined;
  let finished = false;
  let initialData: BoardData = [];
  // const rows = data.height;
  // const cols = data.width;
  const rows = 5;
  const cols = 5;
  onMount(() => {
    puzzle = generatePuzzle(rows, cols);
    for (let row = 0; row < rows; row++) {
      initialData.push([]);
      for (let column = 0; column < cols; column++) {
        const filled = puzzle[row][column];
        initialData[row].push({
          rowNum: row,
          columnNum: column,
          // state: filled ? "clicked" : "",
          state: "",
        } as SquareData);
      }
    }
    margins = createMargins(puzzle);
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
      <Board bind:margins bind:finished bind:initialData on:checkBoard={checkBoard} />
    </div>
  </div>
</main>

<style lang="scss" global>
  @import "./styles/index.scss";
</style>
