<script lang="ts">
  import Margins from "@components/Margins/Margins.svelte";
  import PostMargins from "@components/PostMargins/PostMargins.svelte";
  import Square from "@components/Square/Square.svelte";
  import type {
    BoardData,
    MarginData,
    SquareData,
  } from "@customTypes/gameTypes";
  import { createInitialData } from "@services/generator";
  import { checkIsInLine, squareEquals } from "@utils/boardUtils";
  import { eventTypes } from "@utils/events";
  import { isBetween, iterateBetween } from "@utils/utils";
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
    boardData = createInitialData(rows, cols);
    initialData = boardData;
    finished = false;
    window.dispatchEvent(new Event(eventTypes.clear));
  };
  let styleVars;
  $: gameWidth = screenWidth - marginRowWidth;

  const getSquareSize = (totalWidth: number, numberOfSquares: number) => {
    const squareSize = Math.floor(
      Math.min((totalWidth - 50) / numberOfSquares, 50)
    );
    return squareSize - (squareSize % 2);
  };

  $: styleVars = `
  --board-size: ${gameWidth}px; 
  --col-number: ${cols}; 
  --square-size: ${getSquareSize(gameWidth, cols)}px`;

  let squaresDragged: SquareData[] = [];

  const onDrag = (e: CustomEvent<SquareData>) => {
    const { detail: squareData } = e;
    const { inLine, sameCol, sameRow } = checkIsInLine(
      squareData,
      squaresDragged
    );
    const firstSquare = squaresDragged[0];
    if (inLine) {
      const newList = [firstSquare];
      const dispatchNewSquare = (newSquare: SquareData) => {
        if(squareEquals(newSquare, firstSquare)) {
          return;
        }
        window.dispatchEvent(
          new CustomEvent<SquareData>(eventTypes.setSquare, {
            detail: newSquare,
          })
        );
        newList.push(newSquare);
      };
      if (sameCol) {
        iterateBetween(squaresDragged[0].rowNum, squareData.rowNum, (i) => {
          const newSquare = {
            columnNum: firstSquare.columnNum,
            rowNum: i,
            state: firstSquare.state,
          } as SquareData;
          dispatchNewSquare(newSquare);
        });
      } else if (sameRow) {
        iterateBetween(
          squaresDragged[0].columnNum,
          squareData.columnNum,
          (i) => {
            const newSquare = {
              columnNum: i,
              rowNum: firstSquare.rowNum,
              state: firstSquare.state,
            } as SquareData;
            dispatchNewSquare(newSquare);
          }
        );
      }
      squaresDragged.forEach((existingSquare) => {
        if (!isBetween(existingSquare, squaresDragged[0], squareData)) {
          window.dispatchEvent(
            new CustomEvent<SquareData>(eventTypes.revertSquare, {
              detail: existingSquare,
            })
          );
        }
      });
      squaresDragged = newList;
    }
  };
  const endDrag = () => {
    squaresDragged = [];
  };
</script>

<svelte:body on:pointerup={endDrag} />

<div id="board-wrapper" style={styleVars}>
  {squaresDragged.length}
  {#if margins.rows && margins.columns && boardData}
    <Margins bind:marginData={margins} bind:rowWidth={marginRowWidth} />
    <div id="board">
      {#each boardData as squareRow}
        <div class="row">
          {#each squareRow as square}
            <Square
              bind:squareData={square}
              bind:squaresDragged
              on:drag={onDrag}
            />
          {/each}
        </div>
      {/each}
    </div>
    <PostMargins bind:rows bind:cols />
  {/if}
  <BoardFooter on:clearBoard={clearBoard} on:checkBoard bind:finished />
</div>

<style lang="scss">
  @import "./board.scss";
</style>
