import { sexToType, shuffle } from './utils'
import { Socket } from 'socket.io'
import * as fs from 'fs'
import { Player, Type } from './types'
import { getUrls, logPick } from './db'

const JUDGE_COUNT = 10
const PICK_BEST_FROM = 3

const dummySocket = {
  on: () => {},
  emit: () => {}
} as any as Socket

const dummy: Player = {
  socket: dummySocket,
  selectedFolder: 'audit',
  solo: false
}

export type Pick = string[]

interface SpouseData {
  picks: string[][]
  choices: number[]
  folder: string
}

export class Game {
  boy: Player
  girl: Player
  picks: Record<Type, Pick[]>

  constructor (boy: Player, girl: Player) {
    this.boy = boy ?? dummy
    this.girl = girl ?? dummy
  }

  async init () {
    console.log('init')
    this.boy.socket.on('spouseData', (spouseData: SpouseData) => {
      this.girl.socket.emit('spouseData', spouseData)
      for (let i = 0; i < spouseData.picks.length; ++i) {
        const pick = spouseData.picks[i]
        const choice = spouseData.choices[i]
        logPick(sexToType('boy'), pick, choice, spouseData.folder)
      }
      if (this.boy.solo) {
        this.start()
      }
    })
    this.girl.socket.on('spouseData', (spouseData:SpouseData) => {
      this.boy.socket.emit('spouseData', spouseData)
      for (let i = 0; i < spouseData.picks.length; ++i) {
        const pick = spouseData.picks[i]
        const choice = spouseData.choices[i]
        logPick(sexToType('girl'), pick, choice, spouseData.folder)
      }
      if (this.girl.solo) {
        this.start()
      }
    })
    this.boy.socket.on('spouseScore', spouseScore => {
      this.girl.socket.emit('spouseScore', spouseScore)
    })
    this.girl.socket.on('spouseScore', spouseScore => {
      this.boy.socket.emit('spouseScore', spouseScore)
    })

    this.start()
  }

  start () {
    this.picks = {
      waifu: [],
      husbando: []
    }
    for (const { player, type } of [{ player: this.boy, type: 'waifu' }, { player: this.girl, type: 'husbando' }]) {
      const urls = getUrls(player.selectedFolder, type)
      shuffle(urls)
      for (let i = 0; i < JUDGE_COUNT; ++i) {
        const pick: Pick = []
        for (let n = 0; n < PICK_BEST_FROM; ++n) {
          pick.push(urls.pop() ?? getErrorUrl(type))
        }
        this.picks[type].push(pick)
      }
    }
    this.boy.socket.emit('picks', this.picks.waifu)
    this.girl.socket.emit('picks', this.picks.husbando)
  }
}
function getErrorUrl (type: string): string {
  return type === 'husbando' ? 'https://cdn130.picsart.com/291224346033201.jpg' : 'https://yt3.ggpht.com/ytc/AKedOLTZSv5NxjGySxgX4Qto4YPRhr4XM7_3Dk2DPGks=s900-c-k-c0x00ffffff-no-rj'
}
