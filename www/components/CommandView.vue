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
          v-if="partialCommand.type === fullCommandConstants.IMAGE"
          :src="`https://res.cloudinary.com/dscfugb4z/image/upload/tekken-notes/input/${partialCommand.val}.png`"
          class="image mb-n2"
        >

        <v-chip
          v-else-if="partialCommand.type === fullCommandConstants.TEXT"
          label
          :class="chipClass"
          color="red lighten-2"
          dark
        >
          {{ partialCommand.val }}
        </v-chip>

        <v-chip
          v-else-if="partialCommand.type === fullCommandConstants.TEXT_WITH_PARENS"
          label
          :class="chipClass"
          color="indigo lighten-2"
          dark
        >
          ({{ partialCommand.val }})
        </v-chip>
      </span>
    </p>
  </div>
</template>

<script>
import { TEXT, TEXT_WITH_PARENS, IMAGE } from '~/parsers/fullCommand/constants'

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
    fullCommandConstants: () => ({
      TEXT,
      TEXT_WITH_PARENS,
      IMAGE
    }),

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
  max-height: 50px
}
</style>
