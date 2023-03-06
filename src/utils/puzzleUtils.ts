import type { Puzzle } from "@customTypes/gameTypes";

export const makeEmptyPuzzle = (rows: number, columns: number): Puzzle => ({
  size: { columnSize: columns, rowSize: rows },
  solution: [],
});
