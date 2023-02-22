<script lang="ts">
  import type { MarginData } from "@customTypes/gameTypes";
  import { afterUpdate, tick } from "svelte";

  let rowElement;
  export let rowWidth: number;

  export let marginData: MarginData;

  afterUpdate(async () => {
    await tick();
    rowWidth = rowElement?.clientWidth;
  });
</script>

<div class="row-data" style="display:block" bind:this={rowElement}>
  {#each marginData.rows as rowData}
    <div>
      {#each rowData as rowNumber}
        <div class="row-number">{rowNumber}</div>
      {/each}
    </div>
  {/each}
</div>
<div class="column-data">
  {#each marginData.columns as columnData}
    <div>
      {#each columnData as columnNumber}
        <div>{columnNumber}</div>
      {/each}
    </div>
  {/each}
</div>

<style src="./margins.scss"></style>
