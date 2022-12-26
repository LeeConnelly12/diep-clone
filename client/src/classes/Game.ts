import { canvas, ctx } from '@/utilities/Canvas'
import Player from '@/classes/Player'
import Scoreboard from '@/classes/Scoreboard'
import Mouse from '@/classes/Mouse'
import Camera from '@/classes/Camera'
import MapRegion from '@/classes/MapRegion'

class Game {
  public player: Player

  private scoreboard: Scoreboard = new Scoreboard()

  private mouse: Mouse = new Mouse()

  private camera: Camera = new Camera()

  private map: MapRegion = new MapRegion()

  constructor(player: Player) {
    this.player = player
    this.player.x = this.map.width / 2
    this.player.y = this.map.height / 2
  }

  public start() {
    this.draw()

    this.scoreboard.registerSocketEvents()

    this.player.registerEvents()

    this.mouse.registerEvents()
  }

  private draw() {
    ctx.resetTransform()

    this.player.tick(this.mouse.x, this.mouse.y, this.map)

    this.camera.focus(this.map, this.player)

    ctx.translate(-this.camera.x, -this.camera.y)

    this.map.draw()

    this.player.draw()

    this.scoreboard.tick(this.camera)
    this.scoreboard.draw()

    requestAnimationFrame(() => this.draw())
  }
}

export default Game
