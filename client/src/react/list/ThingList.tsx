import React, { ReactNode } from 'react'
import './ThingList.scss'

export interface ThingListProps<T> {
  render: (option: T, idx: number) => ReactNode
  options: T[]
}

function ThingList<T> ({ render, options }:ThingListProps<T>) {
  return (
    <div className='list-wrapper'>
      {options.map((option, idx) => (
        <div key={idx} className='list-item'>
          {render(option, idx)}
        </div>
      ))}
    </div>
  )
}

export default ThingList
