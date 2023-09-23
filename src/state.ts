import {CellState, Position} from "./game"
import Matrix from "./matrix"
import * as util from "./util"
import * as game from "./game"

export type StateOptions = {
  readonly board: Matrix
  readonly tetromino: Matrix
  readonly tetrominoPosition: Position
  readonly projectionPosition: Position
}

export class State {
  constructor(
    readonly board: Matrix,
    readonly tetromino: Matrix,
    readonly tetrominoPosition: Position,
    readonly projectionPosition: Position
  ) {
    //
  }

  update(changes: Partial<StateOptions>): State {
    if (changes.tetromino !== undefined)
      changes.tetromino.iter((_position, state) => util.assert(
        state !== CellState.Projection,
        "state tetromino should not contain projection cells"
      ))

    return new State(
      changes.board || this.board.clone(),
      changes.tetromino || this.tetromino.clone(),
      changes.tetrominoPosition || {...this.tetrominoPosition},
      changes.projectionPosition || {...this.projectionPosition}
    )
  }

  addTetrominoPositionDelta(delta: Position): State {
    return this.update({
      tetrominoPosition: {
        row: this.tetrominoPosition.row + delta.row,
        col: this.tetrominoPosition.col + delta.col
      }
    })
  }

  clone(): State {
    return this.update({})
  }

  choose(next: State | null): State {
    return next || this
  }
}
