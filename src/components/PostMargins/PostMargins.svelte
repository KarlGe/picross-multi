<script lang="ts">
  import Cross from "@components/Icons/Cross.svelte";
  import type { CellPosition } from "@customTypes/gameTypes";
  import { eventTypes } from "@utils/events";
  import { clickHandler } from "../../actions/clickHandler";

  export let rows;
  export let cols;

  const onClick = (eventDetail: CellPosition, invert = false) => {
    let eventType = eventTypes.crossall;
    if (invert) {
      eventType = eventTypes.crossallinvert;
    }
    window.dispatchEvent(new CustomEvent(eventType, { detail: eventDetail }));
  };
</script>

<div id="row-footer">
  {#each Array(rows) as _, i}
    <button
      use:clickHandler
      on:doubleclick={() => onClick({ row: i }, true)}
      on:leftclick={() => onClick({ row: i })}
    >
      <Cross />
    </button>
  {/each}
</div>
<div id="column-footer">
  {#each Array(cols) as _, i}
    <button
      use:clickHandler
      on:doubleclick={() => onClick({ col: i }, true)}
      on:leftclick={() => onClick({ col: i })}
    >
      <Cross />
    </button>
  {/each}
</div>

<style lang="scss">
  @import "./postMargins.scss";
</style>
