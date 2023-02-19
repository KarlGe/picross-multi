<script lang="ts">
  import type { MarginData } from "@customTypes/gameTypes";

  export let marginData: MarginData;
</script>

<div class="row-data">
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
