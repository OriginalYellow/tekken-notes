// import jsonFormat from 'json-format'
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import * as S from 'sanctuary'
import * as L from 'partial.lenses'
import * as Lenses from './lenses'
import * as U from './util'
// import { fullCommand } from './parser'
import {
  MOLECULE,
  OPERATOR,
  TEXT,
  IMAGE,
  PARTIAL_IMAGE,
  TEXT_WITH_PARENS,
  faceButtonRx,
  directionalButtonRx
} from './constants'

R.if = R.ifElse(R.__, R.__, R.identity)

const transformDirectionalButtonVal = R.pipe(
  R.prop('val'),
  R.replace('/', ''),
  R.if(
    S.test(/^[A-Z]*/),
    R.flip(R.concat)('-hold')
  )
)

const Model = {
  prefixCondition: U.ifNotNilOrEmpty(
    R.applySpec({
      type: R.always(TEXT),
      val: S.prop('val')
    })),

  suffixCondition: U.ifNotNilOrEmpty(
    U.toTypedObj(TEXT_WITH_PARENS)
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
      type: R.cond([
        [
          R.propSatisfies(S.test(directionalButtonRx), 'val'),
          R.always(IMAGE)
        ], [
          // MIKE: use R.any or R.or to make this more func-y:
          R.propSatisfies(x => S.test(faceButtonRx)(x) || (x === '+'), 'val'),
          R.always(PARTIAL_IMAGE)
        ]
      ]),
      val: R.cond([
        [
          R.propSatisfies(S.test(faceButtonRx), 'val'),
          R.prop('val')
        ], [
          R.propSatisfies(S.test(directionalButtonRx), 'val'),
          transformDirectionalButtonVal
        ], [
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

    // MIKE: make this pipe more func-y (and separate concerns better) by using
    // state during parsing to predetermine this condition instead:
    R.pipe(
      RA.reduceIndexed(
        (acc, el, i) => {
          if ((i === 0) && (el.val === 'plus')) {
            return acc
          }

          return R.concat(acc, R.prop('val', el))
        }, ''),
      R.if(
        RA.isNotNilOrEmpty,
        U.toTypedObj(IMAGE)
      )
    ))),

  R.flatten
)

export const compileFullCommandToProps = R.pipe(
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

  // MIKE: separate concerns better by creating these nodes during
  // parsing instead:
  R.intersperse({ type: IMAGE, val: 'or' }),

  R.flatten,
  R.filter(RA.isNotNilOrEmpty),
  combinePartialImages,
  R.filter(RA.isNotNilOrEmpty)
)

// const testCommand = 'jump in rage 1+2* or when hit f+d/f+4, 2 (close)'
// const testTree = fullCommand.run(testCommand).result
// const compiledTestTree = compileFullCommandToProps(testTree)

// testCommand // ?
// jsonFormat(testTree) // ?
// jsonFormat(compiledTestTree) // ?
