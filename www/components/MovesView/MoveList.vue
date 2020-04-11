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
        v-for="move in moves"
        :key="move.name"
      >
        <move-display v-bind="move" />
      </v-expansion-panel>
    </v-slide-y-transition>
  </v-expansion-panels>
</template>

<script>
import MoveDisplay from './MoveDisplay.vue'

export default {
  components: {
    MoveDisplay
  },

  props: {
    moves: {
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
