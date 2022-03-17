import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ThingList from './ThingList'
import './LinkList.scss'

interface ListParam {
  label: string
  link: string
}

export interface LinkListProps {
  options: ListParam[]
}

function LinkList ({ options }:LinkListProps) {
  return (
    <ThingList
      options={options}
      render={(option, idx) => (
        <Link
          key={idx}
          className='button-link-wrapper'
          to={option.link}
          style={{ textDecoration: 'none' }}
        >
          <button
            key={idx}
            className='button-in-link'
          >
            {option.label}
          </button>
        </Link>
      )}
    />
  )
}

export default React.memo(LinkList)
