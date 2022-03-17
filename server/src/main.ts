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

const MAX_URLS_TO_SEND = 20

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
        boy = { socket, selectedFolder }
        checkStart()
      }
    })

    socket.on('girl', (selectedFolder) => {
      if (boy?.socket === socket) {
        boy = null
      }
      if (girl == null) {
        girl = { socket, selectedFolder }
        checkStart()
      }
    })

    socket.on('audit', ({ sex, folder }: {sex: string, folder: string}) => {
      const urls = getUrls(folder, sexToType(sex))
      socket.emit('audit', {
        urls: urls.slice(0, MAX_URLS_TO_SEND),
        imgCount: urls.length
      })
    })

    socket.on('rate', ({ type, url, destination, folder }: {url: string, destination:string, type: Type, folder:string}) => {
      if (destination === 'skip') {
        moveUrl(url, folder, type, folder) // Go to back of the queue
      } else {
        moveUrl(url, folder, type, destination)
      }

      const newUrls = getUrls(folder, type)
      const next = newUrls[MAX_URLS_TO_SEND - 1]
      if (next != null) {
        socket.emit('nextAudit', { next, imgCount: newUrls.length })
      }
    })

    socket.on('folders', (full) => {
      const folders = getFolders()

      let waifuFolders = folders.filter(key => getUrls(key, 'waifu') != null)
      let husbandoFolders = folders.filter(key => getUrls(key, 'husbando') != null)

      if (!full) {
        waifuFolders = waifuFolders.filter(key => getUrls(key, 'waifu').length > 0)
        husbandoFolders = husbandoFolders.filter(key => getUrls(key, 'husbando').length > 0)
      }

      socket.emit('folders', { waifu: waifuFolders, husbando: husbandoFolders })
    })
  })
}

configureSocketServer(io)
