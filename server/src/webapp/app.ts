import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import http from 'http'
import socketIo from 'socket.io'

import accessLog from './accessLog'
import errorLog from './errorLog'
import log from './log'
import mime from 'mime-types'
import * as fs from 'fs'
import { images } from '../imgs'
import serve from 'koa-static'

const app = new Koa()

app.use(cors())
app.use(accessLog)
app.use(errorHandler)
app.use(bodyParser())
app.use(serve('../client/build'))

app.on('error', errorLog)

const server = http.createServer(app.callback())
const io = socketIo(server)
const port = process.env.PORT || 3000

server.listen(port, () => {
  log.info('Application started')
  log.info(`└── Listening on port: ${port}`)
})

app.use(ctx => {
  if (ctx.request.path === '/img') {
    const id = +ctx.request.query.id
    const type = ctx.request.query.type
    const folder = ctx.request.query.folder

    const source = images[folder][type]
    if (source != null) {
      const path = `images/${folder}/${type}s/${source[id]}`
      const mimeType = mime.lookup(path)
      if (fs.existsSync(path)) {
        const src = fs.createReadStream(path)
        ctx.response.set('content-type', mimeType)
        ctx.body = src
      }
    }
  }
})

async function errorHandler (ctx: Koa.Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (error) {
    ctx.status = 500
    ctx.response.body = error.message
    ctx.app.emit('error', error, ctx)
  }
}

export { io }
