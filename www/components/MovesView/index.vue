<template>
  <div>
    <move-input />
    <move-list multiple :moves="moves" />
  </div>
</template>

<script>
import MoveList from './MoveList.vue'
import MoveInput from './MoveInput.vue'

export default {
  components: {
    MoveList,
    MoveInput
  },

  props: {
    moves: {
      type: Array,
      default: () => []
    }
  }
}
</script>
