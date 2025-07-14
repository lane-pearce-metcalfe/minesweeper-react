import { useEffect, useState } from 'react'
import Cell from './Cell'

interface CellData {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  nearbyMines: boolean
}

type Board = CellData[][]

export default function Board({ size }: { size: number }) {
  const [board, setBoard] = useState<Board>([])

  useEffect(() => {
    createBoard()
  }, [size])

  function createBoard() {
    const newBoard: Board = []
    for (let row = 0; row < size; row++) {
      newBoard[row] = []
      for (let col = 0; row < size; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          nearbyMines: false,
        }
      }
    }
    setBoard(newBoard)
  }

  return board.map((arr, i) => {
    return <Cell key={i} />
  })
}
