import { boardIterator } from "@utils/utils";
import type {
  Puzzle,
  MarginData,
  MarginNumbers,
  BoardData,
  Solution,
} from "@customTypes/gameTypes";
import type MarginNumber from "@components/Margins/MarginNumber.svelte";

type AxisTotal = { [n: number]: number };

const copyMarginData = (data: MarginData) => {
  return JSON.parse(JSON.stringify(data)) as MarginData;
};

export class Solver {
  marginData: MarginData;
  puzzle: Puzzle;
  solution: Solution = [];
  rowTotalRequired: AxisTotal = {};
  colTotalRequired: AxisTotal = {};
  completedRows: number[] = [];
  completedCols: number[] = [];
  rowSize: number;
  colSize: number;
  currentRun: number = 0;
  numRecursions: number = 0;

  constructor(marginData: MarginData, puzzle: Puzzle) {
    this.marginData = copyMarginData(marginData);
    this.puzzle = puzzle;
    this.rowSize = puzzle.size.rowSize;
    this.colSize = puzzle.size.columnSize;
    this.setAxisTotals(marginData.rows, this.rowSize, this.rowTotalRequired);
    this.setAxisTotals(marginData.columns, this.colSize, this.colTotalRequired);
    console.log("rowTotals: ", this.rowTotalRequired);
    console.log("colTotals: ", this.colTotalRequired);

    boardIterator(
      puzzle.size.rowSize,
      puzzle.size.columnSize,
      (rowIndex) => {
        this.solution.push([]);
      },
      (rowIndex, colIndex) => {
        this.solution[rowIndex].push(-1);
      }
    );
  }

  setRowComplete(rowIndex: number) {
    const row = this.solution[rowIndex];
    row.forEach((cell, index) => {
      this.setCell(rowIndex, index, cell === -1 ? 0 : cell);
    });
    this.marginData.rows[rowIndex] = [];
    this.completedRows.push(rowIndex);
  }

  setColComplete(colIndex: number) {
    this.solution.forEach((row, rowIndex) => {
      const cell = row[colIndex];
      this.setCell(rowIndex, colIndex, cell === -1 ? 0 : cell);
    });
    this.marginData.columns[colIndex] = [];
    this.completedCols.push(colIndex);
  }

  generateFilled(requirement, maxLength) {
    if (requirement.length === 0) {
      return new Array(maxLength).fill(0);
    }
    const filledAxis = [];
    requirement.forEach((requirementLength) => {
      for (let i = 0; i < requirementLength; i++) {
        filledAxis.push(1);
      }
      if (filledAxis.length !== maxLength) {
        filledAxis.push(0);
      }
    });
    return filledAxis;
  }

  setCell(rowIndex, columnIndex, cellValue) {
    const cell = this.solution[rowIndex][columnIndex];
    this.solution[rowIndex][columnIndex] = cellValue;
  }

  public solve() {
    console.log(this.puzzle);
    this.solveRecursion();
    this.solveRecursion();
    this.solveRecursion();
    this.solveRecursion();
    this.solveRecursion();
    this.solveRecursion();
    console.log("Solution: ", this.solution);
    console.log("Completed: ", this.completedRows, this.completedCols);

    return this.solution;
  }

  tryRowComplete(rowIndex, rowRequirement) {
    var localRequirement = [...rowRequirement];
    var localRow = [...this.solution[rowIndex]];
    for (let colIndex = 0; colIndex < this.colSize; colIndex++) {
      const cell = localRow[colIndex];
      let requirement = localRequirement[0];
      if (requirement === 0) {
        localRow[colIndex] = 0;
        localRequirement.shift();
      } else if (cell != 0) {
        localRow[colIndex] = 1;
        localRequirement[0] -= 1;
      }
    }
    if (localRequirement.length === 0) {
      this.applyRow(rowIndex, localRow);
    }
    return localRequirement.length === 0;
  }
  applyRow(rowIndex, rowData) {
    rowData.forEach((cellValue, colIndex) => {
      this.setCell(rowIndex, colIndex, cellValue);
    });
  }
  applyCol(colIndex, rowData) {
    rowData.forEach((cellValue, rowIndex) => {
      this.setCell(rowIndex, colIndex, cellValue);
    });
  }
  solveRow(rowRequirement: number[], rowIndex) {
    var localRow = this.solution[rowIndex];
    var localRequirement = [...rowRequirement];
    if (this.tryRowComplete(rowIndex, localRequirement)) {
      return;
    }
    this.currentRun = 0;
    for (let colIndex = 0; colIndex < this.colSize; colIndex++) {
      this.iterateAxis(rowIndex, colIndex, localRequirement);
    }
  }
  getColumn(colIndex: number) {
    const column = [];
    for (let rowIndex = 0; rowIndex < this.rowSize; rowIndex++) {
      column.push(this.solution[rowIndex][colIndex]);
    }
    return column;
  }
  tryColumnComplete(colIndex, colData, colRequirement) {
    var localRequirement = [...colRequirement];
    var localRow = [...colData];
    for (let rowIndex = 0; rowIndex < this.rowSize; rowIndex++) {
      const cell = localRow[colIndex];
      let requirement = localRequirement[0];
      if (requirement === 0) {
        localRow[colIndex] = 0;
        localRequirement.shift();
      } else if (cell != 0) {
        localRow[colIndex] = 1;
        localRequirement[0] -= 1;
      }
    }
    if (localRequirement.length === 0) {
      this.applyCol(colIndex, localRow);
    }
    return localRequirement.length === 0;
  }
  solveColumn(colRequirement: number[], colIndex: number) {
    var localRequirement = [...colRequirement];
    const localCol = this.getColumn(colIndex);
    if (this.tryColumnComplete(colIndex, localCol, colRequirement)) {
      return;
    }
    this.currentRun = 0;
    for (let rowIndex = 0; rowIndex < this.rowSize; rowIndex++) {
      this.iterateAxis(rowIndex, colIndex, localRequirement);
    }
  }
  iterateAxis(rowIndex, colIndex, localRequirement) {
    const cell = this.solution[rowIndex][colIndex];
    if (this.currentRun === localRequirement[0]) {
      localRequirement.shift();
      this.setCell(rowIndex, colIndex, 0);
      this.currentRun = 0;
    } else if (cell === 1) {
      this.currentRun += 1;
    } else if (localRequirement[0] > 0 && cell === -1 && this.currentRun > 0) {
      this.setCell(rowIndex, colIndex, 1);
      this.currentRun += 1;
    }
  }
  solveRecursion() {
    this.numRecursions += 1;
    const { rowSize, columnSize } = this.puzzle.size;
    const marginData = copyMarginData(this.marginData);
    this.axisIterator(
      marginData.rows,
      (rowRequirement: number[], rowIndex: number) => {
        if (this.isRowComplete(rowIndex)) {
          return;
        }
        this.solveRow(rowRequirement, rowIndex);
      }
    );
    this.axisIterator(marginData.columns, (columnRequirement, columnIndex) => {
      if (this.isColComplete(columnIndex)) {
        return;
      }
      this.solveColumn(columnRequirement, columnIndex);
    });
  }

  isRowComplete(rowIndex: number) {
    if (this.completedRows.includes(rowIndex)) {
      return true;
    }
    const isComplete =
      this.getRowSum(rowIndex) === this.rowTotalRequired[rowIndex];
    if (isComplete) {
      this.setRowComplete(rowIndex);
    }
    return isComplete;
  }

  isColComplete(colIndex: number) {
    if (this.completedCols.includes(colIndex)) {
      return true;
    }
    const isComplete =
      this.getColSum(colIndex) === this.colTotalRequired[colIndex];
    if (isComplete) {
      this.setColComplete(colIndex);
    }
    return isComplete;
  }

  axisIterator(array: any[], action: (element: any, index: number) => void) {
    for (let index = 0; index < array.length; index++) {
      action(array[index], index);
    }
  }

  setAxisTotals(requirementAxis, length: number, totalsObject: AxisTotal) {
    for (let index = 0; index < length; index++) {
      totalsObject[index] = this.getRequirementTotal(
        requirementAxis[index],
        false
      );
    }
  }
  getRowSum = (rowIndex) => {
    return this.solution[rowIndex].reduce((partialSum, a) => {
      return partialSum + (a === 1 ? 1 : 0);
    }, 0);
  };
  getColSum = (colIndex) => {
    let sum = 0;
    for (let rowIndex = 0; rowIndex < this.rowSize; rowIndex++) {
      const cell = this.solution[rowIndex][colIndex];
      sum += cell === 1 ? 1 : 0;
    }
    return sum;
  };

  /**
   * Used to find the total number of cells that are required to be checked from the hints given
   */
  getRequirementTotal(requirementArray: number[], includeGaps = false) {
    if (requirementArray.length === 0) {
      return 0;
    }
    const totalFilled = requirementArray.reduce(
      (partialSum, a) => partialSum + a,
      0
    );

    return includeGaps
      ? totalFilled + requirementArray.length - 1
      : totalFilled;
  }
}
