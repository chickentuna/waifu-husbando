import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import io from '../socket'
import './Audit.scss'
import ButtonList from './components/list/ButtonList'
import { Picture } from './components/Picture'
import { Type } from './types'
import { sexToType } from './utils'

export interface AuditProps {
  sex: string
}

export function Audit ({ sex }: AuditProps) {
  const [imageCount, setImageCount] = useState(0)
  const [urls, setUrls] = useState([])
  const [folders, setFolders] = useState([])
  const { folder } = useParams<{folder: string}>()

  useEffect(() => {
    io.emit('folders', true)
    io.once('folders', folders => setFolders(folders[sexToType(sex)]))
  }, [sex])

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

  const options = [{ label: 'skip' }, ...folders.filter(name => name !== folder).map(name => ({ label: name }))]

  function handleAudit (url, index, rating) {
    const destination = options[rating]?.label ?? 'skip'
    io.emit('rate', { url, destination, type, folder })
    const newUrls = [...urls]
    newUrls.splice(index, 1)
    setUrls(newUrls)
    setImageCount(imageCount - 1)
  }

  return (
    <>
      <div className='audit_counter'>{imageCount} pics left</div>
      <div className='audit'>
        {urls.map((url, auditIndex) => (
          <div className='audit_element' key={url}>
            <div className='audit_image-container'>
              <Picture url={url} />
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
