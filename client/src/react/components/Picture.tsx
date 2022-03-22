import React, { ReactNode } from 'react'
import './Picture.scss'

export interface PictureProps {
  url: string
  children?: ReactNode
}

export function Picture ({ url, children }: PictureProps) {
  function handleScroll (e:any) {
    console.log(e)
  }

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
    <div
      className='picture_image-wrapper'
      onScroll={handleScroll}
    >
      <div
        className='picture_image-background'
        style={{ backgroundImage: `url(${url})` }}
      />
      <img
        className='picture_image'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseOut}
        src={url}
      />
      {children != null && (
        <div className='picture_overlay'>
          {children}
        </div>
      )}
    </div>

  )
}
