<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        dark
        absolute
        bottom
        right
        fab
        color="green"
        :style="addButtonStyle"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        add a new move
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newMove.name"
          label="name"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="newMove.startUpFrames"
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
          v-model="newMove.onCounterHit"
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
          color="green"
          @click="onAdd"
        >
          add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      newMove: {
        name: 'default',
        startUpFrames: 1,
        onBlock: 'default',
        onHit: 'default',
        onCounterHit: 'default',
        buttonInput: ['0', '0'],
        noteText: 'default'
      },
      dialog: false,
      addButtonStyle: {
        bottom: '20px'
      }
    }
  },

  methods: {
    onAdd () {
      this.$parent.$emit('add', {
        ...this.newMove
      })
      this.dialog = false
    }
  }
}
</script>
