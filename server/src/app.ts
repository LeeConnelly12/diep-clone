import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const port = Number(process.env.WEBSOCKET_PORT)

const origin = process.env.ALLOWED_ORIGIN

const io = new Server(port, {
  cors: {
    origin: origin,
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('user connected')
})
