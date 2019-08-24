window.keyboard = {}

window.onkeydown = (e) => {
  window.keyboard[e.keyCode] = true
}

window.onkeyup = (e) => {
  window.keyboard[e.keyCode] = false
}
