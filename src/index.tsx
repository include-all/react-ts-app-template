import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app'
import store from './store'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
)
