import type { PuzzleSize, SquareData } from "@customTypes/gameTypes";
import { makeSeed } from "@services/rand";

const queryKeys = {
  seed: "s",
  levelSize: "ls",
};
const sizeDelimiter = "x";
const defaultSize: PuzzleSize = { rowSize: 5, columnSize: 5 };

export function setLevelSize(rowSize, columnSize) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(
    queryKeys.levelSize,
    `${rowSize}${sizeDelimiter}${columnSize}`
  );
  window.history.pushState({}, "", `/?${searchParams}`);
}

export function getLevelSize() {
  const searchParams = new URLSearchParams(window.location.search);
  const querySize = searchParams.get(queryKeys.levelSize);
  const size = querySize?.split(sizeDelimiter);
  if (!size || size.length !== 2) {
    return defaultSize;
  }
  const [queryRows, queryColumns] = size;
  const sizeDef: PuzzleSize = {
    rowSize: parseInt(queryRows),
    columnSize: parseInt(queryColumns),
  };
  if (isNaN(sizeDef.rowSize) || isNaN(sizeDef.columnSize)) {
    return defaultSize;
  }
  return sizeDef;
}

export function setQuerySeed(newSeed: number) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(queryKeys.seed, newSeed.toString());
  window.history.pushState({}, "", `/?${searchParams}`);
}

export function getQuerySeed() {
  const searchParams = new URLSearchParams(window.location.search);
  const querySeed = parseInt(searchParams.get(queryKeys.seed));
  if (isNaN(querySeed)) {
    const newSeed = makeSeed();
    setQuerySeed(newSeed);
    return newSeed;
  }
  return querySeed;
}

/**
 * Iterates between two numbers independent of which one is the larger number
 * @param inputX First number
 * @param inputY Second number
 * @param action Action to perform for each iteration
 */
export function iterateBetween(
  inputX: number,
  inputY: number,
  action: (actionIndex: number) => void
) {
  if (inputX === inputY) {
    action(inputX);
  }
  else if (inputY > inputX) {
    for (let index = inputX; index <= inputY; index++) {
      action(index);
    }
  }
  else if (inputX > inputY) {
    for (let index = inputY; index <= inputX; index++) {
      action(index);
    }
  }
}

export function isBetween(x: SquareData, y1: SquareData, y2: SquareData) {
  return (
    (x.rowNum === y1.rowNum && inRange(x.columnNum, y1.columnNum, y2.columnNum)) ||
    (x.columnNum === y1.columnNum && inRange(x.rowNum, y1.rowNum, y2.rowNum))
  );
}

export function inRange(x: number, y1: number, y2: number) {
  return (x - y1) * (x - y2) <= 0;
}
