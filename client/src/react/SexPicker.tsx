import React from 'react'
import './SexPicker.scss'

export interface SexPickerProps {
  onClick: (sex:string) => void
  selected?: string
}

function SexPicker ({ onClick, selected }:SexPickerProps) {
  return (
    <div>
      {['girl', 'boy'].map((sex, i) => (
        <button
          key={i}
          className='sex-button'
          disabled={selected === sex}
          onClick={() => onClick(sex)}
        >
          {sex === 'girl' ? '♀' : '♂'}
        </button>
      ))}
    </div>
  )
}

export default React.memo(SexPicker)
