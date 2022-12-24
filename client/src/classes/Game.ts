import Player from '@/classes/Player'
import { drawCanvas } from '@/utilities/Canvas'
import Scoreboard from '@/classes/Scoreboard'

class Game {
  constructor(
    public player: Player,
    public scoreboard: Scoreboard = new Scoreboard(),
  ) {}

  public start() {
    // Draw canvas grid
    this.draw()

    // Initialize scoreboard
    this.scoreboard.registerSocketEvents()
  }

  private draw() {
    drawCanvas()
    this.scoreboard.draw()

    requestAnimationFrame(() => this.draw())
  }
}

export default Game
