import * as L from 'partial.lenses'
import {
  SUFFIX_CONDITION,
  PREFIX_CONDITION,
  PREFIX_CONDITIONS,
  INPUT_MOLECULES
} from './constants'

export const Model = {
  prefixConditions: [PREFIX_CONDITIONS, L.elems],
  suffixCondition: [SUFFIX_CONDITION],
  inputMolecules: [INPUT_MOLECULES, L.elems]
}

export const InputMolecule = {
  body: ['val', 'body', L.elems],
  prefixCondition: ['val', PREFIX_CONDITION],
  suffixCondition: ['val', SUFFIX_CONDITION]
}
