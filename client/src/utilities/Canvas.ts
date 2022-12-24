const canvas = <HTMLCanvasElement>document.getElementById('canvas')

const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')

const drawCanvas = () => {
  ctx.fillStyle = '#CDCDCD'
  ctx.strokeStyle = '#C9C9C9'
  ctx.lineWidth = 2

  for (let x = 0; x <= canvas.width; x += 30) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
  }

  for (let y = 0; y <= canvas.height; y += 30) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
  }

  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.stroke()
}

const roundRect = (x0: number, y0: number, x1: number, y1: number, r: number, color: string) => {
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

export { canvas, ctx, drawCanvas, roundRect }
