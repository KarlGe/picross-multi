import type {
  Puzzle,
  SquareState,
  MarginData,
  SquareData,
  BoardData,
  Solution,
} from "@customTypes/gameTypes";
import { makeEmptyPuzzle } from "@utils/puzzleUtils";
import { boardIterator, getLevelSize, getQuerySeed, setQuerySeed } from "@utils/utils";
import { getRandGenerator, makeSeed } from "./rand";
import { Solver } from "./solver/solver";

let randomGenerator: () => number;

const setupRandomGenerator = () => {
  if (typeof randomGenerator === "undefined") {
    randomGenerator = getRandGenerator(getQuerySeed());
  } else {
    const newSeed = makeSeed();
    randomGenerator = getRandGenerator(newSeed);
    setQuerySeed(newSeed);
  }
};

const randomRange = (min: number, max: number) => {
  if (typeof randomGenerator === "undefined") {
    setupRandomGenerator();
  }
  return Math.floor(randomGenerator() * (max - min + 1)) + min;
};

export const createInitialData = (rowNum: number, colNum: number, solution: Solution) => {
  const data: BoardData = [];
  for (let row = 0; row < rowNum; row++) {
    data.push([]);
    for (let column = 0; column < colNum; column++) {
      // const filled = puzzle.solution[row][column];
      const solutionValue = solution[row][column]; 
      let state = '' as SquareState;
      if (solutionValue === 1) {
        state = 'clicked';
      }
      if (solutionValue === 0) {
        state = 'excluded';
      }
      data[row].push({
        rowNum: row,
        columnNum: column,
        // state: filled ? "clicked" : "",
        state,
      } as SquareData);
    }
  }
  return data;
};

export const generatePuzzle = (rows: number, cols: number): Puzzle => {
  const puzzle = makeEmptyPuzzle(rows, cols);
  getLevelSize();
  setupRandomGenerator();
  const addCell = (row) => {
    if (!puzzle.solution[row]) {
      puzzle.solution.push([]);
    }
    puzzle.solution[row].push(randomRange(0, 1));
  };
  boardIterator(rows, cols, undefined, addCell);
  return puzzle;
};

export const checkSolution = (puzzle: Puzzle, board: SquareData[][]) => {
  const dimensions = puzzle.size;
  let matches = true;
  const onCell = (rowIndex, colIndex) => {
    const puzzleValue = puzzle.solution[rowIndex][colIndex];
    const boardValue = board[rowIndex][colIndex].state === "clicked" ? 1 : 0;
    if (puzzleValue !== boardValue) {
      matches = false;
    }
  };
  boardIterator(dimensions.rowSize, dimensions.columnSize, undefined, onCell);
  return matches;
};

export const createMargins = (puzzle: Puzzle): [MarginData, Solution] => {
  const dimensions = puzzle.size;

  const marginData: MarginData = { rows: [], columns: [] };

  const onCell = (rowIndex, columnIndex, currentSequence, sequenceArray) => {
    const cell = puzzle.solution[rowIndex][columnIndex];
    if (cell === 1) {
      currentSequence += 1;
    } else if (cell === 0 && currentSequence > 0) {
      sequenceArray.push(currentSequence);
      currentSequence = 0;
    }
    return currentSequence;
  };

  for (var rowIndex = 0; rowIndex < dimensions.rowSize; rowIndex += 1) {
    const dataRow = [];
    let currentSequence = 0;
    for (
      var columnIndex = 0;
      columnIndex < dimensions.columnSize;
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
    columnIndex < dimensions.columnSize;
    columnIndex += 1
  ) {
    const dataCol = [];
    let currentSequence = 0;
    for (var rowIndex = 0; rowIndex < dimensions.rowSize; rowIndex += 1) {
      currentSequence = onCell(rowIndex, columnIndex, currentSequence, dataCol);
    }
    if (currentSequence > 0) {
      dataCol.push(currentSequence);
    }
    marginData.columns.push(dataCol);
  }
  const solver = new Solver(marginData, puzzle);
  const solution = solver.solve();
  return [marginData, solution];
};
