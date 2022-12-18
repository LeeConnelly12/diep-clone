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
        radius: json.radius,
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

      if (!metadata) {
        socket.close()
      }

      clients.set(socket, {
        id: metadata.id,
        name: json.name,
        x: json.x,
        y: json.y,
        angle: json.angle,
        radius: json.radius,
      })

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
                  radius: json.radius,
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

      if (!metadata) {
        socket.close()
      }

      clients.set(socket, {
        id: metadata.id,
        name: json.name,
        x: json.x,
        y: json.y,
        angle: json.angle,
        radius: json.radius,
      })

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

    // Bullet shot
    if (json.type === 'shoot') {
      wsServer.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          if (client !== socket && client.readyState === Websocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'shoot',
                bullet: {
                  id: json.id,
                  x: json.x,
                  y: json.y,
                  dx: json.dx,
                  dy: json.dy,
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
            type: 'left',
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
