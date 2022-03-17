import React, { useEffect, useState } from 'react'
import './Audit.scss'
import io from '../socket'
import { Type } from './types'

export interface AuditProps {
  sex: string
}

const green = '#7ac142'
const red = '#ff6666'
const orange = '#ffd580'

export function Audit ({ sex }: AuditProps) {
  const [imageCount, setImageCount] = useState(0)
  const [imageIds, setImageIds] = useState([])

  const type:Type = sex === 'boy' ? 'waifu' : 'husbando'

  useEffect(() => {
    io.emit('audit', sex)
    io.on('audit', (imageCount) => {
      setImageCount(imageCount)
      const ids = []
      for (let i = 0; i < imageCount; ++i) {
        ids.push(i)
      }
      setImageIds(ids)
    })
  }, [sex])

  function handleAudit (id, index, rating) {
    io.emit('rate', { id, rating, type })
    const ids = [...imageIds]
    ids.splice(index, 1)
    setImageIds(ids)
    setImageCount(imageCount - 1)
  }

  const nopeEmoji = type === 'husbando' ? '🙅‍♀️' : '🙅‍♂️'

  const options = [
    { label: type === 'husbando' ? '🥵 Humanah' : '🥵 Bonjour madame' },
    { label: '💖 Hot' },
    { label: '🤗 Cute / 😐 Ineffective' },
    { label: `💩 Meh / ${nopeEmoji} Nope / 🐞 Error` }
  ]

  const MAX_ON_SCREEN = 20
  const block = imageIds.slice(0, MAX_ON_SCREEN)

  return (
    <><div className='audit_counter'>{imageCount} pics left</div>
      <div className='audit'>
        {block.map((id, auditIndex) => (
          <div className='audit_element' key={id}>
            <div className='audit_image-wrapper' key={id}>
              <div
                className='audit_image'
                style={{ backgroundImage: `url(img?type=${type}&id=${id}&folder=audit)` }}
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
    </>
  )
}
