import io from 'socket.io-client'

const port = process.env.PORT || 3000

const socket = io(`:${port}`, {
  transports: ['websocket']
})
socket.on('connect', (...args) => {
  console.log('connect', ...args)
})

socket.on('disconnect', () => {
  console.log('disconnect')
})

export default socket
