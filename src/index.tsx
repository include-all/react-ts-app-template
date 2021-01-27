import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(<App name='张三' age={18} />, document.querySelector('#root'))
