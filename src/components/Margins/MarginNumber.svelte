<script lang="ts">
  import Cross from "@components/Icons/Cross.svelte";
  import { eventTypes } from "@utils/events";

  export let type: "row" | "column";
  export let marginNumber: number;
  let crossedOut = false;
  window.addEventListener(eventTypes.clear, () => (crossedOut = false));
</script>

<button
  on:click={() => (crossedOut = !crossedOut)}
  class="margin-number {type} {crossedOut ? 'crossed-out' : ''}"
>
  {marginNumber}
  <Cross show={crossedOut} />
</button>

<style lang="scss" src="./marginNumber.scss"></style>
