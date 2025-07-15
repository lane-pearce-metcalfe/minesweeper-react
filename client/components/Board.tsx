import { useCallback, useEffect, useState } from 'react'
import Cell from './Cell'

interface CellData {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  nearbyMines: boolean
}

type Board = CellData[][]

export default function Board({
  size,
  mines,
}: {
  size: number
  mines: number
}) {
  const [board, setBoard] = useState<Board>([])

  useEffect(() => {
    setBoard(placeMines())
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
          nearbyMines: false,
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
      minedBoard[row][col].isMine = true
      minesPlaced++
    }

    return minedBoard
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
          return <Cell key={`${i}-${j}`} />
        })
      })}
    </div>
  )
}
