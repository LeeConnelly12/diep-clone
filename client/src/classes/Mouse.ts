class Mouse {
  constructor(public x: number = 0, public y: number = 0) {}

  public registerEvents() {
    window.addEventListener('mousemove', (event) => {
      this.x = event.clientX
      this.y = event.clientY
    })
  }
}

export default Mouse
