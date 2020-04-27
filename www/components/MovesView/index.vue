<template>
  <div>
    <move-input
      title="Add a new move"
      complete-button-text="add"
    >
      <template v-slot:asdf="{ on }">
        <v-btn
          dark
          absolute
          bottom
          right
          fab
          color="green"
          :style="addButtonStyle"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </move-input>
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
import MoveInput from './MoveInput.vue'
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
    MoveList,
    MoveInput
  },

  // props: {
  //   moves: {
  //     type: Array,
  //     default: () => []
  //   }
  // },

  data () {
    return {
      moves: [],
      addButtonStyle: {
        bottom: '20px'
      }
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
