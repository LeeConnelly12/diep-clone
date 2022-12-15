import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)

socket.addEventListener('open', (event) => {
  socket.send('Hello Server!')
})

createApp(App).mount('#app')
