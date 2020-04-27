<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <!-- naming this strings other than "asdf" mysterously breaks it ooooOOoooOOoo! -->
      <slot
        name="asdf"
        :on="on"
      />
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
          v-model="computedName"
          clearable
          :label="computedName ? 'name' : ''"
          :error-messages="{
            validations: $v.computedName,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.name"
          @input="$v.computedName.$touch()"
          @blur="$v.computedName.$touch()"
        />
      </v-card-text>

      <v-card-text>
        <v-autocomplete
          v-model="computedCharacterName"
          :items="characterNames"
          label="character"
          :error-messages="{
            validations: $v.computedCharacterName,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          @input="$v.computedCharacterName.$touch()"
          @blur="$v.computedCharacterName.$touch()"
        />
      </v-card-text>

      <v-card-text>
        <v-text-field
          v-model="computedStartupFrames"
          clearable
          :label="computedStartupFrames ? 'startup frames' : ''"
          :error-messages="{
            validations: $v.computedStartupFrames,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
              { validationName: 'integer', message: 'must be an integer' },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.startupFrames"
          @input="$v.computedStartupFrames.$touch()"
          @blur="$v.computedStartupFrames.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="computedOnBlock"
          clearable
          :label="computedOnBlock ? 'frames/effect on block' : ''"
          :error-messages="{
            validations: $v.computedOnBlock,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.onBlock"
          @input="$v.computedOnBlock.$touch()"
          @blur="$v.computedOnBlock.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="computedOnHit"
          clearable
          :label="computedOnHit ? 'frames/effect on hit' : ''"
          :error-messages="{
            validations: $v.computedOnHit,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.onHit"
          @input="$v.computedOnHit.$touch()"
          @blur="$v.computedOnHit.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="computedOnCounterhit"
          clearable
          :label="computedOnCounterhit ? 'frames/effect on counter-hit' : ''"
          :error-messages="{
            validations: $v.computedOnCounterhit,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.onCounterhit"
          @input="$v.computedOnCounterhit.$touch()"
          @blur="$v.computedOnCounterhit.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="computedButtonInput"
          clearable
          :label="computedButtonInput ? 'button input' : ''"
          :error-messages="{
            validations: $v.computedButtonInput,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.buttonInput"
          @input="$v.computedButtonInput.$touch()"
          @blur="$v.computedButtonInput.$touch()"
        />
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="computedNoteText"
          clearable
          :label="computedNoteText ? 'notes' : ''"
          :error-messages="{
            validations: $v.computedNoteText,
            errorMessages: [
              { validationName: 'isNotNilOrEmpty', message: requiredMessage },
            ]
            // eslint-disable-next-line vue/no-multi-spaces
          } | formatErrorMessages"
          :placeholder="placeholders.noteText"
          @input="$v.computedNoteText.$touch()"
          @blur="$v.computedNoteText.$touch()"
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
import {
  // pickBy,
  pipe,
  juxt,
  head,
  toUpper,
  tail,
  join,
  reduce,
  append
} from 'ramda'

import { isNilOrEmpty } from 'ramda-adjunct'
import { integer } from 'vuelidate/lib/validators'
import charactersWithName from '~/gql/charactersWithName.gql'
import moveProps from '~/moveProps'

const isNotNilOrEmpty = val => !isNilOrEmpty(val)

// const pruneNull = (obj) => {
//   return pickBy(val => val !== null, obj)
// }

const sentenceCase = pipe(juxt([pipe(head, toUpper), tail]), join(''))

export default {
  props: {
    ...moveProps,
    title: {
      type: String,
      required: true
    },
    completeButtonText: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      local: {
        name: null,
        startupFrames: null,
        onBlock: null,
        onHit: null,
        onCounterhit: null,
        buttonInput: null,
        noteText: null,
        characterName: null
      },
      dialog: false,
      characterNames: []
    }
  },

  validations: {
    computedName: {
      isNotNilOrEmpty
    },
    computedCharacterName: {
      isNotNilOrEmpty
    },
    computedStartupFrames: {
      isNotNilOrEmpty,
      integer
    },
    computedOnBlock: {
      isNotNilOrEmpty
    },
    computedOnHit: {
      isNotNilOrEmpty
    },
    computedOnCounterhit: {
      isNotNilOrEmpty
    },
    computedButtonInput: {
      isNotNilOrEmpty
    },
    computedNoteText: {
      isNotNilOrEmpty
    }
  },

  computed: {
    placeholders () {
      return {
        name: this.name || 'move name',
        // startupFrames: `${this.startupFrames}` || 'startup frames',
        startupFrames: this.startupFrames ? `${this.startupFrames}` : 'startup frames',
        onBlock: this.onBlock || 'frames or effect on block',
        onHit: this.onHit || 'frames or effect on hit',
        onCounterhit: this.onCounterhit || 'frames or effect on counter-hit',
        buttonInput: this.buttonInput || 'button input',
        noteText: this.noteText || 'notes',
        characterName: this.characterName || 'character'
      }
    },

    // characterNames () {
    //   return this.characters.character.map(x => x.name)
    // },

    computedName: {
      get () {
        return this.local.name || this.name || null
      },

      set (val) {
        this.local.name = val
      }
    },

    computedCharacterName: {
      get () {
        return this.local.characterName || this.characterName || null
      },

      set (val) {
        this.local.characterName = val
      }
    },

    computedStartupFrames: {
      get () {
        return this.local.startupFrames || this.startupFrames || null
      },

      set (val) {
        this.local.startupFrames = val
      }
    },

    computedOnBlock: {
      get () {
        return this.local.onBlock || this.onBlock || null
      },

      set (val) {
        this.local.onBlock = val
      }
    },

    computedOnHit: {
      get () {
        return this.local.onHit || this.onHit || null
      },

      set (val) {
        this.local.onHit = val
      }
    },

    computedOnCounterhit: {
      get () {
        return this.local.onCounterhit || this.onCounterhit || null
      },

      set (val) {
        this.local.onCounterhit = val
      }
    },

    computedButtonInput: {
      get () {
        return this.local.buttonInput || this.buttonInput || null
      },

      set (val) {
        this.local.buttonInput = val
      }
    },

    computedNoteText: {
      get () {
        return this.local.noteText || this.noteText || null
      },

      set (val) {
        this.local.noteText = val
      }
    },

    requiredMessage: () => sentenceCase('this field is required')
  },

  apollo: {
    characterNames: {
      query: charactersWithName,
      update: ({ character }) => character.map(x => x.name)
    }
  },

  watch: {
    dialog (newVal) {
      if (!newVal) {
        this.$v.$reset()
      }
    }
  },

  methods: {
    ...mapActions(['insertMove']),

    onInsertMove () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      this.dialog = false
      // const local = pruneNull(this.local)
      const move = {
        name: this.computedName,
        startupFrames: this.computedStartupFrames,
        onBlock: this.computedOnBlock,
        onHit: this.computedOnHit,
        onCounterhit: this.computedOnCounterhit,
        buttonInput: this.computedButtonInput,
        noteText: this.computedNoteText,
        characterName: this.computedCharacterName
      }

      if (this.id) {
        move.id = this.id
      }

      this.insertMove(move)
    }
  },

  // eslint-disable-next-line vue/order-in-components
  filters: {
    formatErrorMessages ({ validations, errorMessages }) {
      return reduce(
        (a, e) =>
          validations.$dirty && !validations[e.validationName]
            ? append(sentenceCase(e.message), a)
            : a,
        [],
        errorMessages
      )
    }
  }
}
</script>
