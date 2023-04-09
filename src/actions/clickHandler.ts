const doubleClickTime = 300;

const isRightClick = (e) => {
  return (e.which && e.which === 3) || (e.button && e.button === 2);
};

export function clickHandler(node: HTMLElement) {
  let lastClickedTime: Date;

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    node.dispatchEvent(new CustomEvent("rightclick"));
  };

  const handleClick = (e) => {
    if (isRightClick(e)) {
      handleRightClick(e);
      return;
    }
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

  const onPointCapture = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  node.addEventListener("pointerdown", handleClick);
  node.addEventListener("contextmenu", handleContextMenu);
  node.addEventListener("gotpointercapture", onPointCapture);
  return {
    destroy() {
      node.removeEventListener("pointerdown", handleClick);
      node.removeEventListener("contextmenu", handleContextMenu);
      node.removeEventListener("gotpointercapture", onPointCapture);
    },
  };
}
