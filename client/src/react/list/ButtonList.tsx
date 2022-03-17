import React from 'react'
import './ButtonList.scss'
import ThingList from './ThingList'

export interface ButtonListProps {
  onClick?: (idx: number) => void
  options: {label: string}[]
}

function ButtonList ({ onClick, options }:ButtonListProps) {
  return (
    <div className='button-wrapper'>
      <ThingList
        options={options}
        render={(option, idx) => (
          <>
            <button
              key={idx}
              className='button'
              onClick={() => onClick?.(idx)}
            >
              {option}
            </button>
          </>
        )}
      />
    </div>
  )
}

export default React.memo(ButtonList)
