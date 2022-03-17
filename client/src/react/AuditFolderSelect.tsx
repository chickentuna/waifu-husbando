// import { basename } from 'path'
import React, { useEffect, useState } from 'react'
import {
  Link, Route, Switch, useRouteMatch
} from 'react-router-dom'
import io from '../socket'
import { Audit } from './Audit'
import ButtonList from './ButtonList'

export function AuditFolderSelect ({ sex }: {sex:string}) {
  const match = useRouteMatch()
  const [folders, setFolders] = useState([])

  useEffect(() => {
    io.emit('folders')
    io.once('folders', folders => setFolders(folders))
  }, [])

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:folder`}>
          <Audit sex={sex} />
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
