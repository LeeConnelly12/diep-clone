<script setup>
import { onMounted, ref } from 'vue'
import Player from './Player'
import Bullet from './Bullet'

const canvas = ref(null)

let ctx = null

let socket = null

let player = null

const players = ref([])

const isPlaying = ref(true)

const bullets = []

const mouse = {
  x: null,
  y: null,
}

const form = ref({
  name: null,
})

const drawGrid = () => {
  ctx.fillStyle = '#CDCDCD'
  ctx.strokeStyle = '#C9C9C9'
  ctx.lineWidth = 2

  for (let x = 0; x <= canvas.value.width; x += 30) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.value.height)
  }

  for (let y = 0; y <= canvas.value.height; y += 30) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.value.width, y)
  }

  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.stroke()
}

onMounted(() => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  ctx = canvas.value.getContext('2d')

  player = new Player(canvas.value.width / 2, canvas.value.height / 2)

  socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    players.value = data.players
  })

  requestAnimationFrame(draw)
})

const mouseMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

const shoot = () => {
  let x = mouse.x - player.x
  let y = mouse.y - player.y

  const l = Math.sqrt(x * x + y * y)

  x = x / l
  y = y / l

  const bullet = new Bullet(player.x, player.y, x * 3.0, y * 3.0)

  bullets.push(bullet)
}

const submit = () => {
  if (!socket) {
    return
  }

  socket.send(JSON.stringify(form.value))

  isPlaying.value = true
}

const draw = () => {
  // Tick
  player.tick(mouse.x, mouse.y)
  bullets.forEach((bullet) => bullet.tick())

  drawGrid()

  // Render
  bullets.forEach((bullet) => bullet.render(ctx))
  player.render(ctx)

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
