import React, { useEffect, useState } from 'react'
import './Audit.scss'
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom'
import io from '../socket'
import { Type } from './types'
import ButtonList from './ButtonList'

export interface AuditProps {
  sex: string
}

export function Audit ({ sex }: AuditProps) {
  const [imageCount, setImageCount] = useState(0)
  const [urls, setUrls] = useState([])
  const { folder } = useParams<{folder: string}>()

  const type:Type = sex === 'boy' ? 'waifu' : 'husbando'

  useEffect(() => {
    io.emit('audit', { sex, folder })
    io.on('audit', ({ urls, imgCount }) => {
      setImageCount(imgCount)
      setUrls(urls)
    })
    io.on('nextAudit', ({ imgCount, next }) => {
      setImageCount(imgCount)
      setUrls((urls) => [...urls, next])
    })
  }, [folder, sex])

  function handleAudit (url, index, rating) {
    io.emit('rate', { url, destination: rating.toString(), type })
    const newUrls = [...urls]
    newUrls.splice(index, 1)
    setUrls(newUrls)
    setImageCount(imageCount - 1)
  }

  const nopeEmoji = type === 'husbando' ? '🙅‍♀️' : '🙅‍♂️'

  // TODO: move to server side, we need full freedom on destination folders
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
            <ButtonList
              options={options}
              onClick={idx => handleAudit(url, auditIndex, idx)}
            />
          </div>
        ))}
      </div>
    </>
  )
}
