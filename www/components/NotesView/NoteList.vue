<template>
  <v-expansion-panels
    :value="value"
    multiple
    focusable
  >
    <v-slide-y-transition
      group
      tag="div"
      style="width: 100%;"
    >
      <v-expansion-panel
        v-for="note in notes"
        :key="note.name"
      >
        <note-display v-bind="note" />
      </v-expansion-panel>
    </v-slide-y-transition>
  </v-expansion-panels>
</template>

<script>
import NoteDisplay from './NoteDisplay.vue'

export default {
  components: {
    NoteDisplay
  },

  props: {
    notes: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      value: []
    }
  }
}
</script>
