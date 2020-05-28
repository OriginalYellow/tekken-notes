<template>
  <div>
    <p>
      <span v-if="isError">error</span>

      <span
        v-for="(partialCommand, i) in fullCommandProps"
        v-else
        :key="i"
      >
        <img
          v-if="partialCommand.type === types.IMAGE"
          :src="`https://res.cloudinary.com/dscfugb4z/image/upload/tekken-notes/input/${partialCommand.val}.png`"
          class="image mb-n2"
        >

        <span v-else-if="partialCommand.type === types.MULTIPLE_IMAGES">
          <img
            v-for="(val, j) in partialCommand.val"
            :key="j"
            :src="`https://res.cloudinary.com/dscfugb4z/image/upload/tekken-notes/input/${val}.png`"
            class="image mb-n2"
          >

        </span>

        <v-chip
          v-else-if="partialCommand.type === types.TEXT"
          label
          :class="chipClass"
          color="red lighten-2"
          dark
        >
          {{ partialCommand.val }}
        </v-chip>

        <v-chip
          v-else-if="partialCommand.type === types.TEXT_WITH_PARENS"
          label
          :class="chipClass"
          color="transparent"
          dark
          large
        >
          <span class="indigo--text text--darken-2 font-weight-bold">
            ({{ partialCommand.val }})
          </span>
        </v-chip>

        <v-chip
          v-else-if="partialCommand.type === types.ALT_COMMAND_OPERATOR"
          label
          :class="chipClass"
          color="transparent"
          large
        >
          <span class="indigo--text text--darken-2 font-weight-bold">
            {{ partialCommand.val }}
          </span>
        </v-chip>
      </span>
    </p>
  </div>
</template>

<script>
import { compilerTypes as types } from '~/parsers/fullCommand/constants'

export default {
  props: {
    fullCommand: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      chipClass: 'mb-6 mx-2'
    }
  },

  computed: {
    types: () => types,

    parsedFullCommand () {
      return this.$validators.parseFullCommand(this.fullCommand)
    },

    fullCommandProps () {
      if (this.fullCommandTree) {
        return this.$validators.compileFullCommandToProps(this.fullCommandTree)
      } else {
        return []
      }
    },

    fullCommandTree () {
      return this.parsedFullCommand.result
    },

    isError () {
      if (this.fullCommand === null) {
        return true
      }

      return this.parsedFullCommand.isError
    }
  }
}
</script>

<style scoped>
.image {
  /* max-width: 50px; */
  max-height: 50px;
}
</style>
