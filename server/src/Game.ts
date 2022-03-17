import { shuffle } from './utils'
import * as fs from 'fs'
import { Player, Type } from './types'
import { getUrls } from './db'

const JUDGE_COUNT = 10
const PICK_BEST_FROM = 3

export type Pick = string[]

export class Game {
  boy: Player
  girl: Player
  picks: Record<Type, Pick[]>

  constructor (boy: Player, girl: Player) {
    this.boy = boy
    this.girl = girl
  }

  async init () {
    this.boy.socket.on('spouseData', spouseData => {
      this.girl.socket.emit('spouseData', spouseData)
    })
    this.girl.socket.on('spouseData', spouseData => {
      this.boy.socket.emit('spouseData', spouseData)
    })
    this.boy.socket.on('spouseScore', spouseScore => {
      this.girl.socket.emit('spouseScore', spouseScore)
    })
    this.girl.socket.on('spouseScore', spouseScore => {
      this.boy.socket.emit('spouseScore', spouseScore)
    })

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
