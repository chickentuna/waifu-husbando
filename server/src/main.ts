import log from './webapp/log'
import { io } from './webapp/app'
import { Game } from './Game'
import { Socket, Server } from 'socket.io'

let boy: Socket = null
let girl: Socket = null
const games = []

//TODO: fuck marry kill mode?

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

function configureSocketServer (io: Server) {
  io.on('connection', (socket: Socket) => {
    log.debug('user connected', { ip: socket.handshake.address })

    socket.on('disconnect', () => {
      log.debug('user disconnected', socket.handshake.address)
      if (boy === socket) {
        boy = null
      }
      if (girl === socket) {
        girl = null
      }
    })

    socket.on('boy', () => {
      if (girl === socket) {
        girl = null
      }
      if (boy == null) {
        console.log('boy')
        boy = socket
        checkStart()
      }
    })

    socket.on('girl', () => {
      if (boy === socket) {
        boy = null
      }
      if (girl == null) {
        console.log('girl')
        girl = socket
        checkStart()
      }
    })
  })
}

configureSocketServer(io)
