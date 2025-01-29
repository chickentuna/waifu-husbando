import React, { useEffect, useState } from 'react'
import {
  Link, Route, Switch, useRouteMatch
} from 'react-router-dom'
import io from '../socket'
import { Audit } from './Audit'
import ButtonList from './components/list/ButtonList'
import './Audit.scss'
import { sexToType } from './App'
import LinkList from './components/list/LinkList'

export function AuditFolderSelect ({ sex }: {sex:string}) {
  const match = useRouteMatch()
  const [folders, setFolders] = useState([])

  useEffect(() => {
    io.emit('folders', false)
    io.once('folders', folders => setFolders(folders[sexToType(sex)].filter(f => !f.startsWith('_')))
  }, [sex])

  return (
    <div className='folder-select'>
      <Switch>
        <Route path={`${match.path}/:folder`}>
          <Audit sex={sex} />
        </Route>
        <Route path={match.path}>
          <LinkList options={
            folders.map(folder => ({
              label: folder,
              link: `${match.url}/${folder}`
            }))
          }
          />
        </Route>
      </Switch>
    </div>
  )
}
