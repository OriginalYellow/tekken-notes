<template>
  <div>
    <note-input />
    <note-list multiple :notes="notes" />
  </div>
</template>

<script>
import NoteList from './NoteList.vue'
import NoteInput from './NoteInput.vue'

export default {
  components: {
    NoteList,
    NoteInput
  },

  props: {
    notes: {
      type: Array,
      default: () => []
    }
  }
}
</script>
