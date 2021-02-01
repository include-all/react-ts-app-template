import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'

import routerConfig from './router-config'

const WrapRoute = () => (
  <Router>
    <Suspense fallback={<div>loading</div>}>
      <Switch>
        {routerConfig.router.map((router) => (
          <Route key={router.path} path={router.path} exact={router.exact} component={lazy(router.component)} />
        ))}
      </Switch>
    </Suspense>
  </Router>
)

export default WrapRoute
