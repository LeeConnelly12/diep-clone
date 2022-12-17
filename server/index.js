import dotenv from 'dotenv'
import Websocket, { WebSocketServer } from 'ws'
import http from 'http'

const wsServer = new WebSocketServer({ noServer: true })

const clients = new Map()

wsServer.on('connection', (socket, req) => {
  socket.on('message', (data) => {
    const json = JSON.parse(data)

    // Joined game
    if (json.type === 'joined') {
      if (!nameIsValid(json.name)) {
        return
      }

      clients.set(socket, {
        id: json.id,
        name: json.name,
        x: json.x,
        y: json.y,
        angle: json.angle,
      })

      wsServer.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'joined',
              players: [...clients.values()],
            }),
          )
        }
      })
    }

    // Moved
    if (json.type === 'moved') {
      const metadata = clients.get(socket)

      wsServer.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          if (client !== socket && client.readyState === Websocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'moved',
                player: {
                  id: metadata.id,
                  name: json.name,
                  x: json.x,
                  y: json.y,
                  angle: json.angle,
                },
              }),
            )
          }
        }
      })
    }

    // Moved mouse
    if (json.type === 'mouseMoved') {
      const metadata = clients.get(socket)

      wsServer.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          if (client !== socket && client.readyState === Websocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'movedMouse',
                player: {
                  id: metadata.id,
                  angle: json.angle,
                },
              }),
            )
          }
        }
      })
    }
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

function nameIsValid(name) {
  if (name === null) {
    return false
  }

  if (/[^a-zA-Z0-9]/.test(name)) {
    return false
  }

  return true
}
