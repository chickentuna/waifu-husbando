import * as fs from 'fs'

export const imgs = {
  waifu: fs.readdirSync('images/active/waifus/', { withFileTypes: true }).map(d => d.name),
  husbando: fs.readdirSync('images/active/husbandos/', { withFileTypes: true }).map(d => d.name)
}

export const toAudit = {
  waifu: fs.readdirSync('images/audit/waifus/', { withFileTypes: true }).map(d => d.name),
  husbando: fs.readdirSync('images/audit/husbandos/', { withFileTypes: true }).map(d => d.name)
}
