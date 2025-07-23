export interface CellData {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  nearbyMines: number
}

export type Board = CellData[][]

export type GameState = 'playing' | 'won' | 'lost'
