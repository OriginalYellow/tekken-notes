import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import * as S from 'sanctuary'
import * as L from 'partial.lenses'
import * as Lens from './AltCommandLens'
import * as U from './util'
import {
  MOLECULE,
  OPERATOR,
  TEXT,
  IMAGE,
  PARTIAL_IMAGE,
  MULTIPLE_IMAGES,
  TEXT_WITH_PARENS,
  ALT_COMMAND_OPERATOR,
  faceButtonRx,
  directionalButtonRx,
  multipleImagesTypeRx
} from './constants'

R.if = R.ifElse(R.__, R.__, R.identity)

const omitMaybesAndFlatten = R.pipe(
  R.flatten,
  R.filter(RA.isNotNilOrEmpty)
)

const transformDirectionalButtonVal = R.pipe(
  R.prop('val'),
  R.replace('/', ''),
  R.if(
    S.test(/^[A-Z]+/),
    R.flip(R.concat)('-hold')
  )
)

const InputMolecule = {
  prefixCondition: U.ifNotNilOrEmpty(
    R.applySpec({
      type: R.always(TEXT),
      val: S.prop('val')
    })),

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
  }),

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
        ], [
          R.propSatisfies(S.test(multipleImagesTypeRx), 'val'),
          R.always(MULTIPLE_IMAGES)
        ], [
          R.T,
          R.always(TEXT)
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
        ], [
          R.propEq('val', 'qcb'),
          R.always(['d', 'db', 'b'])
        ], [
          R.propEq('val', 'hcb'),
          R.always(['f', 'df', 'd', 'db', 'b'])
        ], [
          R.propEq('val', 'qcf'),
          R.always(['d', 'df', 'f'])
        ], [
          R.propEq('val', 'hcf'),
          R.always(['b', 'db', 'd', 'df', 'f'])
        ], [
          R.T,
          R.prop('val')
        ]])
    }))
}

const Body = {
  suffixCondition: U.ifNotNilOrEmpty(
    U.toTypedObj(TEXT_WITH_PARENS, 'val')
  ),

  prefixConditions: R.map(R.applySpec({
    type: R.always(TEXT),
    val: S.prop('val')
  })),

  inputMolecules: R.map(
    R.cond([
      [
        R.propEq('type', MOLECULE),

        U.unfoldThunks([
          R.pipe(
            L.get(Lens.InputMolecule.prefixCondition),
            InputMolecule.prefixCondition
          ),
          R.pipe(
            L.collect(Lens.InputMolecule.body),
            InputMolecule.body
          ),
          R.pipe(
            L.get(Lens.InputMolecule.suffixCondition),
            InputMolecule.suffixCondition)
        ])
      ], [
        R.propEq('type', OPERATOR),

        InputMolecule.operator
      ]]))
}

const AltCommand = {
  body: U.unfoldThunks([
    R.ifElse(
      R.prop('first'),
      RA.noop,
      R.always({ type: ALT_COMMAND_OPERATOR, val: 'or' })
    ),
    R.pipe(
      L.collect([Lens.Model.body, Lens.Body.prefixConditions]),
      Body.prefixConditions
    ),
    R.pipe(
      L.collect([Lens.Model.body, Lens.Body.inputMolecules]),
      Body.inputMolecules
    ),
    R.pipe(
      L.get([Lens.Model.body, Lens.Body.suffixCondition]),
      Body.suffixCondition)
  ])
}

const combinePartialImages = R.pipe(
  R.groupWith(R.eqBy(R.propEq('type', PARTIAL_IMAGE))),
  R.map(R.if(
    R.any(R.propEq('type', PARTIAL_IMAGE)),

    // MIKE: make this pipe more func-y (and separate concerns better) by using
    // state during parsing to predetermine the condition instead:
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
        U.toTypedObj(IMAGE, 'val')
      )
    )))
)

export const compileToProps = R.pipe(
  R.map(AltCommand.body),
  omitMaybesAndFlatten,
  combinePartialImages,
  omitMaybesAndFlatten
)
