import { createServer } from 'https'
import fs from 'fs'
import dotenv from 'dotenv'
import Websocket, { WebSocketServer } from 'ws'

dotenv.config()

const hostname = process.env.HOSTNAME
const port = process.env.PORT

const server = createServer({
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
})

const wsServer = new WebSocketServer({ server: server })

const players = new Map()

wsServer.on('connection', (socket, req) => {
  socket.on('message', (data) => {
    const json = JSON.parse(data)

    // Joined game
    if (json.type === 'joined') {
      players.set(socket, {
        id: json.id,
        name: json.name,
        x: json.x,
        y: json.y,
        angle: json.angle,
        radius: json.radius,
        health: 100,
      })

      wsServer.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'joined',
              players: [...players.values()],
            }),
          )
        }
      })
    }

    // Moved
    if (json.type === 'moved') {
      players.set(socket, {
        ...players.get(socket),
        x: json.x,
        y: json.y,
      })

      const player = players.get(socket)

      wsServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'moved',
              player: player,
            }),
          )
        }
      })
    }

    // Moved mouse
    if (json.type === 'mouseMoved') {
      players.set(socket, {
        ...players.get(socket),
        angle: json.angle,
      })

      const player = players.get(socket)

      wsServer.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          if (client !== socket && client.readyState === Websocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'movedMouse',
                player: {
                  id: player.id,
                  angle: player.angle,
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
        if (client !== socket && client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'shoot',
              bullet: {
                id: json.id,
                playerId: json.playerId,
                x: json.x,
                y: json.y,
                dx: json.dx,
                dy: json.dy,
              },
            }),
          )
        }
      })
    }

    // Player shot
    if (json.type === 'shot') {
      players.set(socket, {
        ...players.get(socket),
        health: players.get(socket).health - 20,
      })

      const player = players.get(socket)

      wsServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'shot',
              bullet: {
                id: json.bullet.id,
              },
              player: {
                id: json.player.id,
                health: player.health,
              },
            }),
          )
        }
      })
    }
  })

  socket.on('close', () => {
    players.delete(socket)

    wsServer.clients.forEach((client) => {
      if (client.readyState === Websocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'left',
            players: [...players.values()],
          }),
        )
      }
    })
  })
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
