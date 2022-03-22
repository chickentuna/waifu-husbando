import React from 'react'
import {
  Route, Switch, useRouteMatch
} from 'react-router-dom'
import './Audit.scss'
import { AuditFolderSelect } from './AuditFolderSelect'
import ButtonList from './components/list/ButtonList'
import LinkList from './components/list/LinkList'

export function AuditSelect () {
  const match = useRouteMatch()
  return (
    <div className='audit-content-parent'>
      <div className='sex-select'>
        <Switch>
          <Route path={`${match.path}/boy`}>
            <AuditFolderSelect sex='boy' />
          </Route>
          <Route path={`${match.path}/girl`}>
            <AuditFolderSelect sex='girl' />
          </Route>
          <Route path={match.path}>
            <LinkList options={
              [{
                label: 'Audit waifus',
                link: `${match.url}/boy`
              },
              {
                label: 'Audit husbandos',
                link: `${match.url}/girl`
              }]
            }
            />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
