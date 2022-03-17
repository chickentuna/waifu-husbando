// import { basename } from 'path'
import React, { useEffect, useState } from 'react'
import {
  Link, Route, Switch, useRouteMatch
} from 'react-router-dom'
import io from '../socket'
import { Audit } from './Audit'
import ButtonList from './ButtonList'
import './Audit.scss'
import { sexToType } from './App'

export function AuditFolderSelect ({ sex }: {sex:string}) {
  const match = useRouteMatch()
  const [folders, setFolders] = useState([])

  useEffect(() => {
    io.emit('folders', true)
    io.once('folders', folders => setFolders(folders[sexToType(sex)]))
  }, [sex])

  return (
    <div className='folder-select'>
      <Switch>
        <Route path={`${match.path}/:folder`}>
          <Audit sex={sex} folders={folders} />
        </Route>
        <Route path={match.path}>
          <ButtonList options={
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
