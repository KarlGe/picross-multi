<script lang="ts">
  import { onMount } from "svelte";

  export let windowWidth;
  export let windowHeight;

  const setSize = () => {
    windowWidth = window.outerWidth;
    windowHeight = window.outerHeight;
  };

  onMount(() => {
    setSize();
  });
</script>

<svelte:window on:resize={setSize} />
