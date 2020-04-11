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
        v-for="move in sortedMoves"
        :key="move.id"
      >
        <move-display v-bind="move" />
      </v-expansion-panel>
    </v-slide-y-transition>
  </v-expansion-panels>
</template>

<script>
import MoveDisplay from './MoveDisplay.vue'

const sortByCreated = (moves, ascending = true) => {
  return moves.sort(({ createdAt: ts1 }, { createdAt: ts2 }) => {
    if (ascending) {
      return Date.parse(ts2) - Date.parse(ts1)
    }

    return Date.parse(ts1) - Date.parse(ts2)
  })
}

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
      value: [],
      sortBy: 'createdAt',
      sortDirection: 'ascending'
    }
  },

  computed: {
    sortedMoves () {
      if (this.sortBy === 'createdAt') {
        if (this.sortDirection === 'descending') {
          return sortByCreated(this.moves, false)
        } else {
          return sortByCreated(this.moves)
        }
      }

      return this.moves
    }
  }
}
</script>
