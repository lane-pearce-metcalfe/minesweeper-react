import { Board } from './types'

export function revealEmptyCells(
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
): Board {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  const cellsToReveal: [number, number][] = [[startRow, startCol]]

  while (cellsToReveal.length > 0) {
    const currentCell = cellsToReveal.pop()

    if (!currentCell) continue

    const [currentRow, currentCol] = currentCell

    if (
      currentRow < 0 ||
      currentRow >= size ||
      currentCol < 0 ||
      currentCol >= size
    ) {
      continue
    }

    const cell = newBoard[currentRow][currentCol]
    if (cell.isRevealed || cell.isFlagged || cell.isMine) {
      continue
    }

    cell.isRevealed = true

    if (cell.nearbyMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          cellsToReveal.push([currentRow + i, currentCol + j])
        }
      }
    }
  }
  return newBoard
}

export function checkWin(board: Board, size: number, mines: number): boolean {
  let allRevealed: boolean = true
  let count: number = 0
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board[row][col]
      if (!cell.isMine && !cell.isRevealed) {
        allRevealed = false
      }
      if (cell.isMine && cell.isFlagged) {
        count++
      }
    }
  }
  if (count === mines) {
    return true
  }
  return allRevealed
}

export function revealAllCells(board: Board, size: number): Board {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!newBoard[row][col].isMine) newBoard[row][col].isRevealed = true
    }
  }
  return newBoard
}

export function revealAllMines(board: Board, size: number): Board {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (newBoard[row][col].isMine && !newBoard[row][col].isFlagged) {
        newBoard[row][col].isRevealed = true
      }
    }
  }
  return newBoard
}
