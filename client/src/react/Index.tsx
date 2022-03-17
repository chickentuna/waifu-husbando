import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import App from './App'
import './App.scss'
import { AuditSelect } from './AuditSexSelect'

// Hack to redirect remove trailing slash from url
if (window.location.pathname.endsWith('/') && window.location.pathname !== '/') {
  window.location.pathname = window.location.pathname.slice(0, window.location.pathname.length - 1)
}
export function Index () {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/audit'>
            <AuditSelect />
          </Route>
          <Route path='/'>
            <App />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
