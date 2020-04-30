<template>
  <v-expansion-panels
    :value="value"
    multiple
    focusable
  >
    <v-slide-y-transition
      v-if="editable"
      group
      tag="div"
      style="width: 100%;"
    >
      <move-display-editable
        v-for="move in sortedMoves"
        :key="move.id"
        v-bind="move"
      />
    </v-slide-y-transition>

    <v-slide-y-transition
      v-else
      group
      tag="div"
      style="width: 100%;"
    >
      <move-display-read-only
        v-for="move in sortedMoves"
        :key="move.id"
        v-bind="move"
      />
    </v-slide-y-transition>
  </v-expansion-panels>
</template>

<script>
import MoveDisplayEditable from './MoveDisplay/Editable.vue'
import MoveDisplayReadOnly from './MoveDisplay/ReadOnly.vue'

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
    MoveDisplayEditable,
    MoveDisplayReadOnly
  },

  props: {
    moves: {
      type: Array,
      default: () => []
    },
    editable: {
      type: Boolean,
      default: false
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
