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
        <v-card-actions class="pt-3">
          <!-- color="pink" -->
          <!-- @click="insertLike(id)" -->
          <v-btn
            :color="likeButton.color"
            dark
            depressed
            small
            @click="handleLikeClicked"
          >
            {{ likeButton.text }}
            <v-icon
              small
              right
            >
              mdi-heart
            </v-icon>
          </v-btn>

          <v-spacer />
          <v-btn
            outlined
            dark
            color="red"
            small
            @click="deleteMove(id)"
          >
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>

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
                class="ml-2"
                small
                v-on="on"
              >
                edit
                <v-icon
                  small
                  right
                >
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
          </move-input>
        </v-card-actions>
      </v-card>
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
    paragraphClass: () => ['mb-0'],

    likeButton () {
      if (this.liked) {
        return {
          color: 'pink',
          text: 'liked'
        }
      }

      return {
        color: 'grey',
        text: 'like'
      }
    }
  },

  methods: {
    ...mapActions(['deleteMove', 'insertLike', 'deleteLike']),

    handleLikeClicked () {
      if (this.liked) {
        this.deleteLike(this.id)
      } else {
        this.insertLike(this.id)
      }
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
