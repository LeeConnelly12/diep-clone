import Socket from '@/utilities/Socket'
import Player from '@/classes/Player'
import { canvas, ctx, roundRect } from '@/utilities/Canvas'

class Scoreboard {
  constructor(
    public players: Player[] = [],
    private x: number = canvas.width - 220,
    private y: number = 40,
  ) {}

  public draw() {
    ctx.save()
    ctx.strokeStyle = 'black'
    ctx.font = '25px Ubuntu'
    ctx.lineWidth = 4
    ctx.fillStyle = 'white'
    ctx.strokeText('Scoreboard', this.x, this.y)
    ctx.fillText('Scoreboard', this.x, this.y)

    ctx.font = '16px Ubuntu'
    ctx.fillStyle = 'white'
    ctx.lineWidth = 3
    let playerY = this.y + 40

    this.players.forEach((player) => {
      ctx.strokeText(player.name, this.x, playerY)
      ctx.fillText(player.name, this.x, playerY)
      playerY += 20
    })

    ctx.restore()
  }

  public registerSocketEvents() {
    Socket.on('players', (players) => this.setPlayers(players))
    Socket.on('joined', (player) => this.addPlayer(player))
    Socket.on('left', (player) => this.removePlayer(player))
  }

  private setPlayers(players: Player[]) {
    this.players = players
  }

  private addPlayer(player: Player) {
    this.players.push(player)
  }

  private removePlayer(player: Player) {
    this.players = this.players.filter((p) => p.id !== player.id)
  }
}

export default Scoreboard
