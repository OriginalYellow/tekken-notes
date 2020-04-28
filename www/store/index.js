// export const state = () => ({
//   userEmail: ''
// })

// export const mutations = {
//   setUserEmail (state, userEmail) {
//     state.userEmail = userEmail
//   }
// }

import { remove, findIndex, propEq } from 'ramda'
import userWithMoves from '~/gql/userWithMoves.gql'
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
        const data = store.readQuery({
          query: userWithMoves,
          variables: {
            userId: this.$auth.user.sub
          }
        })

        const moveIndex = data.user[0].moves.findIndex(
          ({ id }) => id === moveId
        )

        data.user[0].moves[moveIndex].likes_aggregate.aggregate.count++
        data.user[0].moves[moveIndex].liked = true

        store.writeQuery({
          query: userWithMoves,
          variables: {
            userId: this.$auth.user.sub
          },
          data
        })
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
        const data = store.readQuery({
          query: userWithMoves,
          variables: {
            userId: this.$auth.user.sub
          }
        })

        const moveIndex = data.user[0].moves.findIndex(
          ({ id }) => id === moveId
        )

        data.user[0].moves[moveIndex].likes_aggregate.aggregate.count--
        data.user[0].moves[moveIndex].liked = false

        store.writeQuery({
          query: userWithMoves,
          variables: {
            userId: this.$auth.user.sub
          },
          data
        })
      }
    })
  }
}
