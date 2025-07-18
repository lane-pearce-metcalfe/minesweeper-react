import { CellData } from './Board'

export function Cell({
  cell,
  onClick,
}: {
  cell: CellData
  onClick: () => void
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
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'lightgray',
        color: colors[cell.nearbyMines - 1],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '1.6rem',
        boxSizing: 'border-box',
        borderBottom: '3px solid black',
        borderRight: '3px solid black',
        borderTop: '3px solid white',
        borderLeft: '3px solid white',
        cursor: 'pointer',
      }}
    >
      {!cell.isRevealed || cell.nearbyMines === 0 ? null : !cell.isMine ? (
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
