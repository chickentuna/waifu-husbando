import * as fs from 'fs'

// convert '*.png[800x>]' -set filename:base "%[basename]" "%[filename:base].png"

export type ImageFolder = {
  waifu: string[]
  husbando: string[]
}

export const images: Record<string, ImageFolder> = {}

export function makeDirs (...folders: string[]) {
  for (const folder of folders) {
    for (const type of ['waifu', 'husbando']) {
      const path = `images/${folder}/${type}s`
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
      }
    }
  }
}

const mandatoryFolders = ['audit', '0', '1', '2', '3']
const customFolders: string[] = []

export function refresh () {
  fs.readdirSync('images', { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => !mandatoryFolders.includes(d.name))
    .map(d => d.name)
    .forEach(d => customFolders.push(d))

  makeDirs(...mandatoryFolders, ...customFolders)

  for (const folder of [...mandatoryFolders, ...customFolders]) {
    images[folder] = images[folder] ?? {
      waifu: [],
      husbando: []
    }
    for (const type of ['waifu', 'husbando']) {
      images[folder][type].splice(0, images[folder][type].length)
      fs.readdirSync(`images/${folder}/${type}s/`, { withFileTypes: true })
        .map(d => d.name)
        .forEach(d => images[folder][type].push(d))
    }
  }
}

refresh()
