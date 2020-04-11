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
                complete-button-text="apply"
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
import MoveInput from './MoveInput'

export default {
  components: {
    MoveInput
  },

  props: {
    name: {
      type: String,
      required: true
    },
    startupFrames: {
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
    onCounterhit: {
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
    },
    id: {
      type: Number,
      required: true
    }
  }
}
</script>
