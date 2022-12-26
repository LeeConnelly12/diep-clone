import { isPlayerKeys, PlayerKeys } from '@/classes/PlayerKeys'
import { canvas, ctx } from '@/utilities/Canvas'
import MapRegion from '@/classes/MapRegion'

class Player {
  private keys: PlayerKeys = {
    w: false,
    a: false,
    s: false,
    d: false,
  }

  constructor(
    public id: string,
    public name: string,
    public x: number = 0,
    public y: number = 0,
    public radius: number = 26.0,
    public angle: number = 0.0,
  ) {}

  public registerEvents() {
    window.addEventListener('keydown', (event) => {
      if (isPlayerKeys(event.key)) {
        this.keys[event.key] = true
      }
    })

    window.addEventListener('keyup', (event) => {
      if (isPlayerKeys(event.key)) {
        this.keys[event.key] = false
      }
    })
  }

  public tick(mouseX: number, mouseY: number, map: MapRegion) {
    this.angle = Math.atan2(
      mouseY - canvas.height / 2,
      mouseX - canvas.width / 2,
    )

    if (this.keys['w']) {
      this.y -= 1
    }

    if (this.keys['a']) {
      this.x -= 1
    }

    if (this.keys['s']) {
      this.y += 1
    }

    if (this.keys['d']) {
      this.x += 1
    }

    if (this.x < canvas.width / 2) {
      this.x = canvas.width / 2
    } else if (this.x > map.width - canvas.width / 2 - this.radius) {
      this.x = map.width - canvas.width / 2 - this.radius
    }

    if (this.y < canvas.height / 2) {
      this.y = canvas.height / 2
    } else if (this.y > map.height - canvas.height / 2 - this.radius) {
      this.y = map.height - canvas.height / 2 - this.radius
    }
  }

  public draw() {
    this.drawCannon()
    this.drawPlayer()
  }

  private drawPlayer() {
    ctx.fillStyle = '#00B2E1'
    ctx.strokeStyle = '#0085AB'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0.0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke()
  }

  private drawCannon() {
    const width = 50
    const height = 22

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.fillStyle = '#999999'
    ctx.strokeStyle = '#727272'
    ctx.lineWidth = 4
    ctx.fillRect(0, -height / 2, width, height)
    ctx.strokeRect(0, -height / 2, width, height)
    ctx.restore()
  }
}

export default Player
