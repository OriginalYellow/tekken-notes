import * as L from 'partial.lenses'

export const Model = {
  prefixConditions: ['prefixConditions', L.elems],
  suffixCondition: ['suffixCondition'],
  inputMolecules: ['inputMolecules', L.elems]
}

export const InputMolecule = {
  body: ['val', 'body', L.elems],
  prefixCondition: ['val', 'prefixCondition'],
  suffixCondition: ['val', 'suffixCondition']
}
