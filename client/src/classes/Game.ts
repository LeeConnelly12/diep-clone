import Player from '@/classes/Player'
import { drawCanvas } from '@/utilities/Canvas'
import Scoreboard from '@/classes/Scoreboard'
import Mouse from '@/classes/Mouse'

class Game {
  private scoreboard: Scoreboard = new Scoreboard()

  private mouse: Mouse = new Mouse()

  constructor(public player: Player) {}

  public start() {
    this.draw()

    this.scoreboard.registerSocketEvents()

    this.player.registerEvents()

    this.mouse.registerEvents()
  }

  private draw() {
    drawCanvas()

    this.scoreboard.draw()

    this.player.tick(this.mouse.x, this.mouse.y)
    this.player.draw()

    requestAnimationFrame(() => this.draw())
  }
}

export default Game
