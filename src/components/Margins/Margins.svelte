<script lang="ts">
  import type { MarginData } from "@customTypes/gameTypes";
  import { afterUpdate, tick } from "svelte";
  import MarginNumber from "./MarginNumber.svelte";

  let rowElement;
  export let rowWidth: number;

  export let marginData: MarginData;

  afterUpdate(async () => {
    await tick();
    rowWidth = rowElement?.clientWidth;
  });
</script>

<div class="row-data" style="display:block" bind:this={rowElement}>
  {#each marginData.rows as rowData, i}
    <div>
      {#each rowData as rowNumber}
        <MarginNumber type="row" marginRow={i} bind:marginNumber={rowNumber} />
        <span class="delimiter">-</span>
      {/each}
    </div>
  {/each}
</div>
<div class="column-data">
  {#each marginData.columns as columnData, i}
    <div>
      {#each columnData as columnNumber}
        <MarginNumber type="column" marginCol={i} bind:marginNumber={columnNumber} />
      {/each}
    </div>
  {/each}
</div>

<style src="./margins.scss"></style>
