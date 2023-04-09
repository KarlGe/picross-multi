<script lang="ts">
  export let squaresDragged;

  let pos = [0, 0];
  let isTouch = false;

  $: styleVars = `
  left: ${pos[0] - (isTouch ? 100 : 30)}px; 
  top: ${pos[1] - (isTouch ? 50 : 20)}px;`;
  const handlePosition = (e) => {
    if (e.touches || e.changedTouches) {
      isTouch = true;
      const { clientX, clientY } = (e.touches || e.changedTouches)[0];
      pos = [clientX, clientY];
    } else {
        isTouch = false;
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
