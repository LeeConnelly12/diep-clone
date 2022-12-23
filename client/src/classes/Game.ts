import Player from '@/classes/Player'
import Socket from '@/utilities/Socket'
import { canvas, ctx } from '@/utilities/Canvas'

class Game {
  constructor(public player: Player) {}

  public start() {
    // Draw canvas grid
    this.draw()

    // Register the socket events
    this.registerSocketEvents()

    // Get scoreboard of players
  }

  private registerSocketEvents() {
    Socket.on('joined', (data) => {
      //
    })
  }

  private draw() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = '#CDCDCD'
    ctx.strokeStyle = '#C9C9C9'
    ctx.lineWidth = 2

    for (let x = 0; x <= 3000; x += 30) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 2000)
    }

    for (let y = 0; y <= 2000; y += 30) {
      ctx.moveTo(0, y)
      ctx.lineTo(3000, y)
    }

    ctx.fillRect(0, 0, 3000, 2000)
    ctx.stroke()

    requestAnimationFrame(() => this.draw())
  }
}

export default Game
