<template>
  <client-only>
    <v-app dark>
      <v-app-bar
        :clipped-left="clipped"
        fixed
        app
      >
        <v-toolbar-title v-show="$auth.loggedIn">
          {{ $auth.user ? $auth.user.name : '' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          v-show="!$auth.loggedIn"
          color="blue"
          dark
          depressed
          @click="$auth.loginWith('auth0')"
        >
          login
        </v-btn>
        <v-btn
          v-show="$auth.loggedIn"
          color="blue"
          dark
          depressed
          @click="handleLogout"
        >
          logout
        </v-btn>
      </v-app-bar>
      <v-content>
        <v-container>
          <nuxt />
        </v-container>
      </v-content>
      <v-footer
        :fixed="fixed"
        app
      >
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
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
    handleLogout () {
      this.$auth.logout().then(() => {
        window.location.replace(
          `https://tekken-notes-production.auth0.com/v2/logout?returnTo=${process.env.baseUrlEncoded}`
        )
      })
    }
  }
}
</script>
