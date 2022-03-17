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
import './Audit.scss'

export function AuditSelect () {
  const match = useRouteMatch()
  return (

    <div className='sex-select'>
      <Switch>
        <Route path={`${match.path}/boy`}>
          <AuditFolderSelect sex='boy' />
        </Route>
        <Route path={`${match.path}/girl`}>
          <AuditFolderSelect sex='girl' />
        </Route>
        <Route path={match.path}>
          <ButtonList options={
            [{
              label: '♂',
              link: `${match.url}/boy`
            },
            {
              label: '♀',
              link: `${match.url}/girl`
            }]
          }
          />
        </Route>
      </Switch>
    </div>
  )
}
