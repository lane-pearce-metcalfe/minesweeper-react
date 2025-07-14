export default function Cell() {
  return (
    <div
      style={{
        backgroundColor: 'lightgray',
        color: 'blue',
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
      }}
    >
      <p style={{ margin: '0' }}>1</p>
    </div>
  )
}
