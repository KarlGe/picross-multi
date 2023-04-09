<script lang="ts">
  export let squaresDragged;

  let pos = [0, 0];

  $: styleVars = `
  left: ${pos[0] - 30}px; 
  top: ${pos[1] - 10}px;`;
  const handlePosition = (e) => {
    if (e.touches) {
      console.log(e.touches[0]);
    }
    if (e.touches || e.changedTouches) {
      const { clientX, clientY } = (e.touches || e.changedTouches)[0];
      pos = [clientX, clientY];
    } else {
      pos = [e.clientX, e.clientY];
    }
  };
</script>

<svelte:window
  on:touchstart={handlePosition}
  on:touchmove={handlePosition}
  on:mousedown={handlePosition}
  on:mousemove={handlePosition}
/>

{#if squaresDragged.length > 0}
  <div class="cursor-tooltip" style={styleVars}>
    {squaresDragged.length}
  </div>
{/if}

<style lang="scss">
  @import "./cursorTooltip.scss";
</style>
