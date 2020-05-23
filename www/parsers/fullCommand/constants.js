// parser types:
export const ATOM = 'atom'
export const MOLECULE = 'molecule'
export const OPERATOR = 'operator'
export const SUFFIX_CONDITION = 'suffix condition'
export const PREFIX_CONDITION = 'prefix condition'
export const PREFIX_CONDITIONS = 'prefix conditions'
export const STANCE_CONDITION = 'stance condition'
export const OTHER_CONDITION = 'other condition'
export const INPUT_MOLECULES = 'input molecules'
export const ALT_COMMAND = 'alt command'
export const ALT_COMMAND_OPERATOR = 'alt command operator'

// compiler types:
export const TEXT = 'text'
export const TEXT_WITH_PARENS = 'text with parens'
export const IMAGE = 'image'
export const PARTIAL_IMAGE = 'partialImage'

// strings used for matching:
export const MOLECULE_PREFIX_CONDITION_STRINGS = [
  'when hit'
]

export const OTHER_ALT_COMMAND_PREFIX_CONDITION_STRINGS = [
  ['(in rage|rage|during rage)', 'rage'],
  'jump'
]

export const STANCE_PREFIX_CONDITION_STRINGS = [
  'dmn',
  'rss'
]

export const ALT_COMMAND_SUFFIX_CONDITION_STRINGS = [
  'cancel',
  'close',
  'far'
]

// regular expressions:
export const inputAtomRx = /^([1234]|u\/b|u\/f|d\/b|d\/f|u|d|b|f|U\/B|U\/F|D\/B|D\/F|U|D|B|F)/
export const faceButtonRx = /^[1234]/
export const directionalButtonRx = /^(u\/b|u\/f|d\/b|d\/f|u|d|b|f|U\/B|U\/F|D\/B|D\/F|U|D|B|F)/
export const inputAtomTerminatorRx = /^\s*(?:[,+~(*]|or|$)/
export const inputMoleculeBodyTerminatorRx = /^\s*(?:[(,~*]|or|$)/
export const inputMoleculesTerminatorRx = /^\s*(?:or|[(]|$)/
export const altCommandTerminatorRx = /^\s*(?=or)/
export const gotStringRx = /got '(.*)(?='$)/
export const indexStringRx = /position (\d*)/
