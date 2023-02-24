import type {
  Puzzle,
  MarginData,
  SquareData,
  BoardData,
} from "@customTypes/gameTypes";
const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function boardIterator(
  width: number,
  height: number,
  onRow?: (row: number) => void,
  onColumn?: (row: number, column: number) => void
) {
  for (var rowIndex = 0; rowIndex < height; rowIndex += 1) {
    for (var columnIndex = 0; columnIndex < width; columnIndex += 1) {
      onColumn && onColumn(rowIndex, columnIndex);
    }
    onRow && onRow(rowIndex);
  }
}

export const createInitialData = (rowNum: number, colNum: number) => {
  const data: BoardData = [];
  for (let row = 0; row < rowNum; row++) {
    data.push([]);
    for (let column = 0; column < colNum; column++) {
      // const filled = puzzle[row][column];
      data[row].push({
        rowNum: row,
        columnNum: column,
        // state: filled ? "clicked" : "",
        state: "",
      } as SquareData);
    }
  }
  return data;
};

export const generatePuzzle = (width: number, height: number): Puzzle => {
  const puzzle: Puzzle = [];
  const addCell = (row) => {
    if (!puzzle[row]) {
      puzzle.push([]);
    }
    puzzle[row].push(randomRange(0, 1));
  };
  boardIterator(width, height, undefined, addCell);
  return puzzle;
};

const getPuzzleDimensions = (puzzle: Puzzle) => {
  return { rows: puzzle.length, columns: puzzle[0].length };
};

export const checkSolution = (puzzle: Puzzle, board: SquareData[][]) => {
  const dimensions = getPuzzleDimensions(puzzle);
  let matches = true;
  const onCell = (rowIndex, colIndex) => {
    const puzzleValue = puzzle[rowIndex][colIndex];
    const boardValue = board[rowIndex][colIndex].state === "clicked" ? 1 : 0;
    if (puzzleValue !== boardValue) {
      matches = false;
    }
  };
  boardIterator(dimensions.rows, dimensions.columns, undefined, onCell);
  return matches;
};

export const createMargins = (puzzle: Puzzle) => {
  const dimensions = getPuzzleDimensions(puzzle);

  const marginData: MarginData = { rows: [], columns: [] };

  const onCell = (rowIndex, columnIndex, currentSequence, sequenceArray) => {
    const cell = puzzle[rowIndex][columnIndex];
    if (cell === 1) {
      currentSequence += 1;
    } else if (cell === 0 && currentSequence > 0) {
      sequenceArray.push(currentSequence);
      currentSequence = 0;
    }
    return currentSequence;
  };

  for (var rowIndex = 0; rowIndex < dimensions.rows; rowIndex += 1) {
    const dataRow = [];
    let currentSequence = 0;
    for (
      var columnIndex = 0;
      columnIndex < dimensions.columns;
      columnIndex += 1
    ) {
      currentSequence = onCell(rowIndex, columnIndex, currentSequence, dataRow);
    }
    if (currentSequence > 0) {
      dataRow.push(currentSequence);
    }
    marginData.rows.push(dataRow);
  }
  for (
    var columnIndex = 0;
    columnIndex < dimensions.columns;
    columnIndex += 1
  ) {
    const dataCol = [];
    let currentSequence = 0;
    for (var rowIndex = 0; rowIndex < dimensions.rows; rowIndex += 1) {
      currentSequence = onCell(rowIndex, columnIndex, currentSequence, dataCol);
    }
    if (currentSequence > 0) {
      dataCol.push(currentSequence);
    }
    marginData.columns.push(dataCol);
  }
  return marginData;
};
