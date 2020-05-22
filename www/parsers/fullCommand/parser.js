/* eslint-disable func-call-spacing */
/* eslint-disable no-unused-expressions */
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import * as A from 'arcsecond'
import consecutive from './consecutive'
import * as U from './util'
import {
  ATOM,
  MOLECULE,
  OPERATOR,
  PREFIX_CONDITION,
  STANCE_CONDITION,
  OTHER_CONDITION
} from './types'

R.if = R.ifElse(R.__, R.__, R.identity)

export const inputAtomRegex = /^[1234]/
const inputAtomTerminatorRegex = /^\s*(?:[,+~(*]|or|$)/
const inputMoleculeBodyTerminatorRegex = /^\s*(?:[(,~*]|or|$)/
const inputMoleculesTerminatorRegex = /^\s*(?:or|[(]|$)/
const alternativeCommandTerminatorRegex = /^\s*(?=or)/
const gotStringRegex = /got '(.*)(?='$)/
const indexStringRegex = /position (\d*)/

const whitespaceSurrounded = parser =>
  A.between(A.optionalWhitespace)(A.optionalWhitespace)(parser)

const betweenParens = parser =>
  A.between(A.char('('))(A.char(')'))(parser)

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
    A.regex(inputAtomRegex),
    A.lookAhead(A.choice([
      A.regex(inputAtomTerminatorRegex),
      A.endOfInput
    ]))
  ])
)
  .map(R.head)
  .map(U.toTypedObj(ATOM))

const inputAtomOperator = A.char('+')
  .map(U.toTypedObj(OPERATOR))

const inputMoleculeBody = A.sequenceOf([
  inputAtom,
  A.possibly(consecutive(A.sequenceOf([
    inputAtomOperator,
    inputAtom
  ]))),
  A.lookAhead(A.choice([
    A.regex(inputMoleculeBodyTerminatorRegex),
    A.endOfInput
  ]))
])
  .map(RA.flattenDepth(2))
  .map(R.init)
  .map(R.if(
    U.lastIsNull,
    R.init
  ))

const inputMoleculePrefixCondition = A.possibly(A.choice(prefixConditionStrings([
  'when hit'
])).map(U.toTypedObj(PREFIX_CONDITION)))

const inputMoleculeSuffixCondition = A.possibly(whitespaceSurrounded(A.choice([
  A.char('*')
])))

const inputMolecule = A.namedSequenceOf([
  [
    PREFIX_CONDITION,
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
]).map(U.toTypedObj(MOLECULE))

const inputMoleculeOperator = A.choice([
  whitespaceSurrounded(A.char(',')),
  whitespaceSurrounded(A.char('~'))
]).map(U.toTypedObj(OPERATOR))

const inputMolecules = A.sequenceOf([
  inputMolecule,
  A.possibly(consecutive(A.sequenceOf([
    inputMoleculeOperator,
    inputMolecule
  ]))),
  A.lookAhead(A.choice([
    A.regex(inputMoleculesTerminatorRegex),
    A.endOfInput
  ]))
])
  .map(RA.flattenDepth(2))
  .map(R.init)
  .map(R.if(
    U.lastIsNull,
    R.init
  ))

const stancePrefixCondition = A.choice(prefixConditionStrings([
  'dmn',
  'rss'
])).map(U.toTypedObj(STANCE_CONDITION))

const otherPrefixCondition = A.choice(prefixConditionStrings([
  ['(in rage|rage|during rage)', 'rage'],
  'jump'
])).map(U.toTypedObj(OTHER_CONDITION))

const prefixCondition = whitespaceSurrounded(A.choice([
  stancePrefixCondition,
  otherPrefixCondition
]))

const prefixConditions = A.possibly(A.many(prefixCondition))

const suffixConditionStrings = R.map(conditionString('[)]'))

const getSuffixCondition = R.compose(
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

const alternativeCommand = A.namedSequenceOf([
  ['prefixConditions', prefixConditions],
  ['inputMolecules', inputMolecules],
  [
    'suffixCondition',
    A.choice([
      suffixCondition,
      A.endOfInput,
      A.regex(alternativeCommandTerminatorRegex)
    ]).map(R.if(
      RA.isNilOrEmpty,
      R.always(null)
    ))
  ]
])

export const fullCommand = sepByOr(
  alternativeCommand
)
  .errorChain(({ error }) => {
    if (~error.indexOf('Expecting to match at least one separated value')) {
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
