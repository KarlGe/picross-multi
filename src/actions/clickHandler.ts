const doubleClickTime = 300;

export function clickHandler(node: HTMLElement) {
  let lastClickedTime: Date;

  const handleClick = (e) => {
    const clickedTime = new Date();
    const clickDiff = lastClickedTime
      ? clickedTime.getTime() - lastClickedTime.getTime()
      : undefined;
    if (clickDiff && clickDiff < doubleClickTime) {
      node.dispatchEvent(new CustomEvent("doubleclick"));
      lastClickedTime = undefined;
      return;
    }
    lastClickedTime = clickedTime;
    node.dispatchEvent(new CustomEvent("leftclick"));
  };

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    node.dispatchEvent(new CustomEvent("rightclick"));
  };

  const onPointCapture = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  node.addEventListener("pointerdown", handleClick);
  node.addEventListener("contextmenu", handleRightClick);
  node.addEventListener("gotpointercapture", onPointCapture);
  return {
    destroy() {
      node.removeEventListener("pointerdown", handleClick);
      node.removeEventListener("contextmenu", handleRightClick);
      node.removeEventListener("gotpointercapture", onPointCapture);
    },
  };
}
