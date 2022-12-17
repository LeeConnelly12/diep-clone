class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.angle = 0.0
    this.radius = 30.0
  }

  tick(mouseX, mouseY) {
    this.angle = Math.atan2(mouseY - this.y, mouseX - this.x)
  }

  render(ctx) {
    // Cannon
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.fillStyle = '#999999'
    ctx.strokeStyle = '#727272'
    ctx.lineWidth = 8
    ctx.strokeRect(50, 10, -20, -20)
    ctx.fillRect(50, 10, -20, -20)
    ctx.rotate(-this.angle)
    ctx.translate(-this.x, -this.y)

    // Player
    ctx.fillStyle = '#00B2E1'
    ctx.strokeStyle = '#0085A8'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0.0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke()
  }
}

export default Player
