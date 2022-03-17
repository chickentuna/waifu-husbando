import React from 'react'
import './Score.scss'

export interface ScoreProps {
  points:number
  max: number
  sex: string
}
function asPercent (n: number, p: number): number {
  return Math.round(100 * n / p)
}

const green = '#7ac142'
const red = '#ff6666'
const orange = '#ffd580'

export function Score ({ points, max, sex }: ScoreProps) {
  const percent = asPercent(points, max)

  let color = red
  if (percent >= 50) {
    color = orange
  }
  if (percent >= 70) {
    color = green
  }

  const symbol = { girl: '♀', boy: '♂' }[sex]

  return (
    <div className={`score ${sex}`}>
      <span className='symbol'>{symbol}</span>
      SCORE: &nbsp;
      <span style={{ color }}>{percent}%</span>
    </div>
  )
}
