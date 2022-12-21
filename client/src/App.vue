<script setup>
import { onMounted, ref } from 'vue'
import Player from './Player'
import Bullet from './Bullet'
import MapRegion from './MapRegion'
import Camera from './Camera'

const canvas = ref(null)

let ctx = null

let socket = null

let player = null

let camera = new Camera()

let map = new MapRegion()

let players = []

const isPlaying = ref(false)

let bullets = []

let gameIsOver = ref(false)

const mouse = {
  x: null,
  y: null,
}

const form = ref({
  name: null,
})

onMounted(() => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  ctx = canvas.value.getContext('2d')
  map.render(ctx)

  socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)
})

const mouseMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY

  socket.send(
    JSON.stringify({
      type: 'mouseMoved',
      name: player.name,
      x: player.x,
      y: player.y,
      angle: player.angle,
      radius: player.radius,
      health: player.health,
    }),
  )
}

const shoot = () => {
  if (player.isDead()) {
    return
  }

  let x = mouse.x - canvas.value.width / 2
  let y = mouse.y - canvas.value.height / 2

  const l = Math.sqrt(x * x + y * y)

  x = x / l
  y = y / l

  const bullet = new Bullet(player.x + x * (player.radius * 1.5), player.y + y * (player.radius * 1.5), x * 2.0, y * 2.0, crypto.randomUUID(), player.id)

  socket.send(
    JSON.stringify({
      type: 'shoot',
      id: bullet.id,
      playerId: bullet.playerId,
      x: bullet.x,
      y: bullet.y,
      dx: bullet.dx,
      dy: bullet.dy,
    }),
  )

  bullets.push(bullet)
}

const restartGame = () => {
  player = new Player(map.w / 2, map.h / 2, player.name, crypto.randomUUID())

  gameIsOver.value = false

  socket.send(
    JSON.stringify({
      type: 'joined',
      id: player.id,
      name: player.name,
      x: player.x,
      y: player.y,
      angle: player.angle,
      radius: player.radius,
      health: player.health,
    }),
  )
}

const submit = () => {
  if (!socket) {
    return
  }

  isPlaying.value = true

  player = new Player(map.w / 2, map.h / 2, form.value.name, crypto.randomUUID())

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)

    if (data.type === 'joined') {
      players = data.players.map((player) => {
        return new Player(player.x, player.y, player.name, player.id, player.angle, player.radius, player.health)
      })
    } else if (data.type === 'left') {
      players = data.players.map((player) => {
        return new Player(player.x, player.y, player.name, player.id, player.angle, player.radius, player.health)
      })
    } else if (data.type === 'moved') {
      const movedPlayer = players.find((player) => player.id === data.player.id)
      movedPlayer.x = data.player.x
      movedPlayer.y = data.player.y
    } else if (data.type == 'movedMouse') {
      const movedPlayer = players.find((player) => player.id === data.player.id)
      movedPlayer.angle = data.player.angle
    } else if (data.type === 'shoot') {
      const bullet = new Bullet(data.bullet.x, data.bullet.y, data.bullet.dx, data.bullet.dy, data.bullet.id, data.bullet.playerId)
      bullets.push(bullet)
    } else if (data.type === 'shot') {
      const shotPlayer = players.find((player) => player.id === data.player.id)
      shotPlayer.health = data.player.health

      console.log(data.player.health)

      bullets = bullets.filter((bullet) => bullet.id !== data.bullet.id)
    }
  })

  socket.send(
    JSON.stringify({
      type: 'joined',
      id: player.id,
      name: player.name,
      x: player.x,
      y: player.y,
      angle: player.angle,
      radius: player.radius,
      health: player.health,
    }),
  )

  window.addEventListener('moved', function (event) {
    const p = players.find((currentPlayer) => currentPlayer.id === player.id)
    p.x = player.x
    p.y = player.y

    socket.send(
      JSON.stringify({
        type: 'moved',
        x: player.x,
        y: player.y,
      }),
    )
  })

  window.addEventListener('shot', function (event) {
    socket.send(
      JSON.stringify({
        type: 'shot',
        bullet: {
          id: event.detail.bullet.id,
        },
        player: {
          id: event.detail.player.id,
        },
      }),
    )
  })

  window.addEventListener('click', shoot)

  window.addEventListener('mousemove', mouseMove)

  requestAnimationFrame(draw)
}

const collideCircle = (circle1, circle2) => {
  /* first we get the x and y distance between the two circles. */
  let distance_x = circle1.x - circle2.x
  let distance_y = circle1.y - circle2.y
  /* Then we get the sum of their radii. */
  let radii_sum = circle1.radius + circle2.radius

  /* Then we test to see if the square of their distance is greater than the
        square of their radii. If it is, then there is no collision. If it isn't,
        then we have a collision. */
  if (distance_x * distance_x + distance_y * distance_y <= radii_sum * radii_sum) return true

  return false
}

const draw = () => {
  player.tick(mouse.x, mouse.y, map, canvas.value)

  // Reset
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  camera.focus(canvas.value, map, player)

  // Flip the sign b/c positive shifts the canvas to the right, negative - to the left
  ctx.translate(-camera.x, -camera.y)

  map.render(ctx)

  bullets.forEach((bullet) => {
    bullet.tick()

    const bulletBelongsToPlayer = bullet.playerId === player.id

    if (bulletBelongsToPlayer) {
      return
    }

    const circle1 = {
      x: bullet.x,
      y: bullet.y,
      radius: bullet.radius,
    }

    const circle2 = {
      x: player.x,
      y: player.y,
      radius: player.radius,
    }

    if (collideCircle(circle1, circle2)) {
      player.shot(bullet)
      bullets = bullets.filter((currentBullet) => currentBullet.id !== bullet.id)
    }
  })

  bullets.forEach((bullet) => bullet.render(ctx))

  if (player.health < 100) {
    player.renderHealthBar(ctx)
  }

  player.render(ctx)

  players
    .filter((otherPlayer) => {
      // Don't render the current player
      if (otherPlayer.id === player.id) {
        return false
      }

      // Don't render players that are dead
      if (otherPlayer.isDead()) {
        return false
      }

      return true
    })
    .forEach((otherPlayer) => {
      otherPlayer.render(ctx)
      otherPlayer.renderName(ctx)
      otherPlayer.renderHealthBar(ctx)
    })

  if (player.isDead()) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
    ctx.fillRect(0, 0, map.w, map.h)
    gameIsOver.value = true
  }

  requestAnimationFrame(draw)
}
</script>

<template>
  <main class="relative grid place-items-center">
    <canvas ref="canvas"></canvas>

    <form v-if="!isPlaying" @submit.prevent="submit" class="absolute">
      <p class="text-shadow text-center text-2xl text-white">This is the tale of...</p>
      <div class="mt-1 flex gap-2">
        <input v-model="form.name" type="text" required pattern="[a-zA-Z0-9]+" class="h-14 w-80 border-4 border-black bg-white text-5xl" />
        <button class="text-shadow h-14 px-6 border-4 border-[#555555] bg-[#8EFFFB] text-2xl text-white">Play</button>
      </div>
    </form>

    <div v-if="gameIsOver" class="absolute w-full h-full grid place-items-center">
      <button @click.stop="restartGame" class="text-shadow h-14 px-4 border-4 border-[#555555] bg-[#8EFFFB] text-2xl text-white">Continue</button>
    </div>

    <!-- <aside v-if="players && players.length > 0" class="absolute top-4 right-6 w-56 h-72 pointer-events-none">
      <h2 class="text-shadow text-2xl text-white text-center">Scoreboard</h2>
      <ul class="pt-3 grid gap-2">
        <li v-for="player in players" class="bg-[#3E3E3E] rounded-full px-3 border-2 border-black">
          <p class="text-white">{{ player.name }}</p>
        </li>
      </ul>
    </aside> -->
  </main>
</template>
