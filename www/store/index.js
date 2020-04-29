// export const state = () => ({
//   userEmail: ''
// })

// export const mutations = {
//   setUserEmail (state, userEmail) {
//     state.userEmail = userEmail
//   }
// }

import {
  remove,
  findIndex,
  propEq,
  lensProp,
  lens,
  lensPath,
  update,
  over,
  compose,
  evolve,
  inc,
  dec,
  T,
  F,
  find,
  append,
  reverse,
  always,
  thunkify,
  pipe
} from 'ramda'

import { reduceIndexed } from 'ramda-adjunct'
import { either, Right, Left } from 'Sanctuary'

import userWithMoves from '~/gql/userWithMoves.gql'
import latestMoves from '~/gql/latestMoves.gql'
import insertMove from '~/gql/insertMove.gql'
import deleteMove from '~/gql/deleteMove.gql'
import insertLike from '~/gql/insertLike.gql'
import deleteLike from '~/gql/deleteLike.gql'

const removeMoveById = (moves, moveId) => {
  const index = findIndex(propEq('id', moveId), moves)

  if (!~index) {
    throw new Error(`move with id ${moveId} cannot be removed - id was not found`)
  }

  return remove(index, 1, moves)
}

// takes an array of thunks
const updateCacheReducer = (acc, el, i, list) => {
  if (i === 0) {
    return acc(el)
  } else if (i < list.length - 1) {
    return func => acc(either(el)(Right)(func))
  }
  return acc(el())
}

const initialAcc = func => either(func)(Right)

// takes an array of thunks
const executeUpdates = pipe(
  reverse,
  reduceIndexed(
    updateCacheReducer,
    initialAcc
  ),
  either(always(Left('all cache updates failed')))(Right)
)

const UserWithMovesModel = {
  moves: lensPath(['user', 0, 'moves'])
}

const LatestMovesModel = {
  moves: lensProp('move')
}

const Moves = {
  moveById: id => lens(
    find(propEq('id', id)),
    (val, arr) => update(
      findIndex(
        propEq('id', id),
        arr
      ),
      val,
      arr
    )
  )
}

const LikesAggregate = {
  count: lensPath(['aggregate', 'count'])
}

const updateQuery = (transformData, queryInfo, store) => {
  const operation = queryInfo.query.definitions[0]
  const operationName = operation && operation.name.value

  try {
    const data = store.readQuery(queryInfo)

    store.writeQuery({
      ...queryInfo,
      data: transformData(data)
    })

    return Right(`update ${operationName} succeeded`)
  } catch (e) {
    return Left(`update ${operationName} failed`)
  }
}

const updateQueryThunkified = thunkify(updateQuery)

export const actions = {
  insertMove (_, move) {
    const apolloClient = this.app.apolloProvider.defaultClient

    apolloClient.mutate({
      mutation: insertMove,
      variables: {
        input: {
          ...move,
          createdBy: this.$auth.user.sub
        },
        userId: this.$auth.user.sub
      },
      update: (
        store,
        {
          data: {
            insert_move: { returning }
          }
        }
      ) => {
        const data = store.readQuery({
          query: userWithMoves,
          variables: {
            userId: this.$auth.user.sub
          }
        })

        // if move was updated, the cache will be automatically updated, so
        // return early
        if (
          data.user[0].moves.find(
            ({ id }) => id === returning[0].id
          )) {
          return
        }

        // if a new move was added, add it to the cache manually
        const variables = {
          userId: this.$auth.user.sub
        }

        const appendMove = append(returning[0])

        updateQuery(
          over(
            UserWithMovesModel.moves,
            appendMove
          ),
          {
            query: userWithMoves,
            variables
          },
          store
        )

        updateQuery(
          over(
            LatestMovesModel.moves,
            appendMove
          ),
          {
            query: latestMoves,
            variables
          },
          store
        )
      }
    })
  },

  deleteMove (_, moveId) {
    const apolloClient = this.app.apolloProvider.defaultClient

    apolloClient.mutate({
      mutation: deleteMove,
      variables: {
        moveId
      },
      update: (
        store,
        {
          data: {
            delete_move: { returning }
          }
        }
      ) => {
        const data = store.readQuery({
          query: userWithMoves,
          variables: {
            userId: this.$auth.user.sub
          }
        })

        data.user[0].moves = removeMoveById(data.user[0].moves, returning[0].id)
        store.writeQuery({ query: userWithMoves, data })
      }
    })
  },

  insertLike (_, moveId) {
    const apolloClient = this.app.apolloProvider.defaultClient

    apolloClient.mutate({
      mutation: insertLike,
      variables: {
        input: {
          moveId,
          userId: this.$auth.user.sub
        }
      },
      update: (store) => {
        const transformMove = (moveLens, id) => over(
          compose(
            moveLens,
            Moves.moveById(id)
          ),
          evolve({
            liked: T,
            likes_aggregate: over(LikesAggregate.count, inc)
          })
        )

        const variables = {
          userId: this.$auth.user.sub
        }

        const updateQueryThunks = [
          updateQueryThunkified(
            transformMove(
              LatestMovesModel.moves,
              moveId
            ),
            {
              query: latestMoves,
              variables
            },
            store
          ),
          updateQueryThunkified(
            transformMove(
              UserWithMovesModel.moves,
              moveId
            ),
            {
              query: userWithMoves,
              variables
            },
            store
          )
        ]

        either(
          x => console.log(x)
        )(
          x => console.log(x)
        )(
          executeUpdates(updateQueryThunks)
        )
      }
    })
  },

  deleteLike (_, moveId) {
    const apolloClient = this.app.apolloProvider.defaultClient

    apolloClient.mutate({
      mutation: deleteLike,
      variables: {
        moveId,
        userId: this.$auth.user.sub
      },
      update: (store) => {
        const transformMove = (moveLens, id) => over(
          compose(
            moveLens,
            Moves.moveById(id)
          ),
          evolve({
            liked: F,
            likes_aggregate: over(LikesAggregate.count, dec)
          })
        )

        const variables = {
          userId: this.$auth.user.sub
        }

        const updateQueryThunks = [
          updateQueryThunkified(
            transformMove(
              LatestMovesModel.moves,
              moveId
            ),
            {
              query: latestMoves,
              variables
            },
            store
          ),
          updateQueryThunkified(
            transformMove(
              UserWithMovesModel.moves,
              moveId
            ),
            {
              query: userWithMoves,
              variables
            },
            store
          )
        ]

        either(
          x => console.log(x)
        )(
          x => console.log(x)
        )(
          executeUpdates(updateQueryThunks)
        )
      }
    })
  }
}
