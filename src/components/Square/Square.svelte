<script lang="ts">
  import { isInLine } from "@utils/boardUtils";
  import type { SquareData, SquareState } from "../../types/gameTypes";

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
    if (squareData.state == "clicked") {
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
</script>

<button
  class={squareData.state}
  on:pointerdown={onDragStart}
  on:dblclick={() => onClick("right")}
  on:contextmenu|preventDefault={() => onClick("right")}
  on:pointerenter={onDragEnter}
  on:gotpointercapture={(e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  }}
/>

<style src="./square.scss"></style>
