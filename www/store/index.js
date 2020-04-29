// export const state = () => ({
//   userEmail: ''
// })

// export const mutations = {
//   setUserEmail (state, userEmail) {
//     state.userEmail = userEmail
//   }
// }

import {
  reject,
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
const updateQueryOnce = pipe(
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
  // https://stackoverflow.com/questions/58337364/how-to-get-the-name-of-a-query-from-a-gql-object
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
    const userId = this.$auth.user.sub

    apolloClient.mutate({
      mutation: insertMove,
      variables: {
        input: {
          ...move,
          createdBy: userId
        },
        userId
      },
      update: (
        store,
        {
          data: {
            insert_move: { returning }
          }
        }
      ) => {
        const variables = { userId }

        const data = store.readQuery({
          query: userWithMoves,
          variables
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
    const userId = this.$auth.user.sub

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
        const variables = { userId }
        const rejectMove = reject(propEq('id', moveId))

        updateQuery(
          over(
            UserWithMovesModel.moves,
            rejectMove
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
            rejectMove
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

  insertLike (_, moveId) {
    const apolloClient = this.app.apolloProvider.defaultClient

    const userId = this.$auth.user.sub
    apolloClient.mutate({
      mutation: insertLike,
      variables: {
        input: {
          moveId,
          userId
        }
      },
      update: (store) => {
        const transformMove = (movesLens, id) => over(
          compose(
            movesLens,
            Moves.moveById(id)
          ),
          evolve({
            liked: T,
            likes_aggregate: over(LikesAggregate.count, inc)
          })
        )

        const variables = { userId }

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
          updateQueryOnce(updateQueryThunks)
        )
      }
    })
  },

  deleteLike (_, moveId) {
    const apolloClient = this.app.apolloProvider.defaultClient

    const userId = this.$auth.user.sub

    apolloClient.mutate({
      mutation: deleteLike,
      variables: {
        moveId,
        userId
      },
      update: (store) => {
        const transformMove = (movesLens, id) => over(
          compose(
            movesLens,
            Moves.moveById(id)
          ),
          evolve({
            liked: F,
            likes_aggregate: over(LikesAggregate.count, dec)
          })
        )

        const variables = { userId }

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
          updateQueryOnce(updateQueryThunks)
        )
      }
    })
  }
}
