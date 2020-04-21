<template>
  <div>
    <v-expansion-panel-header class="title">
      {{ name }}
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
                :startup-frames="startupFrames"
                :on-block="onBlock"
                :on-hit="onHit"
                :on-counterhit="onCounterhit"
                :button-input="buttonInput"
                :note-text="noteText"
              >
                <template v-slot:asdf="{ on }">
                  <v-btn
                    outlined
                    dark
                    color="blue"
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
  </div>
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
    ...moveProps
  },

  methods: {
    ...mapActions(['deleteMove']),

    handleDeleteMove () {
      this.deleteMove(this.id)
    }
  }
}
</script>
