import { useCallback, useEffect, useState } from 'react'
import { Cell } from './Cell'

export interface CellData {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  nearbyMines: number
}

type Board = CellData[][]

export default function Board({
  size,
  mines,
}: {
  size: number
  mines: number
}) {
  const [firstClick, setFirstClick] = useState(true)
  const [gameState, setGameState] = useState('playing')
  const [board, setBoard] = useState<Board>([])

  useEffect(() => {
    setBoard(createBoard())
    setFirstClick(true)
    setGameState('playing')
  }, [size])

  const createBoard = useCallback((): Board => {
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
  }, [size])

  function isInAvoidList(
    row: number,
    col: number,
    avoidCells: [number, number][],
  ): boolean {
    return avoidCells.some(
      ([avoidRow, avoidCol]) => avoidRow === row && avoidCol === col,
    )
  }

  const placeMines = useCallback(
    (board: Board, clickRow: number, clickCol: number): Board => {
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

        if (
          !minedBoard[row][col].isMine &&
          !isInAvoidList(row, col, avoidCells)
        ) {
          minedBoard[row][col].isMine = true
          minesPlaced++
        }
      }

      return minedBoard
    },
    [mines, size],
  )

  const countNearbyMines = useCallback(
    (board: Board): Board => {
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
    },
    [size],
  )

  const revealEmptyCells = useCallback(
    (board: Board, startRow: number, startCol: number): Board => {
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
    },
    [size],
  )

  const handleCellClick = useCallback(
    (row: number, col: number): void => {
      if (gameState !== 'playing') return

      setBoard((prevBoard) => {
        const cell = prevBoard[row][col]

        if (cell.isFlagged || cell.isRevealed) return prevBoard

        let newBoard: Board

        if (firstClick) {
          setFirstClick(false)
          const minedBoard = placeMines(prevBoard, row, col)
          const countedBoard = countNearbyMines(minedBoard)
          newBoard = revealEmptyCells(countedBoard, row, col)
        } else {
          newBoard = prevBoard.map((row) => row.map((cell) => ({ ...cell })))
          if (cell.isMine) {
            for (let row = 0; row < size; row++) {
              for (let col = 0; col < size; col++) {
                if (newBoard[row][col].isMine) {
                  newBoard[row][col].isRevealed = true
                }
              }
            }
            setGameState('lost')
            return newBoard
          }

          newBoard = revealEmptyCells(newBoard, row, col)
        }
        return newBoard
      })
    },
    [
      firstClick,
      gameState,
      size,
      placeMines,
      countNearbyMines,
      revealEmptyCells,
    ],
  )

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, row: number, col: number): void => {
      e.preventDefault()
      if (gameState !== 'playing') return
      setBoard((prevBoard) => {
        const newBoard: Board = prevBoard.map((row) =>
          row.map((cell) => ({ ...cell })),
        )
        const cell = newBoard[row][col]

        if (cell.isRevealed) return prevBoard

        cell.isFlagged ? (cell.isFlagged = false) : (cell.isFlagged = true)

        return newBoard
      })
    },
    [gameState],
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, minmax(40px, 1fr))`,
        gridTemplateRows: `repeat(${size}, minmax(40px, 1fr))`,
        height: '60vh',
        aspectRatio: '1/1',
      }}
    >
      {board.map((row, i) => {
        return row.map((cell, j) => {
          return (
            <Cell
              cell={cell}
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              onRightClick={(e) => handleRightClick(e, i, j)}
            />
          )
        })
      })}
    </div>
  )
}
