import { pipe, not } from 'ramda'
import { isString, isNumber, isSafeInteger, isNotNil, isNotNilOrEmpty, isNilOrEmpty, isNotArray } from 'ramda-adjunct'
import { both, either, props, validate } from 'partial.lenses.validation/src/partial.lenses.validation.js'

const Messages = {
  isString: 'value is not a string',
  isNumber: 'value is not a number',
  isSafeInteger: 'value is not a safe integer',
  isNotNil: 'value is nil',
  isNilOrEmpty: 'value is not nil',
  isNotArray: 'value is an array',
  isNotNilOrEmpty: 'value is nil or empty',
  isNil: 'value is not nil'
}

const Rules = {
  isString: [isString, Messages.isString],
  isNumber: [isNumber, Messages.isNumber],
  isSafeInteger: [isSafeInteger, Messages.isSafeInteger],
  isNotNil: [isNotNil, Messages.isNotNil],
  isNilOrEmpty: [isNilOrEmpty, Messages.isNilOrEmpty],
  isNotNilOrEmpty: [isNotNilOrEmpty, Messages.isNotNilOrEmpty],
  isNotArray: [isNotArray, Messages.isNotArray],
  isNil: [
    pipe(
      isNotNil,
      not),
    Messages.isNil
  ]
}

Rules.isNotEmptyString = both(
  Rules.isString,
  Rules.isNotNilOrEmpty
)

Rules.isNilOrString = either(
  Rules.isNilOrEmpty,
  Rules.isString
)

const moveRules = props({
  name: Rules.isNotEmptyString,
  startupFrames: Rules.isSafeInteger,
  onBlock: Rules.isNotEmptyString,
  onHit: Rules.isNotEmptyString,
  onCounterhit: Rules.isNotEmptyString,
  buttonInput: Rules.isNotEmptyString,
  noteText: Rules.isNilOrString,
  id: Rules.isSafeInteger
})

export default validate(moveRules)
