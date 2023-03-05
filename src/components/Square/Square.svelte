<script lang="ts">
  import Cross from "@components/Icons/Cross.svelte";
  import { isInLine } from "@utils/boardUtils";
  import { eventTypes } from "@utils/events";
  import { onMount } from "svelte";
  import type {
    CellPosition,
    SquareData,
    SquareState,
  } from "@customTypes/gameTypes";
  import { clickHandler } from "../../actions/clickHandler";

  type ClickType = "left" | "right";

  export let squareData: SquareData;
  export let squaresDragged: SquareData[];

  const setState = (state: SquareState) => {
    squareData.state = state;
  };

  const onClick = (type: ClickType) => {
    if (type == "right") {
      if (squareData.state == "excluded") {
        setState("");
      } else {
        setState("excluded");
      }
      return;
    }
    if (squareData.state != "") {
      setState("");
    } else {
      setState("clicked");
    }
  };
  const onDragStart = () => {
    onClick("left");
    squaresDragged = [squareData];
  };
  const onDragEnter = (e) => {
    if (isInLine(squareData, squaresDragged)) {
      squaresDragged.push(squareData);
      squareData.state = squaresDragged[0].state;
    }
  };
  onMount(() => {
    window.addEventListener(
      eventTypes.crossall,
      (e: CustomEvent<CellPosition>) => {
        const { col, row } = e.detail;
        if (col === squareData.columnNum || row === squareData.rowNum) {
          if (squareData.state !== "clicked") {
            setState("excluded");
          }
        }
      }
    );
  });
</script>

<button
  class={squareData.state}
  use:clickHandler
  on:leftclick={onDragStart}
  on:doubleclick={() => onClick("right")}
  on:rightclick={() => onClick("right")}
  on:pointerenter={onDragEnter}
>
  <Cross show={squareData.state === "excluded"} />
</button>

<style src="./square.scss"></style>
