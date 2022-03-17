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
  const [urls, setUrls] = useState([])

  const type:Type = sex === 'boy' ? 'waifu' : 'husbando'

  useEffect(() => {
    io.emit('audit', sex)
    io.on('audit', ({ urls, imgCount }) => {
      setImageCount(imgCount)
      setUrls(urls)
    })
    io.on('nextAudit', ({ imgCount, next }) => {
      setImageCount(imgCount)
      setUrls((urls) => [...urls, next])
    })
  }, [sex])

  function handleAudit (url, index, rating) {
    io.emit('rate', { url, rating, type })
    const newUrls = [...urls]
    newUrls.splice(index, 1)
    setUrls(newUrls)
    setImageCount(imageCount - 1)
  }

  const nopeEmoji = type === 'husbando' ? '🙅‍♀️' : '🙅‍♂️'

  const options = [
    { label: type === 'husbando' ? '🥵 Humanah' : '🥵 Bonjour madame' },
    { label: '💖 Hot' },
    { label: '🤗 Cute' },
    { label: '😐 Unappealing' },
    { label: `${nopeEmoji} Refuse / 🐞 Error` }
  ]

  function handleMouseMove (e:React.MouseEvent<HTMLImageElement, MouseEvent>) {
    const element = e.currentTarget
    const rect = element.getBoundingClientRect()
    const px = 100 * (e.clientX - rect.x) / rect.width
    const py = 100 * (e.clientY - rect.y) / rect.height
    element.style.objectPosition = `${px}% ${py}%`
  }

  function handleMouseOut (e:React.MouseEvent<HTMLImageElement, MouseEvent>) {
    const element = e.currentTarget
    element.style.objectPosition = '50% 50%'
  }

  return (
    <><div className='audit_counter'>{imageCount} pics left</div>
      <div className='audit'>
        {urls.map((url, auditIndex) => (
          <div className='audit_element' key={url}>
            <div
              className='audit_image-wrapper'
            >
              <div
                className='audit_image-background'
                style={{ backgroundImage: `url(${url})` }}
              />
              <img
                className='audit_image'
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseOut}
                src={url}
              />
            </div>
            <div className='audit_button-wrapper'>
              {options.map((option, ratingIdx) => (
                <button
                  key={ratingIdx}
                  className='audit_button'
                  onClick={() => handleAudit(url, auditIndex, ratingIdx)}
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
