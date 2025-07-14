import Cell from './Cell'

interface CellData {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  nearbyMines: boolean
}

type Board = CellData[][]

export default function Board({ size }: { size: number }) {
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
    return newBoard
  }

  const testArr = new Array(size * size).fill(0)
  return testArr.map((arr, i) => {
    return <Cell key={i} />
  })
}
