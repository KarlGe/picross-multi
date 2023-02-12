import type { Puzzle, MarginData } from "@customTypes/gameTypes";
const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generatePuzzle = (width: number, height: number): Puzzle => {
  const puzzle: Puzzle = [];
  for (var rowIndex = 0; rowIndex < height; rowIndex += 1) {
    const row = [];
    for (var columnIndex = 0; columnIndex < width; columnIndex += 1) {
      row.push(randomRange(0, 1));
    }
    puzzle.push(row);
  }
  return puzzle;
};

export const createMargins = (puzzle: Puzzle) => {
  console.log(puzzle);
  const numRows = puzzle.length;
  const numCols = puzzle[0].length;

  const marginData: MarginData = { rows: [], columns: [] };
  for (var rowIndex = 0; rowIndex < numRows; rowIndex += 1) {
    const dataRow = [];
    let currentSequence = 0;
    for (var columnIndex = 0; columnIndex < numCols; columnIndex += 1) {
      const cell = puzzle[rowIndex][columnIndex];
      if (cell === 1) {
        currentSequence += 1;
      } else if (cell === 0 && currentSequence > 0) {
        dataRow.push(currentSequence);
        currentSequence = 0;
      }
    }
    if (currentSequence > 0) {
      dataRow.push(currentSequence);
    }
    marginData.rows.push(dataRow);
  }
  for (var columnIndex = 0; columnIndex < numCols; columnIndex += 1) {
    const dataCol = [];
    let currentSequence = 0;
    for (var rowIndex = 0; rowIndex < numRows; rowIndex += 1) {
      const cell = puzzle[rowIndex][columnIndex];
      if (cell === 1) {
        currentSequence += 1;
      } else if (cell === 0 && currentSequence > 0) {
        dataCol.push(currentSequence);
        currentSequence = 0;
      }
    }
    if (currentSequence > 0) {
      dataCol.push(currentSequence);
    }
    marginData.columns.push(dataCol);
  }
  return marginData;
};
