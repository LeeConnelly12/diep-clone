class Camera {
  constructor(x, y) {
    this.x = x ?? 0
    this.y = y ?? 0
  }

  focus(canvas, map, player) {
    // Account for half of player w/h to make their rectangle centered
    this.x = this.clamp(player.x - canvas.width / 2 + player.radius / 2, 0, map.w - canvas.width)
    this.y = this.clamp(player.y - canvas.height / 2 + player.radius / 2, 0, map.h - canvas.height)
  }

  clamp(coord, min, max) {
    if (coord < min) {
      return min
    } else if (coord > max) {
      return max
    } else {
      return coord
    }
  }
}

export default Camera
