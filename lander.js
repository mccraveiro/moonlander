function toRadians(angle) {
  return angle * Math.PI / 180
}

class Lander {
  constructor (canvas, context) {
    this.canvas = canvas
    this.context = context
    this.width = 8
    this.height = 15
    this.x = 50
    this.y = 50
    this.xSpeed = 35
    this.ySpeed = 35
    this.rotation = -45
    this.thrusterOn = 0
    this.altitude = canvas.height
    this.landed = false
    this.crashed = false
  }

  updateAltitude () {
    const imageData = this.context.getImageData(this.x, this.y, 1, this.canvas.height - this.y)
    let firstSpacePixel
    let lastSpacePixel

    for (let i = 0; i <= imageData.data.length; i += 4) {
      const black = imageData.data[i] === 0 &&
        imageData.data[i + 1] === 0 &&
        imageData.data[i + 2] === 0

      if (!firstSpacePixel && black) {
        firstSpacePixel = i
      }

      if (black) {
        lastSpacePixel = i
      }
    }

    this.altitude = (lastSpacePixel - firstSpacePixel) / 4

    if (this.altitude <= 0 || Number.isNaN(this.altitude)) {
      this.altitude = 0
    }
  }

  outOfBounds () {
    return this.x < 0 ||
      this.x >= this.canvas.width ||
      this.y < 0
  }

  updatePhysics (elapsedTime) {
    if (this.landed || this.crashed) {
      return
    }

    if (window.keyboard[37]) {
      this.rotation -= 1
    }

    if (window.keyboard[39]) {
      this.rotation += 1
    }

    if (window.keyboard[38]) {
      this.thrusterOn = 1
    } else {
      this.thrusterOn = 0
    }

    this.updateAltitude()

    if (this.outOfBounds()) {
      this.crashed = true
      return
    }

    if (this.altitude === 0) {
      if (this.xSpeed >= 5 || this.ySpeed >= 5 || Math.abs(this.rotation % 360) >= 5) {
        this.crashed = true
      } else {
        this.landed = true
      }

      return
    }

    console.log({ rotation: this.rotation })

    const moonGravity = 1.62 * 3.2 // 1.62 m/s^2 is the real moon gravity. (x3) for faster game
    const thrusterAcceleration = moonGravity * 3
    const yAcceleration = moonGravity +
      this.thrusterOn * (Math.cos(toRadians(this.rotation)) * thrusterAcceleration) * -1
    const XAcceleration = this.thrusterOn * (Math.sin(toRadians(this.rotation)) * thrusterAcceleration)

    this.ySpeed += yAcceleration * elapsedTime
    this.y += this.ySpeed * elapsedTime

    this.xSpeed += XAcceleration * elapsedTime
    this.x += this.xSpeed * elapsedTime
  }

  draw () {
    this.context.save()
    this.context.fillStyle = this.thrusterOn ? 'red' : 'yellow'
    this.context.translate(this.x, this.y)
    this.context.rotate(this.rotation * Math.PI / 180)

    this.context.beginPath()
    this.context.moveTo(-this.width / 2, this.height / 2)
    this.context.lineTo(0, -this.height / 2)
    this.context.lineTo(this.width / 2, this.height / 2)
    this.context.closePath()
    this.context.fill()

    this.context.restore()

    // metrics
    this.context.font = '12px monospace'
    this.context.fillStyle = 'white'
    this.context.fillText(`ALTITUDE: ${this.altitude.toFixed(0)}`, this.canvas.width - 200, 35)
    this.context.fillText(`HORIZONTAL SPEED: ${this.xSpeed.toFixed(0)}`, this.canvas.width - 200, 50)
    this.context.fillText(`VERTICAL SPEED: ${this.ySpeed.toFixed(0)}`, this.canvas.width - 200, 65)
    this.context.fillText(`ROTATION: ${(this.rotation % 360).toFixed(0)}`, this.canvas.width - 200, 80)

    if (this.crashed) {
      this.context.font = '20px monospace'
      this.context.fillText(`YOU'RE DEAD!`, 40, 50)
      this.context.font = '14px monospace'
      this.context.fillText(`press enter to restart`, 40, 75)
    }

    if (this.landed) {
      this.context.font = '20px monospace'
      this.context.fillText(`LANDED!`, 40, 50)
      this.context.font = '14px monospace'
      this.context.fillText(`press enter to restart`, 40, 75)
    }
  }
}

window.Lander = Lander
