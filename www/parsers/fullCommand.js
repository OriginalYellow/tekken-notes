/* eslint-disable no-unused-expressions */
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import * as A from 'arcsecond'
// import consecutive from './scratch-019'
import consecutive from '../scratch/scratch-019'

const whitespaceSurrounded = parser =>
  A.between(A.optionalWhitespace)(A.optionalWhitespace)(parser)

const betweenParens = parser =>
  A.between(A.char('('))(A.char(')'))(parser)

const toTypedObj = type => val => ({ type, val })
const unnest2 = R.pipe(R.unnest, R.unnest)
const lastIsNull = R.pipe(R.last, RA.isNull)
const sepByOr = A.sepBy1(whitespaceSurrounded(A.str('or')))

const conditionString = terminator => stringOrArray => A.regex(new RegExp(
  `^${
  RA.isString(stringOrArray) ? stringOrArray : stringOrArray[0]
  }(?=${terminator})`,
  'i'
)).map(R.ifElse(
  R.always(RA.isString(stringOrArray)),
  R.identity,
  R.always(stringOrArray[1])
)).map(R.toLower)

const prefixConditionStrings = R.map(conditionString('\\s'))

const inputAtom = whitespaceSurrounded(
  A.sequenceOf([
    A.regex(/^[1234]/),
    A.lookAhead(A.choice([
      A.regex(/^\s*(?:[,+~(*]|or|$)/),
      A.endOfInput
    ]))
  ])
)
  .map(R.head)
  .map(toTypedObj('atom'))

const inputAtomOperator = A.char('+')
  .map(toTypedObj('operator'))

const inputMoleculeBody = A.sequenceOf([
  inputAtom,
  A.possibly(consecutive(A.sequenceOf([
    inputAtomOperator,
    inputAtom
  ]))),
  A.lookAhead(A.choice([
    A.regex(/^\s*(?:[(,~*]|or|$)/),
    A.endOfInput
  ]))
])
  .map(unnest2)
  .map(R.init)
  .map(R.ifElse(
    lastIsNull,
    R.init,
    R.identity
  ))

const inputMoleculePrefixCondition = A.possibly(A.choice(prefixConditionStrings([
  'when hit'
])))

const inputMoleculeSuffixCondition = A.possibly(whitespaceSurrounded(A.choice([
  A.char('*')
])))

const inputMolecule = A.namedSequenceOf([
  [
    'prefixCondition',
    inputMoleculePrefixCondition
  ],
  [
    'body',
    inputMoleculeBody
  ],
  [
    'suffixCondition',
    inputMoleculeSuffixCondition
  ]
]).map(toTypedObj('molecule'))

const inputMoleculeOperator = A.choice([
  whitespaceSurrounded(A.char(',')),
  whitespaceSurrounded(A.char('~'))
]).map(toTypedObj('operator'))

const inputMolecules = A.sequenceOf([
  inputMolecule,
  A.possibly(consecutive(A.sequenceOf([
    inputMoleculeOperator,
    inputMolecule
  ]))),
  A.lookAhead(A.choice([
    A.regex(/^\s*(?:or|[(]|$)/),
    A.endOfInput
  ]))
])
  .map(unnest2)
  .map(R.init)
  .map(R.ifElse(
    lastIsNull,
    R.init,
    R.identity
  ))

const stancePrefixCondition = A.choice(prefixConditionStrings([
  'dmn',
  'rss'
])).map(toTypedObj('stance'))

const otherPrefixCondition = A.choice(prefixConditionStrings([
  ['(in rage|rage|during rage)', 'rage'],
  'jump'
])).map(toTypedObj('other'))

const prefixCondition = whitespaceSurrounded(A.choice([
  stancePrefixCondition,
  otherPrefixCondition
]))

const prefixConditions = A.possibly(A.many(prefixCondition))

const suffixConditionStrings = R.map(conditionString('[)]'))

const getSuffixCondition = R.compose(
  A.possibly,
  whitespaceSurrounded,
  betweenParens,
  A.choice,
  suffixConditionStrings
)

const suffixCondition = getSuffixCondition([
  'cancel',
  'close',
  'far'
])

// const alternativeCommand = A.namedSequenceOf([
//   ['prefixConditions', prefixConditions.errorMap((x) => {
//     x // ?
//     return x
//   }).map((x) => {
//     x // ?
//     return x
//   })],
//   ['inputMolecules', inputMolecules.errorMap((x) => {
//     x // ?
//     return x
//   }).map((x) => {
//     x // ?
//     return x
//   })],
//   ['suffixCondition', suffixCondition.errorMap((x) => {
//     x // ?
//     return x
//   }).map((x) => {
//     x // ?
//     return x
//   })]
// ])

const alternativeCommand = A.namedSequenceOf([
  ['prefixConditions', prefixConditions],
  ['inputMolecules', inputMolecules],
  ['suffixCondition', suffixCondition]
])

const gotStringRegex = /got '(.*)(?='$)/
const indexStringRegex = /position (\d*)/

export const fullCommand = sepByOr(
  alternativeCommand
)
  .errorChain(({ error }) => {
    if (~error.substring('Expecting to match at least one separated value')) {
      return alternativeCommand
    }

    return A.fail(error)
  })
  .errorMap((error) => {
    const index = error.match(indexStringRegex) ? error.match(indexStringRegex)[1] : null

    if (~error.indexOf('but got end of input')) {
      return `expected more text at position ${index}`
    }

    const gotString = error.match(gotStringRegex) ? error.match(gotStringRegex)[1] : null
    return `"...${gotString}" at position ${index} is invalid`
  })

export default fullCommand
