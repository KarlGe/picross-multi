import type { SquareData } from "@customTypes/gameTypes";

export type InLineResult = {
  inLine: boolean;
  sameRow: boolean;
  sameCol: boolean;
};

export const checkIsInLine = (
  squareData: SquareData,
  prevSquares: SquareData[]
): InLineResult => {
  const firstSquare = prevSquares[0];
  const prevSquare = prevSquares[prevSquares.length - 1];
  if (!prevSquare) {
    return { inLine: false, sameRow: false, sameCol: false };
  }
  const sameCol =
    squareData.columnNum === firstSquare.columnNum &&
    squareData.columnNum === prevSquare.columnNum;
  const sameRow =
    squareData.rowNum === firstSquare.rowNum &&
    squareData.rowNum === prevSquare.rowNum;
  return { inLine: sameRow || sameCol, sameRow, sameCol };
};

export const squareEquals = (squareA: SquareData, squareB: SquareData) =>
  squareA.columnNum === squareB.columnNum && squareA.rowNum === squareB.rowNum;
