import type { SquareData } from "@customTypes/gameTypes";

export const isInLine = (
  squareData: SquareData,
  prevSquares: SquareData[]
) => {
  const firstSquare = prevSquares[0];
  const prevSquare = prevSquares[prevSquares.length - 1];
  if (!prevSquare) {
    return false;
  }
  const sameCol =
    squareData.columnNum === firstSquare.columnNum &&
    squareData.columnNum === prevSquare.columnNum;
  const sameRow =
    squareData.rowNum === firstSquare.rowNum &&
    squareData.rowNum === prevSquare.rowNum;
  if (sameRow || sameCol) {
    return true;
  }
  return false;
};
