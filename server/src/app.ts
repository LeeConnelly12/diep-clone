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

const clients = new Map()

io.on('connection', (socket) => {
  socket.on('joined', (data) => {
    clients.set(socket, {
      id: socket.id,
      name: data.name,
    })

    io.to(socket.id).emit('players', [...clients.values()])

    socket.broadcast.emit('joined', {
      id: socket.id,
      name: data.name,
    })
  })

  socket.on('disconnect', () => {
    const client = clients.get(socket)

    socket.broadcast.emit('left', client)

    clients.delete(socket)
  })
})
