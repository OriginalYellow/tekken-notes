<template>
  <v-layout>
    <v-flex
      xs12
      sm8
      md6
      class="py-5 px-3"
    >
      <p class="display-2">
        My Moves
      </p>
      <p v-show="!$auth.loggedIn">
        login or sign up to see your moves and add new ones
      </p>
      <moves-view
        v-show="$auth.loggedIn"
        :moves="moves"
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
      user: null
    }
  },

  computed: {
    moves () {
      if (!this.user) {
        return []
      }

      return this.user[0].moves
    }
  },

  apollo: {
    user: {
      query: userWithMoves
    }
  },

  methods: {
    handleInsertMove (newMove) {
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
