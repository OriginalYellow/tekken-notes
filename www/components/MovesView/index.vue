<template>
  <div>
    <move-list
      multiple
      :moves="moves"
    />
  </div>
</template>

<script>
import { lensPath, lensProp, into, compose, map, over, view, pipe, isEmpty, not } from 'ramda'
import { renameKeys } from 'ramda-adjunct'
import MoveList from './MoveList.vue'
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
    MoveList
  },

  data () {
    return {
      moves: [],
      addButtonStyle: {
        bottom: '20px'
      }
    }
  },

  // apollo: {
  //   moves: {
  //     query: latestMoves,
  //     update: getTransformedMoves
  //   }
  // }

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
