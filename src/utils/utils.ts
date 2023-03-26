import type { PuzzleSize } from "@customTypes/gameTypes";
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

export function boardIterator(
  rows: number,
  cols: number,
  onRow?: (row: number) => void,
  onColumn?: (row: number, column: number) => void
) {
  for (var rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    onRow && onRow(rowIndex);
    for (var columnIndex = 0; columnIndex < cols; columnIndex += 1) {
      onColumn && onColumn(rowIndex, columnIndex);
    }
  }
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
