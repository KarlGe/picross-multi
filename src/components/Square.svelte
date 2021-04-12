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

<style lang="scss">
  button {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 1px solid black;
    position: relative;
    &:hover,
    &:focus {
      border: 1px solid red;
    }
    &.clicked {
      &:after {
        display: inline-block;
        content: "";
        background-color: black;
        position: absolute;
        width: 36px;
        height: 36px;
        left: 1px;
        top: 1px;
      }
    }
    &.excluded {
      &:after {
        display: inline-block;
        content: "\00d7";
        font-size: 2rem;
        line-height: 2rem;
        color: red;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }
    }
  }
</style>
