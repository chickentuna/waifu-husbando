import React from 'react'
import './SexPicker.scss'

export interface SexPickerProps {
  onClick: (sex:string) => void
  selected?: string
  disabled?: boolean
}

function SexPicker ({ onClick, selected, disabled }:SexPickerProps) {
  return (
    <div>
      {['girl', 'boy'].map((sex, i) => (
        <button
          key={i}
          className='sex-button'
          disabled={selected === sex || disabled}
          onClick={() => onClick(sex)}
        >
          {sex === 'girl' ? '♀' : '♂'}
        </button>
      ))}
    </div>
  )
}

export default React.memo(SexPicker)
