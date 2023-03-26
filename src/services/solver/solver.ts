import { boardIterator } from "@utils/utils";
import type {
  Puzzle,
  MarginData,
  MarginNumbers,
  BoardData,
  Solution,
} from "@customTypes/gameTypes";

type AxisTotal = { [n: number]: number };

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

  constructor(marginData: MarginData, puzzle: Puzzle) {
    this.marginData = marginData;
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

  excludeRemainingRow(rowIndex: number) {
    const row = this.solution[rowIndex];
    row.forEach((cell, index) => {
      this.setCell(rowIndex, index, cell === -1 ? 0 : cell);
    });
  }

  excludeRemainingColumn(colIndex: number) {
    this.solution.forEach((row, rowIndex) => {
      const cell = row[colIndex];
      this.setCell(rowIndex, colIndex, cell === -1 ? 0 : cell);
    });
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
    this.solution[rowIndex][columnIndex] = cellValue;
  }

  fillRow(requirements: number[], rowIndex: number) {
    const filled = this.generateFilled(requirements, this.rowSize);
    filled.forEach((cellValue, columnIndex) => {
      this.setCell(rowIndex, columnIndex, cellValue);
    });
  }

  fillColumn(requirements: number[], columnIndex: number) {
    const filled = this.generateFilled(requirements, this.colSize);
    filled.forEach((cellValue, rowIndex) => {
      this.setCell(rowIndex, columnIndex, cellValue);
    });
  }

  public solve() {
    const { rowSize, columnSize } = this.puzzle.size;
    console.log(this.puzzle);

    this.axisIterator(this.marginData.rows, (rowRequirement, rowIndex) => {
      const minimumTotal = this.getRequirementTotal(rowRequirement, true);
      if (minimumTotal === rowSize || minimumTotal === 0) {
        this.fillRow(rowRequirement, rowIndex);
      }
    });
    this.axisIterator(
      this.marginData.columns,
      (columnRequirement, columnIndex) => {
        const minimumTotal = this.getRequirementTotal(columnRequirement, true);
        if (minimumTotal === columnSize || minimumTotal === 0) {
          this.fillColumn(columnRequirement, columnIndex);
        }
      }
    );
    for (let rowIndex = 0; rowIndex < this.rowSize; rowIndex++) {
      if (this.isRowComplete(rowIndex)) {
        continue;
      }
    }
    for (let colIndex = 0; colIndex < this.rowSize; colIndex++) {
      if (this.isColComplete(colIndex)) {
        continue;
      }
    }
    console.log("Solution: ", this.solution);
    console.log("Completed: ", this.completedRows, this.completedCols);

    return this.solution;
  }

  isRowComplete(rowIndex: number) {
    if (this.completedRows.includes(rowIndex)) {
      return true;
    }
    const isComplete =
      this.getRowSum(rowIndex) === this.rowTotalRequired[rowIndex];
    if (isComplete) {
      this.completedRows.push(rowIndex);
      this.excludeRemainingRow(rowIndex);
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
      this.completedCols.push(colIndex);
      this.excludeRemainingColumn(colIndex);
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
