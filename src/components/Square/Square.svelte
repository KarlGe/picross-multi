<script>
  export let squareData;
  export let setState;
  export let test;
  console.log(squareData);

  const onClick = (type) => {
    if (type == "right") {
      if (squareData.state == "excluded") {
        squareData.state = "";
      } else {
        squareData.state = "excluded";
      }
      return;
    }
    if (squareData.state == "clicked") {
      squareData.state = "";
    } else {
      squareData.state = "clicked";
    }
  };
</script>

<button
  class={squareData.state}
  on:click={() => onClick("left")}
  on:contextmenu|preventDefault={() => onClick("right")}
  on:mouseenter={() => console.log("enter")}
/>
<style src="./square.scss"></style>
