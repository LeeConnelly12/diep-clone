import './style.css'
import { io } from 'socket.io-client'

const form = <HTMLFormElement>document.getElementById('form')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const socket = io(import.meta.env.VITE_WEBSOCKET_URL)
})
