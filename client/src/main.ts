import './style.css'
import Socket from '@/utilities/Socket'
import Player from '@/classes/Player'
import Game from '@/classes/Game'

const form = <HTMLFormElement>document.getElementById('form')

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const data = new FormData(form)

  const name = <string | null>data.get('name')

  if (name === null) {
    return
  }

  Socket.emit('joined', {
    name: name,
  })

  const player = new Player(name)

  const game = new Game(player)

  game.start()

  form.classList.add('hidden')
})
