<script setup>
import { onMounted, ref } from 'vue'
import Player from './Player'
import Bullet from './Bullet'
import MapRegion from './MapRegion'
import Camera from './Camera'

const canvas = ref(HTMLCanvasElement)

let ctx = null

let socket = null

let player = null

let camera = new Camera()

let map = new MapRegion()

const players = ref([])

const isPlaying = ref(false)

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
}

const bullets = []

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

  window.addEventListener('moved', function (event) {
    socket.send(
      JSON.stringify({
        type: 'moved',
        name: player.name,
        x: player.x,
        y: player.y,
        angle: player.angle,
      }),
    )
  })
})

const mouseMove = (e) => {
  if (!player) {
    return
  }

  mouse.x = e.clientX
  mouse.y = e.clientY

  socket.send(
    JSON.stringify({
      type: 'mouseMoved',
      name: player.name,
      x: player.x,
      y: player.y,
      angle: player.angle,
    }),
  )
}

const shoot = () => {
  if (!player) {
    return
  }

  let x = mouse.x - canvas.value.width / 2
  let y = mouse.y - canvas.value.height / 2

  const l = Math.sqrt(x * x + y * y)

  x = x / l
  y = y / l

  const bullet = new Bullet(player.x, player.y, x * 3.0, y * 3.0)

  socket.send(
    JSON.stringify({
      type: 'shoot',
      x: bullet.x,
      y: bullet.y,
      dx: bullet.dx,
      dy: bullet.dy,
    }),
  )

  bullets.push(bullet)
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
      players.value = data.players
    } else if (data.type === 'left') {
      players.value = data.players
    } else if (data.type === 'moved') {
      const movedPlayer = players.value.find((player) => player.id === data.player.id)
      movedPlayer.x = data.player.x
      movedPlayer.y = data.player.y
    } else if (data.type == 'movedMouse') {
      const movedPlayer = players.value.find((player) => player.id === data.player.id)
      movedPlayer.angle = data.player.angle
    } else if (data.type === 'shoot') {
      const bullet = new Bullet(data.bullet.x, data.bullet.y, data.bullet.dx, data.bullet.dy)
      bullets.push(bullet)
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
    }),
  )

  requestAnimationFrame(draw)
}

const draw = () => {
  // Tick
  player.tick(mouse.x, mouse.y, map, canvas.value)
  bullets.forEach((bullet) => bullet.tick())

  // Reset
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  camera.focus(canvas.value, map, player)

  // Flip the sign b/c positive shifts the canvas to the right, negative - to the left
  ctx.translate(-camera.x, -camera.y)

  map.render(ctx)
  bullets.forEach((bullet) => bullet.render(ctx))
  player.render(ctx)

  players.value
    .filter((otherPlayer) => otherPlayer.id !== player.id)
    .forEach((otherPlayer) => {
      const draw = new Player(otherPlayer.x, otherPlayer.y, otherPlayer.name, otherPlayer.id, otherPlayer.angle)
      draw.render(ctx)
    })

  requestAnimationFrame(draw)
}
</script>

<template>
  <main class="relative grid place-items-center">
    <canvas @mousemove="mouseMove" @click="shoot" ref="canvas"></canvas>

    <form v-if="!isPlaying" @submit.prevent="submit" class="absolute">
      <p class="text-shadow text-center text-2xl text-white">This is the tale of...</p>
      <div class="mt-1 flex gap-2">
        <input v-model="form.name" type="text" required pattern="[a-zA-Z0-9]+" class="h-14 w-80 border-4 border-black bg-white text-5xl" />
        <button class="text-shadow h-14 w-24 border-4 border-[#555555] bg-[#8EFFFB] text-2xl text-white">Play</button>
      </div>
    </form>

    <aside v-if="players && players.length > 0" class="absolute top-4 right-6 w-56 h-72">
      <h2 class="text-shadow text-2xl text-white text-center">Scoreboard</h2>
      <ul class="pt-3 grid gap-2">
        <li v-for="player in players" class="bg-[#3E3E3E] rounded-full px-3 border-2 border-black">
          <p class="text-white">{{ player.name }}</p>
        </li>
      </ul>
    </aside>
  </main>
</template>
