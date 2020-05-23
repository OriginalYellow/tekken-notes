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
  SUFFIX_CONDITION,
  PREFIX_CONDITION,
  ALT_COMMAND,
  PREFIX_CONDITIONS,
  STANCE_CONDITION,
  OTHER_CONDITION,
  INPUT_MOLECULES,
  inputAtomRx,
  inputAtomTerminatorRx,
  inputMoleculeBodyTerminatorRx,
  inputMoleculesTerminatorRx,
  altCommandTerminatorRx,
  gotStringRx,
  indexStringRx,
  MOLECULE_PREFIX_CONDITION_STRINGS,
  OTHER_ALT_COMMAND_PREFIX_CONDITION_STRINGS,
  STANCE_PREFIX_CONDITION_STRINGS,
  ALT_COMMAND_SUFFIX_CONDITION_STRINGS
} from './constants'

R.if = R.ifElse(R.__, R.__, R.identity)

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
    A.regex(inputAtomRx),
    A.lookAhead(A.choice([
      A.regex(inputAtomTerminatorRx),
      A.endOfInput
    ]))
  ])
)
  .map(R.head)
  .map(U.toTypedObj(ATOM, 'val'))

const inputAtomOperator = A.char('+')
  .map(U.toTypedObj(OPERATOR, 'val'))

const inputMoleculeBody = A.sequenceOf([
  inputAtom,
  A.possibly(consecutive(A.sequenceOf([
    inputAtomOperator,
    inputAtom
  ]))),
  A.lookAhead(A.choice([
    A.regex(inputMoleculeBodyTerminatorRx),
    A.endOfInput
  ]))
])
  .map(RA.flattenDepth(2))
  .map(R.init)
  .map(R.if(
    U.lastIsNull,
    R.init
  ))

const inputMoleculePrefixCondition = A.possibly(A.choice(prefixConditionStrings(
  MOLECULE_PREFIX_CONDITION_STRINGS
)).map(U.toTypedObj(PREFIX_CONDITION, 'val')))

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
    SUFFIX_CONDITION,
    inputMoleculeSuffixCondition
  ]
]).map(U.toTypedObj(MOLECULE, 'val'))

const inputMoleculeOperator = A.choice([
  whitespaceSurrounded(A.char(',')),
  whitespaceSurrounded(A.char('~'))
]).map(U.toTypedObj(OPERATOR, 'val'))

const inputMolecules = A.sequenceOf([
  inputMolecule,
  A.possibly(consecutive(A.sequenceOf([
    inputMoleculeOperator,
    inputMolecule
  ]))),
  A.lookAhead(A.choice([
    A.regex(inputMoleculesTerminatorRx),
    A.endOfInput
  ]))
])
  .map(RA.flattenDepth(2))
  .map(R.init)
  .map(R.if(
    U.lastIsNull,
    R.init
  ))

const stancePrefixCondition = A.choice(prefixConditionStrings(
  STANCE_PREFIX_CONDITION_STRINGS
)).map(U.toTypedObj(STANCE_CONDITION, 'val'))

const otherPrefixCondition = A.choice(prefixConditionStrings(
  OTHER_ALT_COMMAND_PREFIX_CONDITION_STRINGS
)).map(U.toTypedObj(OTHER_CONDITION, 'val'))

const altCommandPrefixCondition = whitespaceSurrounded(A.choice([
  stancePrefixCondition,
  otherPrefixCondition
]))

const altCommandPrefixConditions = A.possibly(A.many(altCommandPrefixCondition))

const getAltCommandSuffixCondition = R.compose(
  whitespaceSurrounded,
  betweenParens,
  A.choice,
  R.map(conditionString('[)]'))
)

const altCommandSuffixCondition = getAltCommandSuffixCondition(
  ALT_COMMAND_SUFFIX_CONDITION_STRINGS
)

const altCommand = A.namedSequenceOf([
  [PREFIX_CONDITIONS, altCommandPrefixConditions],
  [INPUT_MOLECULES, inputMolecules],
  [
    SUFFIX_CONDITION,
    A.choice([
      altCommandSuffixCondition,
      A.endOfInput,
      A.regex(altCommandTerminatorRx)
    ]).map(R.if(
      RA.isNilOrEmpty,
      R.always(null)
    ))
  ]
])

const transformError = (error) => {
  const index = error.match(indexStringRx) ? error.match(indexStringRx)[1] : null

  if (~error.indexOf('but got end of input')) {
    return `expected more text at position ${index}`
  }

  const gotString = error.match(gotStringRx) ? error.match(gotStringRx)[1] : null
  return `"...${gotString}" at position ${index} is invalid`
}

const recoverFromError = ({ error }) => {
  if (~error.indexOf('Expecting to match at least one separated value')) {
    return altCommand
  }

  return A.fail(error)
}

export const fullCommand = sepByOr(
  altCommand
)
  .map(R.map(R.pipe(
    U.toTypedObj(ALT_COMMAND, 'body'),
    R.assoc('first', false)
  )))
  .map(R.adjust(0, R.assoc('first', true)))
  .errorChain(recoverFromError)
  .errorMap(transformError)

export const parse = A.parse(fullCommand)
