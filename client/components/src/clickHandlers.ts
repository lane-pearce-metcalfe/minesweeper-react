import { Board, GameState } from './types'
import { placeMines, countNearbyMines } from './boardUtils.ts'
import {
  revealEmptyCells,
  checkWin,
  revealAllCells,
  revealAllMines,
} from './gameUtils.ts'

export function handleCellClickLogic(
  board: Board,
  row: number,
  col: number,
  firstClick: boolean,
  gameState: GameState,
  size: number,
  mines: number,
): {
  newBoard: Board
  newGameState: GameState
  newFirstClick: boolean
} {
  if (gameState !== 'playing') {
    return {
      newBoard: board,
      newGameState: gameState,
      newFirstClick: firstClick,
    }
  }

  const cell = board[row][col]

  if (cell.isFlagged || cell.isRevealed) {
    return {
      newBoard: board,
      newGameState: gameState,
      newFirstClick: firstClick,
    }
  }

  let newBoard: Board
  let newGameState: GameState = gameState
  let newFirstClick = firstClick

  if (firstClick) {
    newFirstClick = false
    const minedBoard = placeMines(board, row, col, size, mines)
    const countedBoard = countNearbyMines(minedBoard, size)
    newBoard = revealEmptyCells(countedBoard, row, col, size)
  } else {
    newBoard = board.map((row) => row.map((cell) => ({ ...cell })))

    if (cell.isMine) {
      newBoard = revealAllMines(newBoard, size)
      newGameState = 'lost'
      return { newBoard, newGameState, newFirstClick }
    }

    newBoard = revealEmptyCells(newBoard, row, col, size)

    if (checkWin(newBoard, size, mines)) {
      newGameState = 'won'
      newBoard = revealAllCells(newBoard, size)
    }
  }

  return { newBoard, newGameState, newFirstClick }
}

export function handleRightClickLogic(
  board: Board,
  row: number,
  col: number,
  gameState: GameState,
  size: number,
  mines: number,
): {
  newBoard: Board
  newGameState: GameState
} {
  if (gameState !== 'playing') {
    return { newBoard: board, newGameState: gameState }
  }

  const newBoard: Board = board.map((row) => row.map((cell) => ({ ...cell })))
  const cell = newBoard[row][col]

  if (cell.isRevealed) {
    return { newBoard: board, newGameState: gameState }
  }

  cell.isFlagged = !cell.isFlagged

  let newGameState: GameState = gameState
  if (checkWin(newBoard, size, mines)) {
    newGameState = 'won'
    return { newBoard: revealAllCells(newBoard, size), newGameState }
  }

  return { newBoard, newGameState }
}

export function handleBothClickLogic(
  board: Board,
  row: number,
  col: number,
  gameState: GameState,
  size: number,
  mines: number,
): { newBoard: Board; newGameState: GameState } {
  if (gameState !== 'playing') {
    return { newBoard: board, newGameState: gameState }
  }

  const newBoard: Board = board.map((row) => row.map((cell) => ({ ...cell })))

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i > 0 && i <= size && j > 0 && j <= size) {
        newBoard[row + i][col + j].isRevealed = true
      }
    }
  }

  if (checkWin(newBoard, size, mines)) {
    return { newBoard: newBoard, newGameState: 'won' }
  }

  return { newBoard: newBoard, newGameState: gameState }
}
