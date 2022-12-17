class MapRegion {
  constructor() {
    this.w = 3000
    this.h = 2000
  }

  render(ctx) {
    ctx.fillStyle = '#CDCDCD'
    ctx.strokeStyle = '#C9C9C9'
    ctx.lineWidth = 2

    for (let x = 0; x <= this.w; x += 30) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.h)
    }

    for (let y = 0; y <= this.h; y += 30) {
      ctx.moveTo(0, y)
      ctx.lineTo(this.w, y)
    }

    ctx.fillRect(0, 0, this.w, this.h)
    ctx.stroke()
  }
}

export default MapRegion
