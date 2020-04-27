<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="title">
      <v-row
        class="mr-5"
        no-gutters
      >
        <v-col cols="8">
          <p :class="[...paragraphClass, 'text-left']">
            {{ `${name}&nbsp;&nbsp;` }}
            <span class="body-1">—</span>
            {{ '&nbsp;' }}
            <span class="body-2 font-italic">{{ likeCount }} {{ likeCount == 1 ? 'like' : 'likes' }}</span>
          </p>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-end flex-column">
            <v-chip
              pill
              class="custom-pill"
              color="blue lighten-4"
            >
              {{ characterName }}
              <v-avatar
                right
                size="60"
              >
                <v-img :src="characterPortrait" />
              </v-avatar>
            </v-chip>
          </div>
        </v-col>
        <!-- mdi-thumb-up -->
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="body-1">
          <p>
            {{
              `i${startupFrames}&nbsp;&nbsp;&nbsp;&nbsp;${onBlock} | ${onHit} | ${onCounterhit}
        &nbsp;&nbsp;&nbsp;${buttonInput}`
            }}
          </p>
          <p v-if="!!noteText">
            {{ noteText }}
          </p>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import moveProps from '~/moveProps'

export default {

  props: {
    ...moveProps,
    likeCount: {
      type: Number,
      default: NaN
    },
    characterPortrait: {
      type: String,
      default: ''
    }
  },

  computed: {
    paragraphClass: () => ['mb-0']
  }
}
</script>

<style scoped>
.custom-pill {
  cursor: pointer;
}

.custom-pill:before {
  color: transparent;
}
</style>
