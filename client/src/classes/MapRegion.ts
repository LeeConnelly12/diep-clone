import { ctx } from '@/utilities/Canvas'

class MapRegion {
  constructor(public width: number = 3000, public height: number = 2000) {}

  public draw() {
    ctx.fillStyle = '#CDCDCD'
    ctx.strokeStyle = '#C9C9C9'
    ctx.lineWidth = 2

    for (let x = 0; x <= this.width; x += 30) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.height)
    }

    for (let y = 0; y <= this.height; y += 30) {
      ctx.moveTo(0, y)
      ctx.lineTo(this.width, y)
    }

    ctx.fillRect(0, 0, this.width, this.height)
    ctx.stroke()
  }
}

export default MapRegion
