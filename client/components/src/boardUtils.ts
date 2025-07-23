import { Board } from './types'

export function createEmptyBoard(size: number): Board {
  const newBoard: Board = []
  for (let row = 0; row < size; row++) {
    newBoard[row] = []
    for (let col = 0; col < size; col++) {
      newBoard[row][col] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        nearbyMines: 0,
      }
    }
  }
  return newBoard
}

function isInAvoidList(
  row: number,
  col: number,
  avoidCells: [number, number][],
): boolean {
  return avoidCells.some(
    ([avoidRow, avoidCol]) => avoidRow === row && avoidCol === col,
  )
}

export function placeMines(
  board: Board,
  clickRow: number,
  clickCol: number,
  size: number,
  mines: number,
): Board {
  const minedBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  let minesPlaced = 0

  const avoidCells: [number, number][] = []

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = clickRow + i
      const newCol = clickCol + j
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        avoidCells.push([newRow, newCol])
      }
    }
  }

  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * size)
    const col = Math.floor(Math.random() * size)

    if (!minedBoard[row][col].isMine && !isInAvoidList(row, col, avoidCells)) {
      minedBoard[row][col].isMine = true
      minesPlaced++
    }
  }

  return minedBoard
}

export function countNearbyMines(board: Board, size: number): Board {
  const countedBoard = board.map((row) => row.map((cell) => ({ ...cell })))

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!countedBoard[row][col].isMine) {
        let count = 0
        for (let nearbyRow = -1; nearbyRow <= 1; nearbyRow++) {
          for (let nearbyCol = -1; nearbyCol <= 1; nearbyCol++) {
            const checkRow = row + nearbyRow
            const checkCol = col + nearbyCol
            if (
              checkRow >= 0 &&
              checkRow < size &&
              checkCol >= 0 &&
              checkCol < size
            ) {
              if (countedBoard[checkRow][checkCol].isMine) count++
            }
          }
        }
        countedBoard[row][col].nearbyMines = count
      }
    }
  }
  return countedBoard
}
