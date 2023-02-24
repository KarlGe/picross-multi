export type Puzzle = number[][];
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
