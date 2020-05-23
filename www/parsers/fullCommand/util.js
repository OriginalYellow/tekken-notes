import * as R from 'ramda'
import * as RA from 'ramda-adjunct'

// export const toTypedObj = type => val => ({ type, val })
export const toTypedObj = R.curry((type, valProp, val) => ({ type, [valProp]: val }))
export const lastIsNull = R.pipe(R.last, RA.isNull)
export const ifNotNilOrEmpty = R.ifElse(RA.isNotNilOrEmpty, R.__, R.identity)

export const thunkReduce = R.curry((init, interate, functs, arg) => {
  return functs.reduce((acc, funct) => {
    return interate(funct(arg), acc)
  }, init)
})

export const unfoldThunks = thunkReduce([], (val, acc) => R.append(val, acc))

// ==========================================================================================

// const testRegex = /(toTypedObj\()(.*(?=\)))/
// // $1$2, 'val'

// // testRegex.exec('U.toTypedObjTEXT_WITH_PARENS)'fuglord) // ?
// testRegex.exec('U.toTypedObj(TEXT_WITH_PARENS, 'val') // ?

// const TEXT_WITH_PARENS = 'text with parens'

// toTypedObj(TEXT_WITH_PARENS, 'val', 'val')
