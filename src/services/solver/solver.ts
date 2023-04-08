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
type SolutionData = {
  rowIndex: number;
  colIndex: number;
  value: number;
};

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

  rows: SolutionData[][] = [];
  cols: SolutionData[][] = [];

  constructor(marginData: MarginData, puzzle: Puzzle) {
    this.marginData = copyMarginData(marginData);
    this.puzzle = puzzle;
    this.rowSize = puzzle.size.rowSize;
    this.colSize = puzzle.size.columnSize;
    this.setAxisTotals(marginData.rows, this.rowSize, this.rowTotalRequired);
    this.setAxisTotals(marginData.columns, this.colSize, this.colTotalRequired);
    console.log("rowTotals: ", this.rowTotalRequired);
    console.log("colTotals: ", this.colTotalRequired);

    for (let rowIndex = 0; rowIndex < puzzle.size.rowSize; rowIndex++) {
      const row = [];
      this.solution.push([]);
      for (let colIndex = 0; colIndex < puzzle.size.columnSize; colIndex++) {
        if (rowIndex === 0) {
          this.cols.push([]);
        }
        this.solution[rowIndex].push(-1);
        row.push({
          rowIndex,
          colIndex,
          value: -1,
        });
        this.cols[colIndex].push({
          rowIndex,
          colIndex,
          value: -1,
        });
      }
      this.rows.push(row);
    }
  }

  public solve() {
    console.log(this.puzzle);
    for (let iterationIndex = 0; iterationIndex < 3; iterationIndex++) {
      this.solveRecursion();
    }
    console.log("Solution: ", this.solution);
    console.log("Completed: ", this.completedRows, this.completedCols);
    console.log("FinalRows: ", this.rows);
    console.log("FinalCols: ", this.cols);
    return this.solution;
  }

  setRowComplete(
    rowIndex: number,
    filledRow: number[] = undefined,
    fillStartIndex = 0
  ) {
    if (filledRow) {
      filledRow.forEach((cellValue, cellIndex) => {
        this.setCell(rowIndex, fillStartIndex + cellIndex, cellValue);
      });
    } else {
      const row = this.solution[rowIndex];
      row.forEach((cell, index) => {
        this.setCell(rowIndex, index, cell === -1 ? 0 : cell);
      });
    }
    this.marginData.rows[rowIndex] = [];
    this.completedRows.push(rowIndex);
  }

  setColComplete(
    colIndex: number,
    filledCol: number[] = undefined,
    fillStartIndex = 0
  ) {
    if (filledCol) {
      filledCol.forEach((cellValue, cellIndex) => {
        this.setCell(fillStartIndex + cellIndex, colIndex, cellValue);
      });
    } else {
      this.solution.forEach((row, rowIndex) => {
        const cell = row[colIndex];
        this.setCell(rowIndex, colIndex, cell === -1 ? 0 : cell);
      });
    }
    this.marginData.columns[colIndex] = [];
    this.completedCols.push(colIndex);
  }

  generateFilled(requirement, maxLength): number[] {
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

  /**
   * Recursively removes the first and last element of a row/column if it's a 0/X
   * Makes it easier to compare size of axis to requirements
   */
  cleanRows = (rowIndex: number) => {
    const row = this.rows[rowIndex];
    if (row[0]?.value === 0) {
      row.shift();
      this.rows[rowIndex] = row;
      this.cleanRows(rowIndex);
    }
    if (row[row.length - 1]?.value === 0) {
      row.pop();
      this.rows[rowIndex] = row;
      this.cleanRows(rowIndex);
    }
  };
  cleanCols = (colIndex: number) => {
    const col = this.cols[colIndex];
    if (col[0]?.value === 0) {
      col.shift();
      this.cols[colIndex] = col;
      this.cleanCols(colIndex);
    }
    if (col[col.length - 1]?.value === 0) {
      col.pop();
      this.cols[colIndex] = col;
      this.cleanCols(colIndex);
    }
  };

  setCell(rowIndex, colIndex, cellValue: number) {
    if (
      rowIndex < 0 ||
      colIndex < 0 ||
      rowIndex > this.rowSize - 1 ||
      colIndex > this.colSize - 1
    ) {
      return;
    }
    this.solution[rowIndex][colIndex] = cellValue;
    const rowCell = this.rows[rowIndex][colIndex];
    if (rowCell) {
      rowCell.value = cellValue;
    }
    const colCell = this.cols[colIndex][rowIndex];
    if (colCell) {
      colCell.value = cellValue;
    }
    this.cleanCols(colIndex);
    this.cleanRows(rowIndex);
  }

  applyRow = (rowIndex, rowData: SolutionData[]) => {
    const startIndex = rowData[0].colIndex;
    for (let colIndex = startIndex; colIndex < rowData.length; colIndex++) {
      this.setCell(rowIndex, colIndex, rowData[colIndex].value);
    }
  };
  applyCol = (colIndex, colData: SolutionData[]) => {
    const startIndex = colData[0].rowIndex;
    for (let rowIndex = startIndex; rowIndex < colData.length; rowIndex++) {
      this.setCell(colIndex, rowIndex, colData[rowIndex].value);
    }
  };
  solveRow(rowRequirement: number[], rowIndex) {
    var localRequirement = [...rowRequirement];
    const newRow = this.solveAxis(
      this.rows[rowIndex],
      localRequirement,
      (runStart, runLength) => this.applyRowRun(rowIndex, runStart, runLength)
    );
    if (newRow) {
      this.applyRow(rowIndex, newRow);
    }
  }
  solveColumn(colRequirement: number[], colIndex: number) {
    var localRequirement = [...colRequirement];
    this.currentRun = 0;
    const newColumn = this.solveAxis(
      this.cols[colIndex],
      localRequirement,
      (runStart, runLength) => this.applyColRun(colIndex, runStart, runLength)
    );
    if (newColumn) {
      this.applyCol(colIndex, newColumn);
    }
  }
  applyRowRun = (rowIndex: number, runStart: number, runLength: number) => {
    this.setCell(rowIndex, runStart, 0);
    for (let index = 0; index < runLength; index++) {
      this.setCell(rowIndex, index + runStart, 1);
    }
    this.setCell(rowIndex, runStart + runLength, 0);
  };
  applyColRun = (colIndex: number, runStart: number, runLength: number) => {
    this.setCell(runStart - 1, colIndex, 0);
    for (let index = 0; index < runLength; index++) {
      this.setCell(index + runStart, colIndex, 1);
    }
    this.setCell(runStart + runLength, colIndex, 0);
  };
  copyAxis = (axis: SolutionData[]) =>
    axis.map((cellValue) => ({ ...cellValue }));
  solveAxis(
    axis: SolutionData[],
    requirementArray,
    onRunComplete: (runStart: number, runLength: number) => void
  ) {
    const localAxis = this.copyAxis(axis);
    const localRequirement = [...requirementArray];
    const length = localAxis.length;
    let currentRun = 0;
    let currentRunStart = undefined;
    for (let axisIndex = 0; axisIndex < length; axisIndex++) {
      const cell = localAxis[axisIndex];
      const prevCell = axisIndex > 0 ? localAxis[axisIndex - 1] : null;
      if (localRequirement.length === 0 && cell.value === -1) {
        localAxis[axisIndex].value = 0;
      } else if (currentRun === localRequirement[0]) {
        localRequirement.shift();
        localAxis[axisIndex].value = 0;
        currentRunStart = axisIndex - currentRun;
        onRunComplete(currentRunStart, currentRun);
        currentRun = 0;
        currentRunStart = 0;
      } else if (
        cell.value === 1 &&
        (prevCell == null || prevCell.value === 0)
      ) {
        currentRunStart = axisIndex;
        currentRun += 1;
      } else if (
        localRequirement[0] > 0 &&
        cell.value !== 0 &&
        currentRun > 0
      ) {
        localAxis[axisIndex].value = 1;
        currentRun += 1;
      } else if (this.isLast(localAxis, axisIndex) && cell.value === 1) {
        const lastRequirement = this.getLast(localRequirement);
        onRunComplete(axisIndex - lastRequirement + 1, lastRequirement);
      } else if (cell.value === 1) {
        currentRun += 1;
      } else if (cell.value != 1) {
        currentRun = 0;
      }
    }
    return localRequirement.length === 0 ? localAxis : undefined;
  }
  isLast = (list: any[], index) => index === list.length - 1;
  getLast = (list: any[]) => list[list.length - 1];
  solveRecursion() {
    this.numRecursions += 1;
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

  axisIterator(array: any[], action: (element: any, index: number) => void) {
    for (let index = 0; index < array.length; index++) {
      action(array[index], index);
    }
  }

  isRowComplete(rowIndex: number) {
    if (this.completedRows.includes(rowIndex)) {
      return true;
    }
    const row = this.rows[rowIndex];
    const requirement = this.marginData.rows[rowIndex];
    if (this.getRequirementTotal(requirement, true) === row.length) {
      this.setRowComplete(
        rowIndex,
        this.generateFilled(requirement, row.length),
        row[0].colIndex
      );
      return true;
    }
    const rowSum = this.getRowSum(rowIndex);
    const isComplete = rowSum === this.rowTotalRequired[rowIndex];
    if (isComplete) {
      this.setRowComplete(rowIndex);
    }
    return isComplete;
  }

  isColComplete(colIndex: number) {
    if (this.completedCols.includes(colIndex)) {
      return true;
    }
    const col = this.cols[colIndex];
    const requirement = this.marginData.columns[colIndex];
    if (this.getRequirementTotal(requirement, true) === col.length) {
      this.setColComplete(
        colIndex,
        this.generateFilled(requirement, col.length),
        col[0].rowIndex
      );
      return true;
    }
    const isComplete =
      this.getColSum(colIndex) === this.colTotalRequired[colIndex];
    if (isComplete) {
      this.setColComplete(colIndex);
    }
    return isComplete;
  }

  setAxisTotals(requirementAxis, length: number, totalsObject: AxisTotal) {
    for (let index = 0; index < length; index++) {
      totalsObject[index] = this.getRequirementTotal(
        requirementAxis[index],
        false
      );
    }
  }
  getAxisSum = (solutionAxis: SolutionData[]) => {
    return solutionAxis.reduce(
      (sum, cell) => (cell.value === 1 ? sum + 1 : sum),
      0
    );
  };
  getRowSum = (rowIndex) => {
    return this.getAxisSum(this.rows[rowIndex]);
  };
  getColSum = (colIndex) => {
    return this.getAxisSum(this.cols[colIndex]);
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
