<template>
  <v-layout
    align-center
    justify-start
    wrap
    column
    class="mt-5"
  >
    <v-flex xs12>
      <v-layout
        align-center
        justify-center
        wrap
        column
        fill-height
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="100"
        />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  created () {
    setTimeout(() => {
      this.$router.push({
        path: '/'
      })
    },
    2000
    )
  }
}
</script>
