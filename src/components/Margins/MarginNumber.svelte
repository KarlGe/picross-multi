<script lang="ts">
  import Cross from "@components/Icons/Cross.svelte";
  import type { CellPosition } from "@customTypes/gameTypes";
  import { eventTypes } from "@utils/events";
  import { clickHandler } from "../../actions/clickHandler";

  export let type: "row" | "column";
  export let marginNumber: number;
  export let marginCol: number = undefined;
  export let marginRow: number = undefined;

  let crossedOut = false;
  window.addEventListener(eventTypes.clear, () => (crossedOut = false));
  const onCrossAll = (event: CustomEvent<CellPosition>, inverted = false) => {
    const { col, row } = event.detail;
    if (marginCol === col && marginRow === row) {
      crossedOut = !inverted;
    }
  };
  window.addEventListener(eventTypes.crossall, onCrossAll);
  window.addEventListener(eventTypes.crossallinvert, (e) =>
    onCrossAll(e, true)
  );
</script>

<button
  on:click={() => (crossedOut = !crossedOut)}
  class="margin-number {type} {crossedOut ? 'crossed-out' : ''}"
>
  {marginNumber}
  <Cross show={crossedOut} />
</button>

<style lang="scss" src="./marginNumber.scss"></style>
