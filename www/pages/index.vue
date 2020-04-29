<template>
  <v-layout>
    <v-flex
      xs12
      sm11
      md6
      class="py-5 px-3"
    >
      <p class="display-2">
        Newest Moves
      </p>
      <moves-view />
    </v-flex>
  </v-layout>
</template>

<script>
import MovesView from '~/components/MovesView'

export default {
  components: {
    MovesView
  }
}
</script>
