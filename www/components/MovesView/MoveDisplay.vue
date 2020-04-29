<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="title">
      <v-row
        class="mr-5"
        no-gutters
      >
        <v-col :cols="$vuetify.breakpoint.xsOnly ? 11 : 8">
          <p :class="[...paragraphClass, 'text-left']">
            {{ `${name}&nbsp;&nbsp;` }}
            <span class="body-1">—</span>
            {{ '&nbsp;' }}
            <span class="body-2 font-italic">{{ likeCount }} {{ likeCount == 1 ? 'like' : 'likes' }}</span>
          </p>
        </v-col>
        <v-col :cols="$vuetify.breakpoint.xsOnly ? 1 : 4">
          <div class="d-flex align-end flex-column">
            <v-avatar
              v-if="$vuetify.breakpoint.xsOnly"
              size="35"
            >
              <v-img :src="characterPortrait" />
            </v-avatar>

            <v-chip
              v-else
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
        </v-card-actions>
      </v-card>
    </v-expansion-panel-content>
    <v-snackbar
      v-model="snackbar"
      :timeout="10000"
    >
      log in or sign up to like moves
      <v-btn
        color="red"
        outlined
        @click="snackbar = false"
      >
        close
      </v-btn>

      <v-btn
        color="blue"
        depressed
        dark
        @click="$auth.loginWith('auth0')"
      >
        log in/sign up
      </v-btn>
    </v-snackbar>
  </v-expansion-panel>
</template>

<script>
import { mapActions } from 'vuex'
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

  data () {
    return {
      snackbar: false
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
    ...mapActions(['insertLike', 'deleteLike']),

    handleLikeClicked () {
      if (!this.$auth.loggedIn) {
        this.snackbar = true
        return
      }

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
