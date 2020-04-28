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
  find
} from 'ramda'

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

// eslint-disable-next-line no-unused-vars
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
  try {
    const data = store.readQuery(queryInfo)
    store.writeQuery({
      ...queryInfo,
      data: transformData(data)
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    // eslint-disable-next-line no-console
    console.log('Not updating store - Projects not loaded yet')
  }
}

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
        data.user[0].moves.push(returning[0])
        store.writeQuery({ query: userWithMoves, data })
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

        updateQuery(
          transformMove(
            LatestMovesModel.moves,
            moveId
          ),
          {
            query: latestMoves,
            variables: {
              userId: this.$auth.user.sub
            }
          },
          store
        )

        updateQuery(
          transformMove(
            UserWithMovesModel.moves,
            moveId
          ),
          {
            query: userWithMoves,
            variables: {
              userId: this.$auth.user.sub
            }
          },
          store
        )

        // eslint-disable-next-line no-unused-vars
        // const userWithMovesData = store.readQuery({
        //   query: userWithMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   }
        // })

        // const latestMovesData = store.readQuery({
        //   query: latestMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   }
        // })

        // const userWithMovesMoveIndex = userWithMovesData.user[0].moves.findIndex(
        //   ({ id }) => id === moveId
        // )

        // const latestMovesMoveIndex = latestMovesData.move.findIndex(
        //   ({ id }) => id === moveId
        // )

        // userWithMovesData.user[0].moves[userWithMovesMoveIndex].likes_aggregate.aggregate.count++
        // userWithMovesData.user[0].moves[userWithMovesMoveIndex].liked = true

        // latestMovesData.move[latestMovesMoveIndex].likes_aggregate.aggregate.count++
        // latestMovesData.move[latestMovesMoveIndex].liked = true

        // store.writeQuery({
        //   query: userWithMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   },
        //   data: userWithMovesData
        // })

        // store.writeQuery({
        //   query: latestMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   },
        //   data: latestMovesData
        // })
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

        updateQuery(
          transformMove(
            LatestMovesModel.moves,
            moveId
          ),
          {
            query: latestMoves,
            variables: {
              userId: this.$auth.user.sub
            }
          },
          store
        )

        updateQuery(
          transformMove(
            UserWithMovesModel.moves,
            moveId
          ),
          {
            query: userWithMoves,
            variables: {
              userId: this.$auth.user.sub
            }
          },
          store
        )

        // eslint-disable-next-line no-unused-vars
        // const userWithMovesData = store.readQuery({
        //   query: userWithMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   }
        // })

        // const latestMovesData = store.readQuery({
        //   query: latestMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   }
        // })

        // const userWithMovesMoveIndex = userWithMovesData.user[0].moves.findIndex(
        //   ({ id }) => id === moveId
        // )

        // const latestMovesMoveIndex = latestMovesData.move.findIndex(
        //   ({ id }) => id === moveId
        // )

        // userWithMovesData.user[0].moves[userWithMovesMoveIndex].likes_aggregate.aggregate.count--
        // userWithMovesData.user[0].moves[userWithMovesMoveIndex].liked = false

        // latestMovesData.move[latestMovesMoveIndex].likes_aggregate.aggregate.count--
        // latestMovesData.move[latestMovesMoveIndex].liked = false

        // store.writeQuery({
        //   query: userWithMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   },
        //   data: userWithMovesData
        // })

        // store.writeQuery({
        //   query: latestMoves,
        //   variables: {
        //     userId: this.$auth.user.sub
        //   },
        //   data: latestMovesData
        // })
      }
    })
  }
}
