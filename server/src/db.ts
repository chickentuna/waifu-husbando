import { setupMaster } from 'cluster'
import * as fs from 'fs'
import { Type } from './types'
import log from './webapp/log'

const dbFilePath = process.env.DB_FILE ?? 'db.json'

let db: any

class Accessor<T> {
  node:T

  constructor (node) {
    this.node = node
  }

  private get<V> (key: string, defaulter:() => V): Accessor<V> {
    if (this.node[key] === undefined) {
      this.node[key] = defaulter()
    }
    return new Accessor(this.node[key])
  }

  getObj (key:string): Accessor<object> {
    return this.get<object>(key, () => ({}))
  }

  getArray<V> (key:string): Accessor<V[]> {
    return this.get<V[]>(key, () => [])
  }

  get value ():T {
    return this.node
  }
}

function get () {
  return new Accessor<object>(db)
}

export function reload () {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, '{}')
  }
  db = JSON.parse(fs.readFileSync(dbFilePath).toString())
  log.debug('Image DB loaded')
}

function save () {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2))
}

export function moveUrl (url:string, fromFolder:string, type:Type, toFolder: string) {
  const array = get().getObj('images').getObj(fromFolder).getArray(type).value
  const idx = array.indexOf(url)
  array.splice(idx, 1)
  const destination = get().getObj('images').getObj(toFolder).getArray(type).value
  destination.push(url)
  save()
}

export function getUrls (selectedFolder: string, type: string): string[] {
  const arr = get().getObj('images').getObj(selectedFolder).getArray<string>(type).value
  if (arr != null) {
    return [...arr]
  }
  return null
}

export function getFolders (): string[] {
  return [...Object.keys(get().getObj('images').value)]
}

reload()
