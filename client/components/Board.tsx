import { useCallback, useEffect, useState } from 'react'
import { Cell } from './Cell'
import { Board as BoardType, GameState } from './src/types'
import { createEmptyBoard } from './src/boardUtils'
import {
  handleCellClickLogic,
  handleRightClickLogic,
} from './src/clickHandlers'

export default function Board({
  size,
  mines,
}: {
  size: number
  mines: number
}) {
  const [firstClick, setFirstClick] = useState(true)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [board, setBoard] = useState<BoardType>([])

  const createBoard = useCallback((): BoardType => {
    return createEmptyBoard(size)
  }, [size])

  useEffect(() => {
    setBoard(createBoard())
    setFirstClick(true)
    setGameState('playing')
  }, [size, createBoard])

  const handleCellClick = useCallback(
    (row: number, col: number): void => {
      setBoard((prevBoard) => {
        const result = handleCellClickLogic(
          prevBoard,
          row,
          col,
          firstClick,
          gameState,
          size,
          mines,
        )

        setFirstClick(result.newFirstClick)
        setGameState(result.newGameState)
        return result.newBoard
      })
    },
    [firstClick, gameState, size, mines],
  )

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, row: number, col: number): void => {
      e.preventDefault()

      setBoard((prevBoard) => {
        const result = handleRightClickLogic(
          prevBoard,
          row,
          col,
          gameState,
          size,
          mines,
        )

        setGameState(result.newGameState)
        return result.newBoard
      })
    },
    [gameState, size, mines],
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
