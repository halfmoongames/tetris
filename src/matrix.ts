import {CellState, Position} from "./game"
import * as util from "./util"

type ArrayMatrix = CellState[][]

export default class Matrix {
  readonly rows: number
  readonly cols: number
  private readonly inner: ArrayMatrix

  constructor(rows: number, cols: number, fillValue: CellState = CellState.Empty) {
    util.assert(rows > 0, "matrix should have at least one row")
    util.assert(cols > 0, "matrix should have at least one column")

    this.rows = rows
    this.cols = cols
    this.inner = Array.from({length: rows}, () => Array(cols).fill(fillValue))

    const rowsCreated = this.inner.length
    const colsCreated = this.inner[0].length

    util.assert(rowsCreated === rows, "created rows should match requested rows")
    util.assert(colsCreated === cols, "created cols should match requested cols")
  }

  iter(callback: (position: Position, state: CellState) => void): void {
    for (let row = 0; row < this.rows; row++)
      for (let col = 0; col < this.cols; col++)
        callback({row, col}, this.inner[row][col])
  }

  transform(callback: (position: Position, state: CellState) => CellState): Matrix {
    const result = this.clone()

    result.iter((position, state) => {
      result.inner[position.row][position.col] = callback(position, state)
    })

    return result
  }

  set(position: Position, state: CellState): Matrix {
    util.assert(position.row >= 0 && position.row < this.rows, "row should be within bounds")
    util.assert(position.col >= 0 && position.col < this.cols, "col should be within bounds")

    const result = this.clone()

    result.inner[position.row][position.col] = state

    return result
  }

  unwrap(): ArrayMatrix {
    return this.inner
  }

  clearMask(mask: Matrix, offset: Position): Matrix {
    util.assert(mask.rows + offset.row <= this.rows, "mask matrix should have fewer rows")
    util.assert(mask.cols + offset.col <= this.cols, "mask matrix should have fewer cols")

    const result = this.clone()

    mask.iter(({row, col}, state) => {
      if (state !== CellState.Empty)
        result.inner[row + offset.row][col + offset.col] = CellState.Empty
    })

    return result
  }

  insert(mask: Matrix, offset: Position): Matrix {
    util.assert(mask.rows + offset.row <= this.rows, "insertion matrix should have fewer rows")
    util.assert(mask.cols + offset.col <= this.cols, "insertion matrix should have fewer cols")

    const result = this.clone()

    mask.iter(({row, col}, state) => {
      if (state !== CellState.Empty)
        result.inner[row + offset.row][col + offset.col] = state
    })

    return result
  }

  clearRowAndCollapse(row: number): Matrix {
    util.assert(row >= 0 && row < this.rows, "row should be within bounds")

    const result = this.clone()

    for (let collapseRow = row; collapseRow > 0; collapseRow--)
      result.inner[collapseRow] = result.inner[collapseRow - 1]

    // Clear the top row, which is now a duplicate of the second row.
    result.inner[0] = Array(this.cols).fill(CellState.Empty)

    return result
  }

  clone(): Matrix {
    const result = new Matrix(this.rows, this.cols)

    this.iter(({row, col}, state) => {
      result.inner[row][col] = state
    })

    return result
  }

  rotateClockwise(): Matrix {
    const result = new Matrix(this.cols, this.rows)

    this.iter(({row, col}, state) => {
      const newRow = col
      const newCol = this.rows - row - 1

      result.inner[newRow][newCol] = state
    })

    return result
  }

  rotateCounterClockwise(): Matrix {
    const result = new Matrix(this.cols, this.rows)

    this.iter(({row, col}, state) => {
      const newRow = this.cols - col - 1
      const newCol = row

      result.inner[newRow][newCol] = state
    })

    return result
  }
}
