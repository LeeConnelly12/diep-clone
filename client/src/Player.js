class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.angle = 0.0
    this.radius = 30.0
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    }

    window.addEventListener('keydown', (event) => {
      this.keys[event.key] = true
    })

    window.addEventListener('keyup', (event) => {
      this.keys[event.key] = false
    })
  }

  tick(mouseX, mouseY, map, canvas) {
    this.angle = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2)

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
    } else if (this.x > map.w - canvas.width / 2 - this.radius) {
      this.x = map.w - canvas.width / 2 - this.radius
    }

    if (this.y < canvas.height / 2) {
      this.y = canvas.height / 2
    } else if (this.y > map.h - canvas.height / 2 - this.radius) {
      this.y = map.h - canvas.height / 2 - this.radius
    }
  }

  render(ctx) {
    // Cannon
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.fillStyle = '#999999'
    ctx.strokeStyle = '#727272'
    ctx.lineWidth = 8
    ctx.strokeRect(50, 10, -20, -20)
    ctx.fillRect(50, 10, -20, -20)
    ctx.restore()

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
