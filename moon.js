function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Moon {
  constructor (canvas, context) {
    this.canvas = canvas
    this.context = context
    this.width = canvas.width
    this.height = canvas.height
    this.terrain = {
      maxHeight: 300,
      minHeight: 20,
      points: []
    }

    // start adding points to terrain
    let height = randomIntFromInterval(this.terrain.minHeight, this.terrain.maxHeight)
    let stepness = 0

    for (let x = 0; x < this.width; x += randomIntFromInterval(10, 25)) {
      this.terrain.points.push({
        x,
        y: height,
      })

      stepness += randomIntFromInterval(-10, 10)

      // change to get lander placement
      if (Math.random() <= 0.8) {
        height += stepness
      }

      if (height >= this.terrain.maxHeight) {
        stepness = randomIntFromInterval(-10, 0)
        height = this.terrain.maxHeight + stepness
      }

      if (height <= this.terrain.minHeight) {
        stepness = randomIntFromInterval(0, 10)
        height = this.terrain.minHeight + stepness
      }
    }

    // last point to close map
    this.terrain.points.push({
      x: this.width,
      y: height,
    })
  }

  draw () {
    this.context.fillStyle = 'white'
    this.context.beginPath()
    this.context.moveTo(0, this.height)

    for (let point of this.terrain.points) {
      this.context.lineTo(point.x, this.height - point.y)
    }

    this.context.lineTo(this.width, this.height)
    this.context.closePath()
    this.context.fill()
  }
}

function clearMap(canvas, context) {
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function startGame() {
  const canvas = document.querySelector('#game')
  const context = canvas.getContext('2d')

  const moon = new Moon(canvas, context)
  const lander = new Lander(canvas, context)

  function tick (lastTiming = performance.now()) {
    const timing = performance.now()
    const elapsedTime = (timing - lastTiming) / 1000

    if (lander.landed || lander.crashed) {
      if (window.keyboard[13]) {
        return startGame()
      }

      return requestAnimationFrame(tick.bind(null, timing))
    }

    // physics
    lander.updatePhysics(elapsedTime)

    // draw
    clearMap(canvas, context)
    moon.draw()
    lander.draw()

    requestAnimationFrame(tick.bind(null, timing))
  }

  tick()
}

window.Moon = Moon
