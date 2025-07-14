import Cell from './Cell'

export default function Board({ size }: { size: number }) {
  const testArr = new Array(size * size).fill(0)
  return testArr.map((arr, i) => {
    return <Cell key={i} />
  })
}
