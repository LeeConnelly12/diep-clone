class Bullet {
  constructor(x, y, dx, dy, id, playerId) {
    this.x = x
    this.y = y
    this.dx = dx ?? 0.0
    this.dy = dy ?? 0.0
    this.id = id
    this.playerId = playerId
    this.radius = 10.0
  }

  tick() {
    this.x += this.dx
    this.y += this.dy
  }

  render(ctx) {
    ctx.fillStyle = '#00B2E1'
    ctx.strokeStyle = '#0085A8'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke()
  }
}

export default Bullet
