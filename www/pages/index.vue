<template>
  <v-layout>
    <v-flex
      xs12
      sm8
      md6
    >
      <notes-view :notes="notes" @add="handleAdd" />
    </v-flex>
  </v-layout>
</template>

<script>
import NotesView from '~/components/NotesView'

export default {
  components: {
    NotesView
  },

  data () {
    return {
      notes: [
        {
          name: 'a cool move',
          startUpFrames: 10,
          onBlock: '-7',
          onHit: '+1',
          onCounterHit: '+9',
          buttonInput: [1, 3],
          noteText: 'Punish, 10 frame'
        },
        {
          name: 'another cool move',
          startUpFrames: 10,
          onBlock: '-12',
          onHit: 'knd',
          onCounterHit: 'knd',
          buttonInput: [1, 3, 2]
        }
      ]
    }
  },

  methods: {
    handleAdd (newMove) {
      this.notes.push(newMove)
    }
  }
}
</script>
