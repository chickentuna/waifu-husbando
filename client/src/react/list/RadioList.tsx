import React, { ReactNode } from 'react'
import ThingList from './ThingList'
import './RadioList.scss'

export interface RadioListOption {
  label: string
  value: string
}

export interface RadioListProps {
  options: RadioListOption[]
  disabled: boolean
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
  isChecked: (option:RadioListOption) => boolean
}

function RadioList ({ options, isChecked, onChange, disabled }:RadioListProps) {
  return (
    <ThingList
      options={options}
      render={(option, idx) => (
        <label
          key={option.label}
          htmlFor={`folder_${idx}`}
          className='radio-option'
        >
          <input
            className='radio-input'
            disabled={disabled}
            id={`folder_${idx}`}
            type='radio'
            value={option.value}
            checked={isChecked(option)}
            onChange={onChange}
          />
          {option.label}
        </label>
      )}
    />
  )
}

export default React.memo(RadioList)
