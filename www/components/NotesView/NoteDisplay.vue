<template>
  <div>
    <v-expansion-panel-header class="title">
      {{ name }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <p class="mt-8">
        {{
          `i${startUpFrames}&nbsp;&nbsp;&nbsp;&nbsp;${onBlock} | ${onHit} | ${onCounterHit}
        &nbsp;&nbsp;&nbsp;${buttonInput}`
        }}
      </p>
      <p v-if="!!noteText">
        {{ noteText }}
      </p>
    </v-expansion-panel-content>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    startUpFrames: {
      type: Number,
      required: true
    },
    onBlock: {
      type: String,
      required: true
    },
    onHit: {
      type: String,
      required: true
    },
    onCounterHit: {
      type: String,
      required: true
    },
    buttonInput: {
      type: Array,
      required: true
    },
    noteText: {
      type: String,
      default: null
    }
  }
}
</script>
