<script lang="ts">
  export let show: boolean = true;
</script>

{#if show}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
    viewBox="0 0 100 100"
  >
    <path
      stroke="currentColor"
      stroke-linecap="square"
      d="m10 10 80 80m-80 0 80-80"
    />
  </svg>
{/if}

<style lang="scss">
  svg {
    color: var(--color-cancel);
    stroke-width: 1rem;
    width: 1rem;
    height: 1rem;
  }
</style>
