<script lang="ts">
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
</button>

<style lang="scss" src="./marginNumber.scss"></style>
