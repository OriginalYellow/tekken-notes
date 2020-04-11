<template>
  <v-layout>
    <v-flex
      xs12
      sm8
      md6
    >
      <moves-view
        :moves="moves"
        @add="handleAdd"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import MovesView from '~/components/MovesView'
// import allMoves from '~/gql/allMoves.gql'
import userWithMoves from '~/gql/userWithMoves.gql'
import insertMove from '~/gql/insertMove.gql'

export default {
  components: {
    MovesView
  },

  data () {
    return {
      moves: []
    }
  },

  beforeCreate () {
    this.$apollo
      .query({
        query: userWithMoves
      })
      .then(
        ({
          data: {
            user
          }
        }) => {
          this.moves = user[0].moves
        }
      )
  },

  methods: {
    handleAdd (newMove) {
      this.$apollo.mutate({
        mutation: insertMove,
        variables: {
          input: {
            ...newMove,
            createdBy: this.$auth.user.sub,
            buttonInput: newMove.buttonInput.toString()
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
}
</script>
