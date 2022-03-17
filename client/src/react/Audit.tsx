import React, { useEffect, useState } from 'react'
import './Score.scss'
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
  const type = sex === 'boy' ? 'waifus' : 'husbandos'

  useEffect(() => {
    io.emit('audit', sex)
    io.on('audit', (imageCount) => {
      setImageCount(imageCount)
    })
  }, [sex])

  const ids = []
  for (let i = 0; i < imageCount; ++i) {
    ids.push(i)
  }

  console.log(ids)
  return (
    <div className='audit'>
      YO
      {ids.map(id => (
        <div className='audit_image-wrapper' key={id}>
          <div
            className='audit_image'
            style={{ backgroundImage: `url(img?type=${type}&id=${id})` }}
          />
        </div>
      ))}
    </div>
  )
}
