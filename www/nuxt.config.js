export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env: {
    baseUrlEncoded: process.env.BASE_URL_ENCODED || 'http%3A%2F%2Flocalhost:3000%2F'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/vuelidate.js',
    { src: '~plugins/partial.lenses.validation.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    '@nuxtjs/auth'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false
    }
  },
  auth: {
    resetOnError: true,
    redirect: {
      login: '/',
      // logout: '/',
      callback: '/',
      home: '/'
    },
    strategies: {
      auth0: {
        domain: 'tekken-notes-production.auth0.com',
        client_id: 'oxvawDM5qVP7PR85CnPp75Ea9mK11wdh',
        audience: 'https://tekken-notes-production.auth0.com/api/v2/'
      }
    }
  },
  apollo: {
    // tokenName: 'auth._token.auth0',
    includeNodeModules: true,
    authenticationType: '',
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-first'
      }
    },
    errorHandler: '~/plugins/apollo/apollo-error-handler.js',
    clientConfigs: {
      default: '~/plugins/apollo/client-configs/default.js'
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
    // transpile: [
    //   ({ isClient }) => isClient && 'partial.lenses.validation'
    //   // 'partial.lenses.validation'
    // ],
    babel: {
      plugins: [
        '@babel/plugin-proposal-export-default-from'
      ]
    }
  }
}
