import dotenv from 'dotenv'
import Websocket, { WebSocketServer } from 'ws'
import http from 'http'
import { randomUUID } from 'crypto'

const wsServer = new WebSocketServer({ noServer: true })

const clients = new Map()

wsServer.on('connection', (socket, req) => {
  clients.set(socket, {
    id: randomUUID(),
    name: null,
  })

  socket.on('message', (data) => {
    const json = JSON.parse(data)

    const metadata = clients.get(socket)
    metadata.name = json.name

    wsServer.clients.forEach((client) => {
      if (client.readyState === Websocket.OPEN) {
        client.send(
          JSON.stringify({
            players: [...clients.values()],
          }),
        )
      }
    })
  })

  socket.on('close', () => {
    clients.delete(socket)

    wsServer.clients.forEach((client) => {
      if (client.readyState === Websocket.OPEN) {
        client.send(
          JSON.stringify({
            players: [...clients.values()],
          }),
        )
      }
    })
  })
})

dotenv.config()

const server = http.createServer()

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request)
  })
})

server.listen(process.env.PORT)
