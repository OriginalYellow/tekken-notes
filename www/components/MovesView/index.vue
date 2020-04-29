<template>
  <div>
    <move-list
      multiple
      :moves="moves"
    />
  </div>
</template>

<script>
import MoveList from './MoveList.vue'

export default {
  components: {
    MoveList
  },

  props: {
    moves: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      addButtonStyle: {
        bottom: '20px'
      }
    }
  }
}
</script>
