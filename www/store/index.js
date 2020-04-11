// export const state = () => ({
//   userEmail: ''
// })

// export const mutations = {
//   setUserEmail (state, userEmail) {
//     state.userEmail = userEmail
//   }
// }

import userWithMoves from '~/gql/userWithMoves.gql'
import insertMove from '~/gql/insertMove.gql'

export const actions = {
  insertMove (_, move) {
    const apolloClient = this.app.apolloProvider.defaultClient
    apolloClient.mutate({
      mutation: insertMove,
      variables: {
        input: {
          ...move,
          createdBy: this.$auth.user.sub,
          buttonInput: move.buttonInput.toString()
        }
      },
      // eslint-disable-next-line camelcase
      update: (
        store,
        {
          data: {
            insert_move: { returning }
          }
        }
      ) => {
        const data = store.readQuery({ query: userWithMoves })
        data.user[0].moves.push(returning[0])
        store.writeQuery({ query: userWithMoves, data })
      }
    })
  }
}
