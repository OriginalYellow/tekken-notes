module.exports = (wallaby) => {
  // const compiler = wallaby.compilers.babel({ presets: [['@vue/app', { modules: 'commonjs' }]] })
  const compiler = wallaby.compilers.babel({
    presets: [['@babel/preset-env', { modules: 'commonjs' }]]
  })

  return {
    files: ['jest.config.js', 'package.json', 'scratch/**/*.js'],

    tests: ['__tests__/**/*.spec.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.js': compiler
      // '**/*.vue': require('wallaby-vue-compiler')(compiler)
    },

    // preprocessors: {
    //   '**/*.vue': file => require('vue-jest').process(file.content, file.path, require('./package').jest || require('./jest.config'))
    // },

    // setup (wallaby) {
    //   const jestConfig = require('./package').jest || require('./jest.config')
    //   jestConfig.transform = {}
    //   wallaby.testFramework.configure(jestConfig)
    // },

    testFramework: 'jest'
  }
}
