<template>
  <v-layout>
    <v-flex
      xs12
      sm11
      md6
      class="py-5 px-3"
    >
      <p class="display-2">
        Newest Moves
      </p>
      <moves-view :moves="moves" />
    </v-flex>
  </v-layout>
</template>

<script>
import {
  lensPath,
  lensProp,
  into,
  compose,
  map,
  over,
  view,
  pipe
} from 'ramda'
import { renameKeys } from 'ramda-adjunct'
import MovesView from '~/components/MovesView'
import latestMoves from '~/gql/latestMoves.gql'

const Model = {
  moves: lensProp('move')
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
    map(over(Move.character, view(Character.portrait))),
    map(over(Move.likesAggregate, view(LikesAggregate.count))),
    map(
      renameKeys({
        likes_aggregate: 'likeCount',
        character: 'characterPortrait'
      })
    )
  )
)

const getTransformedMoves = pipe(view(Model.moves), transformMoves)

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
      query: latestMoves,
      variables: {
        // MIKE: this is kinda ghetto especially
        userId: this.$auth.user ? this.$auth.user.sub : ''
      },
      update: getTransformedMoves
    })
  }
}
</script>
