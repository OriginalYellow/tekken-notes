<template>
  <div>
    <p>
      <img
        v-for="image in images"
        :key="image"
        :src="`https://res.cloudinary.com/dscfugb4z/image/upload/tekken-notes/inputs/${image}-input.png`"
      >
      <span v-if="isError">error</span>
      <span v-else>{{ fullCommand }}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    fullCommand: {
      type: String,
      required: true
    }
  },

  computed: {
    images () {
      return [
        '123',
        'only-1'
      ]
    },

    parsedFullCommand () {
      return this.$validators.parseFullCommand(this.fullCommand)
    },

    result () {
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
