import { CellData } from './Board'

export default function Cell({ cell }: { cell: CellData }) {
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
    <div
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
      <p style={{ margin: '0' }}>{cell.nearbyMines}</p>
    </div>
  )
}
