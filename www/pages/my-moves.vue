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
      <my-moves-view v-if="$auth.loggedIn" />
    </v-flex>
  </v-layout>
</template>

<script>
import MyMovesView from '~/components/MyMovesView'

export default {
  components: {
    MyMovesView
  }
}
</script>
