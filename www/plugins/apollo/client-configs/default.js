export default function (context) {
  return {
    httpEndpoint: process.env.HASURA_ENDPOINT || 'http://localhost:8080/v1/graphql',
    getAuth: () => {
      // NOTE: if getAuth returns a falsy value, no "authorization" header is
      // sent at all
      const storedToken = localStorage.getItem('auth._token.auth0')
      return storedToken === 'false' ? false : storedToken
    },
    httpLinkOptions: {
      credentials: 'same-origin'
    },
    persisting: false, // Optional
    websocketsOnly: false // Optional
  }
}
