<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <notes-view />
    </v-flex>
  </v-layout>
</template>

<script>
import NotesView from '~/components/NotesView.vue'

export default {
  components: {
    NotesView
  }
}
</script>
