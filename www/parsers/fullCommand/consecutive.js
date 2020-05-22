/* eslint-disable no-unused-vars */
import { Parser, parse, str, regex, letters } from 'arcsecond'

//    updateResult :: (ParserState e a s, b) -> ParserState e b s
const updateResult = (state, result) => ({ ...state, result })

export default function consecutive (parser) {
  return new Parser(function sequenceOf$state (state) {
    if (state.isError) { return state }

    const results = []
    let nextState = state

    while (true) {
      const out = parser.p(nextState)

      if (out.isError) {
        break
      } else {
        nextState = out
        results.push(nextState.result)

        if (nextState.index >= nextState.target.length) {
          break
        }
      }
    }

    return updateResult(nextState, results)
  })
}

consecutive(str('abc')).run('abcabc') // ?
consecutive(str('abc')).run('abcabcab') // ?
consecutive(str('abc')).run('abcabc1abc') // ?
