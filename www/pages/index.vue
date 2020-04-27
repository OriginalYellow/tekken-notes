<template>
  <v-layout>
    <v-flex
      xs12
      sm8
      md6
      class="py-5 px-3"
    >
      <p class="display-2">
        My Moves
      </p>
      <p v-show="!$auth.loggedIn">
        login or sign up to see your moves and add new ones
      </p>
      <moves-view
        v-show="$auth.loggedIn"
        :moves="moves"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { lensPath, lensProp, into, compose, map, over, view, pipe, isEmpty, not } from 'ramda'
import { renameKeys } from 'ramda-adjunct'
import MovesView from '~/components/MovesView'
import userWithMoves from '~/gql/userWithMoves.gql'

const Model = {
  moves: lensPath(['user', 0, 'moves'])
}

const Move = {
  likesAggregate: lensPath(['likes_aggregate']),
  character: lensProp('character'),
  likes: lensProp('likes')
}

const LikesAggregate = {
  count: lensPath(['aggregate', 'count'])
}

const Character = {
  portrait: lensProp('portrait')
}

const intoArray = into([])

const transformMoves = intoArray(
  compose(
    map(over(
      Move.character,
      view(Character.portrait)
    )),
    map(over(
      Move.likesAggregate,
      view(LikesAggregate.count)
    )),
    map(over(
      Move.likes,
      compose(not, isEmpty)
    )),
    map(renameKeys({
      likes_aggregate: 'likeCount',
      character: 'characterPortrait',
      likes: 'liked'
    }))))

const getTransformedMoves = pipe(
  view(Model.moves),
  transformMoves
)

export default {
  components: {
    MovesView
  },

  data () {
    return {
      moves: []
    }
  },

  // MIKE: this is kinda ghetto
  created () {
    this.$apollo.addSmartQuery('moves', {
      query: userWithMoves,
      variables: {
        // MIKE: this is kinda ghetto especially
        userId: this.$auth.user ? this.$auth.user.sub : ''
      },
      update: getTransformedMoves
    })
  }

  // apollo: {
  //   moves: {
  //     query: userWithMoves,
  //     update: getTransformedMoves
  //   }
  // }
}
</script>
