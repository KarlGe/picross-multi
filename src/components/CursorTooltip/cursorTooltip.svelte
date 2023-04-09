<script lang="ts">
  export let squaresDragged;

  let pos = [0, 0];

  $: styleVars = `
  left: ${pos[0] - 30}px; 
  top: ${pos[1] - 10}px;`;
  const handleMousemove = (e) => {
    pos = [e.clientX, e.clientY];
  };
</script>

<svelte:window on:mousemove={handleMousemove} />

{#if squaresDragged.length > 0}
  <div class="cursor-tooltip" style={styleVars}>
    {squaresDragged.length}
  </div>
{/if}

<style lang="scss">
  @import "./cursorTooltip.scss";
</style>
