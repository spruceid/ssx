const { default: $JSDOMEnvironment, TestEnvironment } = require('jest-environment-jsdom')

Object.defineProperty(exports, '__esModule', {
  value: true,
})

class JSDOMEnvironment extends $JSDOMEnvironment {
  constructor(...args) {
    const { global } = super(...args)
    global.Uint8Array = Uint8Array
  }
}

exports.default = JSDOMEnvironment
exports.TestEnvironment = TestEnvironment === $JSDOMEnvironment ? JSDOMEnvironment : TestEnvironment