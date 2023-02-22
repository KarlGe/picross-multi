<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let finished: boolean;

  const dispatch = createEventDispatcher();

  const checkBoard = () => {
    dispatch("checkBoard");
  };

  const clearBoard = () => {
    dispatch("clearBoard");
  };
</script>

<div id="board-footer">
  <button on:click={clearBoard}>Clear</button>
  <button on:click={checkBoard}>Check</button>
  <div>
    <span>Completed: {finished}</span>
  </div>
</div>

<style lang="scss">
  @import "./boardFooter.scss";
</style>
