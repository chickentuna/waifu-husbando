import log from './webapp/log'
import { io } from './webapp/app'
import { Game } from './Game'
import { Socket, Server } from 'socket.io'
import * as fs from 'fs'
import { Player, Type } from './types'
import { getFolders, getUrls, moveUrl, reload } from './db'
import { sexToType } from './utils'

let boy: Player = null
let girl: Player = null
const games = []

// TODO: scrape https://danbooru.donmai.us/posts?tags=mn_%28zig_r14%29&z=1
// TODO: scrape google image "sexy anime boy" and some keyhole bra maid stuff while i'm there

function checkStart () {
  if (boy != null && girl != null) {
    log.info('Game start')
    const game = new Game(boy, girl)
    games.push(game)
    game.init()
    boy = null
    girl = null
  }
}

const activeConnections = new Set()

function configureSocketServer (io: Server) {
  io.on('connection', (socket: Socket) => {
    if (activeConnections.size === 0) {
      reload()
    }

    log.debug('user connected', { ip: socket.handshake.address })
    activeConnections.add(socket.id)

    socket.on('disconnect', () => {
      log.debug('user disconnected', socket.handshake.address)
      activeConnections.delete(socket.id)

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
      const urls = getUrls('audit', sexToType(sex))
      socket.emit('audit', {
        urls: urls.slice(0, 20),
        imgCount: urls.length
      })
    })

    socket.on('rate', ({ type, url, rating }: {url: string, rating:number, type: Type}) => {
      moveUrl(url, 'audit', type, rating.toString())
      const newUrls = getUrls('audit', type)
      const next = newUrls[19]
      if (next != null) {
        socket.emit('nextAudit', { next, imgCount: newUrls.length })
      }
    })

    const folders = getFolders()
    socket.emit('folders', folders.filter(key => getUrls(key, 'waifu').length > 0 || getUrls(key, 'husbando').length > 0))
  })
}

configureSocketServer(io)
