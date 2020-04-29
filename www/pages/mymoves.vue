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
      <my-moves-view v-if="$auth.loggedIn" :moves="moves" />
    </v-flex>
  </v-layout>
</template>

<script>
import { lensPath, lensProp, into, compose, map, over, view, pipe } from 'ramda'
import { renameKeys } from 'ramda-adjunct'
import MyMovesView from '~/components/MyMovesView'
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
    map(renameKeys({
      likes_aggregate: 'likeCount',
      character: 'characterPortrait'
    }))))

const getTransformedMoves = pipe(
  view(Model.moves),
  transformMoves
)

export default {
  components: {
    MyMovesView
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
}
</script>
