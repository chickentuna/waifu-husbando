import * as fs from 'fs'

export const imgs = {
  waifu: fs.readdirSync('images/waifus/', { withFileTypes: true }).map(d => d.name),
  husbando: fs.readdirSync('images/husbandos/', { withFileTypes: true }).map(d => d.name)
}
