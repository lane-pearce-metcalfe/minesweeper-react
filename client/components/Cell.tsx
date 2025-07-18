import { CellData } from './Board'

export function Cell({
  cell,
  onClick,
  onRightClick,
}: {
  cell: CellData
  onClick: () => void
  onRightClick: (e: React.MouseEvent<HTMLDivElement>) => void
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

  function getBackgroundColor() {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return '#ff6b6b'
      }
      return cell.nearbyMines === 0 ? 'white' : '#e9ecef'
    }
    return cell.isFlagged ? '#ffd43b' : '#c0c0c0'
  }

  const backgroundColor = getBackgroundColor()

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={onClick}
      onContextMenu={onRightClick}
      style={{
        backgroundColor: backgroundColor,
        color: colors[cell.nearbyMines - 1],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '1.6rem',
        boxSizing: 'border-box',
        borderBottom: !cell.isRevealed
          ? '3px solid black'
          : '1px solid rgba(0, 0, 0, 0.5)',
        borderRight: !cell.isRevealed
          ? '3px solid black'
          : '1px solid rgba(0, 0, 0, 0.5)',
        borderTop: !cell.isRevealed
          ? '3px solid white'
          : '1px solid rgba(0, 0, 0, 0.5)',
        borderLeft: !cell.isRevealed
          ? '3px solid white'
          : '1px solid rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
      }}
    >
      {cell.isFlagged ? (
        <p>🚩</p>
      ) : !cell.isRevealed || cell.nearbyMines === 0 ? null : !cell.isMine ? (
        <p style={{ margin: '0' }}>{cell.nearbyMines}</p>
      ) : (
        <img
          src="client/images/bomb.png"
          alt="minesweeper bomb"
          style={{ width: '80%' }}
        />
      )}
    </div>
  )
}
