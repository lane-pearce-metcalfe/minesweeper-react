import { useCallback, useEffect, useState } from 'react'
import Cell from './Cell'

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
  const [gameState, setGameState] = useState('playing')
  const [board, setBoard] = useState<Board>([])

  useEffect(() => {
    setBoard(countNearbyBombs())
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
  }, [])

  const placeMines = useCallback((): Board => {
    const minedBoard = createBoard()
    let minesPlaced = 0

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)

      if (!minedBoard[row][col].isMine) {
        minedBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    return minedBoard
  }, [])

  const countNearbyBombs = useCallback((): Board => {
    const countedBoard = placeMines()
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
  }, [])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        height: '60vh',
        aspectRatio: '1/1',
      }}
    >
      {board.map((row, i) => {
        return row.map((cell, j) => {
          return <Cell cell={cell} key={`${i}-${j}`} />
        })
      })}
    </div>
  )
}
