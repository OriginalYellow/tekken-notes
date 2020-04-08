<template>
  <v-layout>
    <v-flex
      xs12
      sm8
      md6
    >
      <notes-view
        :notes="moves"
        @add="handleAdd"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import NotesView from '~/components/NotesView'
import allMoves from '~/gql/allMoves.gql'
import insertMove from '~/gql/insertMove.gql'

export default {
  components: {
    NotesView
  },

  data () {
    return {
      moves: []
    }
  },

  beforeCreate () {
    this.$apollo.query({ query: allMoves }).then(
      ({
        data: {
          moves: { nodes }
        }
      }) => {
        this.moves = nodes
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
            createdBy: 1,
            buttonInput: newMove.buttonInput.toString()
          }
        },
        // eslint-disable-next-line camelcase
        update: (store, { data: { insert_move: { returning } } }) => {
          const data = store.readQuery({ query: allMoves })
          data.moves.nodes.push(returning[0])
          store.writeQuery({ query: allMoves, data })
        }
      })
    }
  }
}
</script>
