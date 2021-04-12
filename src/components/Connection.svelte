<script>
  import { connectToPeer, createConnection } from "../services/connection";
  import { onMount } from "svelte";

  onMount(() => {
    connectToPeer();
  });

  let connectionId = "";
  const connect = async () => {
    createConnection((newId) => (connectionId = newId));
  };
</script>

<button type="button" on:click={connect}>Create connection</button>
{#if connectionId}
  Connection ID: {connectionId}
{/if}
