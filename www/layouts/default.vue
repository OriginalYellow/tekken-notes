<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-if="$auth.loggedIn">
        {{ $auth.user.name }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="!$auth.loggedIn"
        color="blue"
        dark
        @click="$auth.loginWith('auth0')"
      >
        login
      </v-btn>
      <v-btn
        v-else
        color="blue"
        dark
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
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },

  beforeMount () {
    this.$auth.fetchUser()
  },

  methods: {
    handleLogout () {
      this.$auth.logout().then(() => {
        window.location.replace('https://tekken-notes-production.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost:3000%2F')
      })
    }
  }
}
</script>
