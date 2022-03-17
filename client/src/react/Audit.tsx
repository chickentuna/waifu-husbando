import React, { useEffect, useState } from 'react'
import './Audit.scss'
import io from '../socket'

export type Type = 'waifu' | 'husbando'

export interface AuditProps {
  sex: string
}

const green = '#7ac142'
const red = '#ff6666'
const orange = '#ffd580'

export function Audit ({ sex }: AuditProps) {
  const [imageCount, setImageCount] = useState(0)
  const [imageIds, setImageIds] = useState([])

  const type = sex === 'boy' ? 'waifu' : 'husbando'

  const complete = []

  useEffect(() => {
    io.emit('audit', sex)
    io.on('audit', (imageCount) => {
      setImageCount(imageCount)
      const ids = []
      for (let i = 0; i < Math.min(imageCount, 20); ++i) {
        ids.push(i)
      }
      setImageIds(ids)
    })
  }, [sex])

  function handleAudit (id, index, rating) {
    io.emit('rate', { id, rating })
    const ids = [...imageIds]
    ids.splice(index, 1)
    setImageIds(ids)
  }

  const options = [
    { label: '🥵 Humanah' },
    { label: '💖 Hot' },
    { label: '🤗 Nice' },
    { label: '💩 Meh/Nope/Error' }
  ]

  const MAX_ON_SCREEN = 20
  const block = imageIds.slice(0, MAX_ON_SCREEN)

  return (
    <div className='audit'>
      {block.map((id, auditIndex) => (
        <div className='audit_element' key={id}>
          <div className='audit_image-wrapper' key={id}>
            <div
              className='audit_image'
              style={{ backgroundImage: `url(img?type=${type}&id=${id}&audit=true)` }}
            />
          </div>
          <div className='audit_button-wrapper'>
            {options.map((option, ratingIdx) => (
              <button
                key={ratingIdx}
                className='audit_button'
                onClick={() => handleAudit(id, auditIndex, ratingIdx)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
