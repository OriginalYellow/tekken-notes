import { remove, findIndex, propEq } from 'ramda'

const testMoves = [
  { id: 1 },
  { id: 2 }
]

const deleteById = (moves, moveId) => {
  const index = findIndex(propEq('id', moveId), moves) // ?

  if (!~index) {
    throw new Error(`move with id ${moveId} cannot be deleted - id was not found`)
  }

  return remove(index, 1, moves)
}

deleteById(testMoves, 3) // ?
