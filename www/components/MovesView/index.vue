<template>
  <div>
    <move-input
      title="Add a new move"
      complete-button-text="add"
    >
      <template v-slot:asdf="{ on }">
        <v-btn
          dark
          absolute
          bottom
          right
          fab
          color="green"
          :style="addButtonStyle"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </move-input>
    <move-list
      multiple
      :moves="moves"
    />
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
