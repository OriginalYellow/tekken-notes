<template>
  <client-only>
    <v-app dark>
      <v-app-bar
        :clipped-left="clipped"
        fixed
        app
      >
        <v-toolbar-items>
          <!-- navigation buttons -->
          <v-btn
            :to="{ path: '/'}"
            text
            color="blue"
            nuxt
          >
            <span>home</span>
          </v-btn>

          <v-btn
            :to="{ path: '/mymoves'}"
            text
            color="blue"
            nuxt
          >
            <span>my moves</span>
          </v-btn>
        </v-toolbar-items>

        <v-spacer />

        <v-btn
          v-show="!$auth.loggedIn"
          color="blue"
          dark
          depressed
          @click="handleLogin"
        >
          log in/sign up
        </v-btn>

        <v-menu
          v-if="$auth.loggedIn"
          bottom
          left
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="blue"
              v-on="on"
            >
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title class="font-italic">
                logged in as {{ $auth.user ? $auth.user.name : '' }}
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click="handleLogout">
              <v-spacer />
              <v-list-item-title class="red--text">
                LOG OUT
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-content>
        <v-container>
          <nuxt />
        </v-container>
      </v-content>
    </v-app>
  </client-only>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      fixed: false
    }
  },

  beforeMount () {
    this.$auth.fetchUser()
  },

  methods: {
    handleLogin () {
      this.$apolloHelpers.onLogin()
        .then(() => {
          this.$auth.loginWith('auth0')
        })
    },

    handleLogout () {
      this.$apolloHelpers.onLogout()
        .then(() => {
          return this.$auth.logout()
        }).then(() => {
          window.location.replace(
          `https://tekken-notes-production.auth0.com/v2/logout?returnTo=${process.env.baseUrlEncoded}`
          )
        })
    }
  }
}
</script>
