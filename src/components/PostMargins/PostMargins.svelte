<script lang="ts">
  import Cross from "@components/Icons/Cross.svelte";
  import type { CellPosition } from "@customTypes/gameTypes";
  import { eventTypes } from "@utils/events";

  export let rows;
  export let cols;

  const onClick = (eventDetail: CellPosition) => {
    window.dispatchEvent(
      new CustomEvent(eventTypes.crossall, { detail: eventDetail })
    );
  };
</script>

<div id="row-footer">
  {#each Array(rows) as _, i}
    <button on:click={() => onClick({ row: i })}>
      <Cross />
    </button>
  {/each}
</div>
<div id="column-footer">
  {#each Array(cols) as _, i}
    <button on:click={() => onClick({ col: i })}>
      <Cross />
    </button>
  {/each}
</div>

<style lang="scss">
  @import "./postMargins.scss";
</style>
