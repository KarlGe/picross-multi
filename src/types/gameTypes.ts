export type Puzzle = number[][];
export type MarginData = {
  rows: number[][];
  columns: number[][];
};

export type BoardData = SquareData[][];

export type SquareData = {
  rowNum: number;
  columnNum: number;
  state: "clicked" | "excluded" | "";
};
