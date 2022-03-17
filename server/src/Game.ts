import { Socket } from 'socket.io'
import { images } from './imgs'
import { shuffle } from './utils'
import * as fs from 'fs'
import { Player, Type } from './types'

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

  async logPicks (type, { choices }) {
    for (let idx = 0; idx < choices.length; ++idx) {
      const picksJSON = JSON.stringify(this.picks[type][idx])
      const picked = choices[idx]
      fs.appendFileSync(type + '.txt', picksJSON)
      fs.appendFileSync(type + '.txt', choices.toString()) // TODO: continue this thing
    }
  }

  async init () {
    this.boy.socket.on('spouseData', spouseData => {
      this.girl.socket.emit('spouseData', spouseData)
      this.logPicks('waifu', spouseData)
    })
    this.girl.socket.on('spouseData', spouseData => {
      this.boy.socket.emit('spouseData', spouseData)
      this.logPicks('husbando', spouseData)
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
      const idxs = images[player.selectedFolder][type].map((_, idx) => idx)
      shuffle(idxs)
      for (let i = 0; i < JUDGE_COUNT; ++i) {
        const pick: Pick = []
        for (let n = 0; n < PICK_BEST_FROM; ++n) {
          pick.push(idxs.pop())
        }
        this.picks[type].push(pick)
      }
    }
    this.boy.socket.emit('picks', this.picks.waifu)
    this.girl.socket.emit('picks', this.picks.husbando)
  }
}
