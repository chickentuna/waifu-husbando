import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './ButtonList.scss'

export interface ButtonPropsList {
  onClick?: (idx: number) => void
  options: {label?: string, link?:string}[]
}

function ButtonList ({ onClick, options }:ButtonPropsList) {
  function wrap (node:ReactNode, idx: number, link?:string):ReactNode {
    return link ? (
      <Link
        key={idx}
        className='button-link-wrapper'
        to={link}
        style={{ textDecoration: 'none' }}
      >
        {node}
      </Link>
    ) : node
  }

  return (
    <div className='button-wrapper'>
      {options.map((option, idx) =>
        wrap((
          <button
            key={idx}
            className='button'
            onClick={() => onClick?.(idx)}
          >
            {option.label}
          </button>
        ), idx, option.link)
      )}
    </div>
  )
}

export default React.memo(ButtonList)
