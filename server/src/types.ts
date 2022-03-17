import { Socket } from 'socket.io'

export type Type = 'waifu' | 'husbando'

export type Player = {
  socket: Socket
  selectedFolder: string
  solo: boolean
}
