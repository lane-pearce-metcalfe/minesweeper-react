import { CellData } from './src/types'
import '../styles/cell.css'

export function Cell({
  cell,
  onClick,
  onRightClick,
  onBothClick,
}: {
  cell: CellData
  onClick: () => void
  onRightClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onBothClick: (e: React.MouseEvent<HTMLDivElement>) => void
}) {
  const colors = [
    'blue',
    'green',
    'orange',
    'darkblue',
    'red',
    'navy',
    'purple',
    'black',
  ]

  let leftPressed = false
  let rightPressed = false

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()

    if (e.button === 0) {
      leftPressed = true
    } else if (e.button === 2) {
      rightPressed = true
    }

    if (e.buttons === 3) {
      onBothClick(e)
      return
    }
  }

  function handleMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 0) {
      leftPressed = false
      if (!rightPressed) {
        onClick()
      }
    } else if (e.button === 2) {
      rightPressed = false
    }
  }

  function handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    if (!leftPressed) {
      onRightClick(e)
    }
  }

  function getCellClasses() {
    const classes = ['cell']

    if (cell.isRevealed) {
      classes.push('revealed')

      if (cell.isMine) {
        classes.push('mine')
      } else if (cell.nearbyMines === 0) {
        classes.push('empty')
      } else {
        classes.push('number')
      }
    } else {
      classes.push('unrevealed')
    }

    if (cell.isFlagged) {
      classes.push('flagged')
    }

    return classes.join(' ')
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={{
        color: cell.nearbyMines > 0 ? colors[cell.nearbyMines - 1] : undefined,
      }}
      className={getCellClasses()}
    >
      {cell.isFlagged ? (
        <p>🚩</p>
      ) : !cell.isRevealed || cell.nearbyMines === 0 ? null : !cell.isMine ? (
        <p style={{ margin: '0' }}>{cell.nearbyMines}</p>
      ) : (
        <p>💣</p>
      )}
    </div>
  )
}
