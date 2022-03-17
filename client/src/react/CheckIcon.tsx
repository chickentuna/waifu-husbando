import React from 'react'
import './CheckIcon.scss'

export type CheckState = 'true' | 'false' | 'n/a'

export interface CheckIconProps {
  state?: CheckState
  small?: boolean
}

export function CheckIcon ({ state = 'true', small = false }: CheckIconProps) {
  return state === 'true' ? (
    <div className='icon-wrapper'>
      <svg className={`checkmark ${small && 'small'}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'>
        <circle className='checkmark_circle' cx='26' cy='26' r='25' fill='none' />
        <path className='checkmark_check' fill='none' d='M14.1 27.2l7.1 7.2 16.7-16.8' />
      </svg>
    </div>
  ) : (
    <div className={`icon-wrapper ${state === 'n/a' ? 'neutral' : 'fail'}`}>
      <svg className={`checkmark ${small && 'small'}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'>
        <circle className='checkmark_circle' cx='26' cy='26' r='25' fill='none' />
        <path className='checkmark_check' fill='none' d='M14.1 14.1l23.8 23.8 m0,-23.8 l-23.8,23.8' />
      </svg>
    </div>
  )
}
