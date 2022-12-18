class Player {
  constructor(x, y, name, id, angle, radius) {
    this.x = x
    this.y = y
    this.name = name
    this.id = id
    this.angle = angle ?? 0.0
    this.radius = radius ?? 30.0
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
      dispatchEvent(
        new KeyboardEvent('moved', {
          bubbles: true,
          key: 'w',
        }),
      )
    }

    if (this.keys['a']) {
      this.x -= 1

      dispatchEvent(
        new KeyboardEvent('moved', {
          bubbles: true,
          key: 'a',
        }),
      )
    }

    if (this.keys['s']) {
      this.y += 1

      dispatchEvent(
        new KeyboardEvent('moved', {
          bubbles: true,
          key: 's',
        }),
      )
    }

    if (this.keys['d']) {
      this.x += 1

      dispatchEvent(
        new KeyboardEvent('moved', {
          bubbles: true,
          key: 'd',
        }),
      )
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

  shot(bullet) {
    console.log('shot')
  }
}

export default Player
