import Vue from 'vue'
// import * as V from 'partial.lenses.validation'
import * as validators from '~/validators'

Vue.use({
  install: (vue) => {
    vue.prototype.$validators = validators
  }
})
