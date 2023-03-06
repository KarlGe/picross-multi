export type PuzzleSize = { rowSize: number; columnSize: number };

export type Puzzle = {
  solution: number[][];
  size: PuzzleSize;
};

export type MarginData = {
  rows: MarginNumbers;
  columns: MarginNumbers;
};

export type MarginNumbers = number[][];

export type BoardData = SquareData[][];

export type SquareState = "clicked" | "excluded" | "";

export type SquareData = {
  rowNum: number;
  columnNum: number;
  state: SquareState;
};

export type CellPosition = {
  row?: number;
  col?: number;
};
