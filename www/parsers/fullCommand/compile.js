import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import * as S from 'sanctuary'
import * as L from 'partial.lenses'
import * as Lenses from './lenses'
import * as U from './util'
import { inputAtomRegex, fullCommand } from './parser'
import {
  MOLECULE,
  OPERATOR,
  TEXT,
  IMAGE,
  PARTIAL_IMAGE
} from './types'

const Model = {
  prefixCondition: U.ifNotNilOrEmpty(
    R.applySpec({
      type: R.always(TEXT),
      val: S.prop('val')
    })),

  suffixCondition: U.ifNotNilOrEmpty(
    U.toTypedObj(TEXT)
  ),

  operator: R.applySpec({
    type: R.always(IMAGE),
    val: R.cond([
      [
        R.propEq('val', ','),
        R.always('comma')
      ], [
        R.propEq('val', '~'),
        R.always('tilde')
      ]])
  })
}

Model.prefixConditions = R.map(R.applySpec({
  type: R.always(TEXT),
  val: S.prop('val')
}))

const InputMolecule = {
  suffixCondition: U.ifNotNilOrEmpty(
    R.cond([
      [
        R.equals('*'),
        R.always({
          type: IMAGE,
          val: 'neutral'
        })
      ]
    ])
  ),

  body: R.map(
    R.applySpec({
      type: R.always(PARTIAL_IMAGE),
      val: R.cond([
        [
          R.propSatisfies(S.test(inputAtomRegex), 'val'),
          R.prop('val')
        ],
        [
          R.propEq('val', '+'),
          R.always('plus')
        ]])
    }))
}

Model.inputMolecules = R.map(
  R.cond([
    [
      R.propEq('type', MOLECULE),

      U.unfoldThunks([
        R.pipe(
          L.get(Lenses.InputMolecule.prefixCondition),
          Model.prefixCondition
        ),
        R.pipe(
          L.collect(Lenses.InputMolecule.body),
          InputMolecule.body
        ),
        R.pipe(
          L.get(Lenses.InputMolecule.suffixCondition),
          InputMolecule.suffixCondition)
      ])
    ], [
      R.propEq('type', OPERATOR),

      Model.operator
    ]]))

const combinePartialImages = R.pipe(
  R.groupWith(R.eqBy(R.propEq('type', PARTIAL_IMAGE))),
  R.map(R.if(
    R.any(R.propEq('type', PARTIAL_IMAGE)),
    R.pipe(
      R.reduce(
        (acc, el) => R.concat(acc, R.prop('val', el)),
        ''
      ),
      U.toTypedObj(IMAGE)
    ))),
  R.flatten
)

export const compile = R.pipe(
  R.map(U.unfoldThunks([
    R.pipe(
      L.collect(Lenses.Model.prefixConditions),
      Model.prefixConditions
    ),
    R.pipe(
      L.collect(Lenses.Model.inputMolecules),
      Model.inputMolecules
    ),
    R.pipe(
      L.get(Lenses.Model.suffixCondition),
      Model.suffixCondition)])),
  R.intersperse({ type: IMAGE, val: 'or' }),
  R.flatten,
  R.filter(RA.isNotNilOrEmpty),
  combinePartialImages
)

const testTree = fullCommand.run('jump in rage 1+2* or when hit 4, 2 (close)').result // ?
const testTree2 = fullCommand.run('1').result // ?

compile(testTree) // ?
compile(testTree2) // ?
