import React from 'react'
import { CheckIcon, CheckState } from './CheckIcon'
import './Picker.scss'

export interface PickerProps {
  pick: string[]
  neither?: boolean
  curIdx: number
  total: number
  type: 'waifu' | 'husbando'
  pickLabel?: string
  neitherLabel?: string
  onPick: (idx: number) => void
  success?: (CheckState | null)[]
  disabled?: boolean
  folder: string
}
export function Picker ({
  pick,
  neither = false,
  curIdx,
  total,
  type,
  onPick,
  pickLabel = 'PICK',
  neitherLabel = 'NEITHER',
  success = [],
  disabled = false,
  folder
}: PickerProps) {
  return (
    <>
      <div className='counter'>{curIdx + 1}/{total}</div>
      <div className='image-list'>
        {pick.map((v, i) => (
          <div
            key={v}
            className='image-button-wrapper'
          >

            <div className='image-container'>
              <div
                className='image-background'
                style={{ backgroundImage: `url(${v})` }}
              />
              <img
                className='image'
                src={v}
              />
              <div className='check-container'>
                {success[i] != null && <CheckIcon state={success[i]} />}
              </div>
            </div>

            <button
              className='pick-button'
              onClick={() => onPick(i)}
              disabled={disabled}
            >
              {pickLabel}
            </button>
          </div>
        ))}
      </div>
      {neither && (
        <div>
          <button
            className='neither-button'
            onClick={() => onPick(-1)}
            disabled={disabled}
          >
            {neitherLabel}
          </button>
        </div>
      )}
    </>
  )
}
