class Player {
  constructor(x, y, name, id, angle, radius, health, maxHealth) {
    this.x = x
    this.y = y
    this.name = name
    this.id = id
    this.angle = angle ?? 0.0
    this.radius = radius ?? 30.0
    this.health = health ?? 100
    this.maxHealth = this.maxHealth ?? 100
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
      dispatchEvent(new CustomEvent('moved'))
    }

    if (this.keys['a']) {
      this.x -= 1

      dispatchEvent(new CustomEvent('moved'))
    }

    if (this.keys['s']) {
      this.y += 1

      dispatchEvent(new CustomEvent('moved'))
    }

    if (this.keys['d']) {
      this.x += 1

      dispatchEvent(new CustomEvent('moved'))
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

  renderName(ctx) {
    // Player name
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.font = '36px Ubuntu'
    ctx.lineWidth = 2
    ctx.textAlign = 'center'
    ctx.fillText(this.name, this.x, this.y - this.radius * 1.75)
    ctx.strokeText(this.name, this.x, this.y - this.radius * 1.75)
  }

  renderHealthBar(ctx) {
    // Player health
    ctx.fillStyle = '#85E37D'
    ctx.strokeStyle = '#555555'

    const width = 0.75

    const startBgX = this.x - (this.maxHealth / 2) * width
    const startBgY = this.y + this.radius + 14
    const endBgX = startBgX + this.maxHealth * width
    const endBgY = this.y + 54
    this.roundRect(ctx, startBgX, startBgY, endBgX, endBgY, 5, '#555555')

    const startX = startBgX + 2
    const startY = startBgY + 2
    const endX = startX - 4 + this.health * width
    const endY = endBgY - 2
    this.roundRect(ctx, startX, startY, endX, endY, 5, '#85E37D')
  }

  roundRect(ctx, x0, y0, x1, y1, r, color) {
    const w = x1 - x0
    const h = y1 - y0
    if (r > w / 2) r = w / 2
    if (r > h / 2) r = h / 2
    ctx.beginPath()
    ctx.moveTo(x1 - r, y0)
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
    ctx.lineTo(x1, y1 - r)
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1)
    ctx.lineTo(x0 + r, y1)
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r)
    ctx.lineTo(x0, y0 + r)
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  shot(bullet) {
    dispatchEvent(
      new CustomEvent('shot', {
        detail: {
          bullet: {
            id: bullet.id,
          },
          player: {
            id: this.id,
            health: this.health - 20,
          },
        },
      }),
    )
  }
}

export default Player
