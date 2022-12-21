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

let bullets = []

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
              bullets: bullets,
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

    // Bullet moved
    if (json.type === 'bulletMoved') {
      const bullet = bullets.find((bullet) => bullet.id === json.bullet.id)

      if (!bullet) {
        return
      }

      // Destroy bullet after 5 seconds
      const seconds = Math.floor((Date.now() - bullet.shotAt) / 1000)
      if (seconds >= 5) {
        bullets = bullets.filter((currentBullet) => currentBullet.id !== bullet.id)

        wsServer.clients.forEach((client) => {
          if (client.readyState === Websocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'bulletExpired',
                bullets: bullets,
              }),
            )
          }
        })

        return
      }

      bullet.x += bullet.dx
      bullet.y += bullet.dy

      wsServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'bulletMoved',
              bullet: {
                id: bullet.id,
                x: bullet.x,
                y: bullet.y,
                shotAt: bullet.shotAt,
              },
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
      const bullet = {
        id: json.id,
        playerId: json.playerId,
        x: json.x,
        y: json.y,
        dx: json.dx,
        dy: json.dy,
        shotAt: Date.now(),
      }

      bullets.push(bullet)

      wsServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === Websocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'shoot',
              bullet: bullet,
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
