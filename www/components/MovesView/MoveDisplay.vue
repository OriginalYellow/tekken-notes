<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="title">
      <v-layout class="mr-5">
        <v-flex>
          <p class="text-left mb-0">
            {{ name }}
          </p>
        </v-flex>
        <v-flex>
          <p class="text-right mb-0">
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
          </p>
        </v-flex>
      </v-layout>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-layout row>
        <v-flex
          xs6
          class="mt-8"
        >
          <p>
            {{
              `i${startupFrames}&nbsp;&nbsp;&nbsp;&nbsp;${onBlock} | ${onHit} | ${onCounterhit}
        &nbsp;&nbsp;&nbsp;${buttonInput}`
            }}
          </p>
          <p v-if="!!noteText">
            {{ noteText }}
          </p>
        </v-flex>

        <v-flex xs6>
          <v-card flat>
            <v-card-actions class="pt-3 pr-0">
              <v-spacer />
              <move-input
                :id="id"
                title="Edit move"
                complete-button-text="save"
                :name="name"
                :character-name="characterName"
                :startup-frames="startupFrames"
                :on-block="onBlock"
                :on-hit="onHit"
                :on-counterhit="onCounterhit"
                :button-input="buttonInput"
                :note-text="noteText"
              >
                <template v-slot:asdf="{ on }">
                  <v-btn
                    dark
                    color="blue"
                    depressed
                    v-on="on"
                  >
                    edit
                  </v-btn>
                </template>
              </move-input>

              <v-btn
                outlined
                dark
                color="red"
                @click="handleDeleteMove"
              >
                delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapActions } from 'vuex'
import MoveInput from './MoveInput'
import moveProps from '~/moveProps'

export default {
  components: {
    MoveInput
  },

  props: {
    ...moveProps,
    characterPortrait: {
      type: String,
      default: ''
    }
  },

  methods: {
    ...mapActions(['deleteMove']),

    handleDeleteMove () {
      this.deleteMove(this.id)
    }
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
