// import { basename } from 'path'
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from 'react-router-dom'
import { AuditFolderSelect } from './AuditFolderSelect'
import ButtonList from './ButtonList'

export function AuditSelect () {
  const match = useRouteMatch()
  return (

    <div>
      <Switch>
        <Route path={`${match.path}/boy`}>
          <AuditFolderSelect sex='boy' />
        </Route>
        <Route path={`${match.path}/girl`}>
          <AuditFolderSelect sex='girl' />
        </Route>
        <Route path={match.path}>
          <ButtonList options={
            ['boy', 'girl'].map(s => ({
              label: s,
              link: `${match.url}/${s}`
            }))
          }
          />
        </Route>
      </Switch>
    </div>
  )
}
