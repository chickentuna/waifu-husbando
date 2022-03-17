import log from './webapp/log'
import { io } from './webapp/app'
import { Game } from './Game'
import { Socket, Server } from 'socket.io'
import { refresh, images, refreshed } from './imgs'
import * as fs from 'fs'
import { Player, Type } from './types'

let boy: Player = null
let girl: Player = null
const games = []
const toAudit = images.audit

// TODO: fuck marry kill mode?

// TODO: scrape https://danbooru.donmai.us/posts?tags=mn_%28zig_r14%29&z=1

// TODO: scrape google image "sexy anime boy" and some keyhole bra maid stuff while i'm there

function checkStart () {
  if (boy != null && girl != null) {
    log.info('Game start')
    refresh()
    const game = new Game(boy, girl)
    games.push(game)
    game.init()
    boy = null
    girl = null
  }
}

function configureSocketServer (io: Server) {
  io.on('connection', (socket: Socket) => {
    log.debug('user connected', { ip: socket.handshake.address })

    socket.on('disconnect', () => {
      log.debug('user disconnected', socket.handshake.address)
      if (boy?.socket === socket) {
        boy = null
      }
      if (girl?.socket === socket) {
        girl = null
      }
    })

    socket.on('boy', (selectedFolder) => {
      if (girl?.socket === socket) {
        girl = null
      }
      if (boy == null) {
        console.log('boy')
        boy = { socket, selectedFolder }
        checkStart()
      }
    })

    socket.on('girl', (selectedFolder) => {
      if (boy?.socket === socket) {
        boy = null
      }
      if (girl == null) {
        console.log('girl')
        girl = { socket, selectedFolder }
        checkStart()
      }
    })

    socket.on('audit', (sex: string) => {
      refresh()
      const imgCount = toAudit[sex === 'boy' ? 'waifu' : 'husbando'].length
      socket.emit('audit', {
        imgCount,
        index: refreshed.index
      })
    })

    socket.on('rate', ({ type, id, rating, refreshIdx }: {id: number, rating:number, type: Type, refreshIdx:number}) => {
      if (refreshIdx !== refreshed.index) {
        socket.emit('refresh')
      } else {
        const source = toAudit[type]
        fs.renameSync(`images/audit/${type}s/${source[id]}`, `images/${rating}/${type}s/${source[id]}`)
      }
    })

    socket.emit('folders', Object.keys(images).filter(key => images[key].waifu.length > 0 || images[key].husbando.length > 0))
  })
}

configureSocketServer(io)
