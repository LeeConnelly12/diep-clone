import MapRegion from '@/classes/MapRegion'
import Player from '@/classes/Player'
import { canvas } from '@/utilities/Canvas'

class Camera {
  constructor(public x: number = 0, public y: number = 0) {}

  public focus(map: MapRegion, player: Player) {
    this.x = this.clamp(
      player.x - canvas.width / 2 + player.radius / 2,
      0,
      map.width - canvas.width,
    )

    this.y = this.clamp(
      player.y - canvas.height / 2 + player.radius / 2,
      0,
      map.height - canvas.height,
    )
  }

  clamp(coord: number, min: number, max: number) {
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
