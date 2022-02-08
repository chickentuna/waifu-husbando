import React from 'react'
import { CheckIcon, CheckState } from './CheckIcon'
import './Picker.scss'

export interface PickerProps {
  pick: number[]
  neither?: boolean
  curIdx: number
  total: number
  type: 'waifu' | 'husbando'
  pickLabel?: string
  neitherLabel?: string
  onPick: (idx: number) => void
  onDelete?: (idx: number) => void
  success?: (CheckState | null)[]
  disabled?: boolean
}
export function Picker ({
  pick,
  neither = false,
  curIdx,
  total,
  type,
  onPick,
  onDelete,
  pickLabel = 'PICK',
  neitherLabel = 'NEITHER',
  success = [],
  disabled = false
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
            <div
              className='image'
              style={{ backgroundImage: `url(img?type=${type}&id=${v})` }}
            >
              {success[i] != null && <CheckIcon state={success[i]} />}
            </div>
            <button
              className='pick-button'
              onClick={() => onPick(i)}
              disabled={disabled}
            >
              {pickLabel}
            </button>
            
            {onDelete && (
              <div>
            <button
              className='delete-button'
              onClick={() => onDelete(i)}
              disabled={disabled}
            >
              DELETE
            </button>
            </div>
            )}
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
