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
import userWithMoves from '~/gql/userWithMoves.gql'

export default {
  components: {
    MovesView
  },

  data () {
    return {
      moves: []
    }
  },

  apollo: {
    moves: {
      query: userWithMoves,
      update: ({ user }) => user[0].moves
    }
  }
}
</script>
