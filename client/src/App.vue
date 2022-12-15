<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()

let socket: WebSocket | null = null

interface Player {
  name: string
}

const players = ref<Player[]>()

const form = ref({
  name: null,
})

onMounted(() => {
  if (!canvas.value) {
    return
  }

  const ctx = canvas.value.getContext('2d')

  if (ctx === null) {
    return
  }

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  ctx.fillStyle = '#CDCDCD'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  ctx.lineWidth = 2
  ctx.strokeStyle = '#C9C9C9'

  for (let x = 0; x <= canvas.value.width; x += 30) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.value.height)
  }

  for (let y = 0; y <= canvas.value.height; y += 30) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.value.width, y)
  }

  ctx.stroke()

  socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    players.value = data.players
  })
})

const submit = () => {
  if (socket !== null) {
    socket.send(JSON.stringify(form.value))
  }
}
</script>

<template>
  <main class="relative grid place-items-center">
    <canvas ref="canvas"></canvas>

    <form @submit.prevent="submit" class="absolute">
      <p class="text-shadow text-center text-2xl text-white">This is the tale of...</p>
      <div class="mt-1 flex gap-2">
        <input v-model="form.name" type="text" class="h-14 w-80 border-4 border-black bg-white text-5xl" />
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
