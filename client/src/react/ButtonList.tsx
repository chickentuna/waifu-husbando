import React from 'react'
import { Link } from 'react-router-dom'
import './ButtonList.scss'

export interface ButtonPropsList {
  onClick?: (idx: number) => void
  options: {label?: string, link?:string}[]
}

function ButtonList ({ onClick, options }:ButtonPropsList) {
  return (
    <div className='button-wrapper'>
      {options.map((option, idx) =>
        option.link != null ? (
          <Link
            key={idx}
            className='button'
            onClick={() => onClick?.(idx)}
            to={option.link}
          >
            {option.label}
          </Link>
        ) : (
          <button
            key={idx}
            className='button'
            onClick={() => onClick?.(idx)}
          >
            {option.label}
          </button>
        )
      )}
    </div>
  )
}

export default React.memo(ButtonList)
