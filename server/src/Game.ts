import { Socket } from 'socket.io'
import { imgs } from './imgs'
import { shuffle } from './utils'
import * as fs from 'fs'

const JUDGE_COUNT = 10
const PICK_BEST_FROM = 3

export type Type = 'waifu' | 'husbando'

export type Pick = string[]

export class Game {
  boy: Socket
  girl: Socket
  picks: Record<Type, Pick[]>

  constructor (boy: Socket, girl: Socket) {
    this.boy = boy
    this.girl = girl
  }

  async logPicks (type, { choices }) {
    for (let idx = 0; idx < choices.length; ++idx) {
      const picksJSON = JSON.stringify(this.picks[type][idx])
      const picked = choices[idx]
      fs.appendFileSync(type + '.txt', picksJSON)
      fs.appendFileSync(type + '.txt', choices.toString())
    }
  }

  async init () {
    this.boy.on('spouseData', spouseData => {
      this.girl.emit('spouseData', spouseData)
      this.logPicks('waifu', spouseData)
    })
    this.girl.on('spouseData', spouseData => {
      this.boy.emit('spouseData', spouseData)
      this.logPicks('husbando', spouseData)
    })
    this.boy.on('spouseScore', spouseScore => {
      this.girl.emit('spouseScore', spouseScore)
    })
    this.girl.on('spouseScore', spouseScore => {
      this.boy.emit('spouseScore', spouseScore)
    })

    this.picks = {
      waifu: [],
      husbando: []
    }
    for (const type of ['waifu', 'husbando']) {
      const idxs = imgs[type].map((_, idx) => idx)
      shuffle(idxs)
      for (let i = 0; i < JUDGE_COUNT; ++i) {
        const pick: Pick = []
        for (let n = 0; n < PICK_BEST_FROM; ++n) {
          pick.push(idxs.pop())
        }
        this.picks[type].push(pick)
      }
    }
    this.boy.emit('picks', this.picks.waifu)
    this.girl.emit('picks', this.picks.husbando)
  }
}
