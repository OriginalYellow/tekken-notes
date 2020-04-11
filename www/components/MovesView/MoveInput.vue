<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <!-- naming this stuff other than "asdf" mysterously breaks it ooooooo -->
      <slot name="asdf" :on="on" />
    </template>

    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        {{ title }}
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newMove.name"
          label="name"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.startupFrames"
          label="startup frames"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.onBlock"
          label="on block"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.onHit"
          label="on hit"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.onCounterhit"
          label="on counter-hit"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.buttonInput"
          label="button input"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.noteText"
          label="notes"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          dark
          color="green"
          @click="onInsertMove"
        >
          {{ completeButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    completeButtonText: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      newMove: {
        name: 'default',
        startupFrames: 1,
        onBlock: 'default',
        onHit: 'default',
        onCounterhit: 'default',
        buttonInput: ['0', '0'],
        noteText: 'default'
      },
      dialog: false
    }
  },

  methods: {
    ...mapActions(['insertMove']),

    onInsertMove () {
      this.dialog = false

      const newMove = { ...this.newMove }

      if (this.id) {
        newMove.id = this.id
      }

      this.insertMove(newMove)
    }
  }
}
</script>
