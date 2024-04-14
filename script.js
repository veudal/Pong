const speedMultiplier = 1.05
const lineWidth = 3
const padSpeed = 2
const startDelay = 1000
const keysPressed = {}
const yVelocityFactor = 50
const scoreMargin = 128
let canvas
let touchList = []
const players = {
  firstPlayerScore: 0,
  secondPlayerScore: 0,
  firstPlayerPos: 0,
  secondPlayerPos: 0,
  firstPlayerTouchY: -1,
  secondPlayerTouchY: -1,
  padHeight: 0,
  padWidth: 0,
  padMargin: 0,
  padToggle: false
}
const ball = {
  x: 0,
  y: 0,
  radius: 0,
  velocity: { x: 0, y: 0 }
}

document.addEventListener("DOMContentLoaded", (event) => {

  canvas = document.getElementById("canvas")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  adjustForWindowSize()
  startGame(canvas)

  let ctx = canvas.getContext('2d')
  requestAnimationFrame(function () {
    render(ctx)
  })
  setInterval(function () {
    update()
  }, 1)
})

function adjustForWindowSize() {

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  players.padHeight = canvas.height / 8
  players.padMargin = players.padHeight / 3
  players.padWidth = players.padHeight / 5
  ball.radius = canvas.width / 64
}

window.addEventListener('resize', adjustForWindowSize, false)

document.addEventListener('touchstart', (event) => { startTouch(event.touches, event.target.id) })
document.addEventListener('touchmove', (event) => { changeTarget(event.touches, event.target.id) })
document.addEventListener('touchend', (event) => { cancelTarget(event.changedTouches, event.target.id) })


function cancelTarget(touches, id) {

  delete touchList[id]
  for (let i = 0; i < touches.length; i++) {
    let touch = touches[i]
   if (touch.clientX < canvas.width / 2) {
      players.firstPlayerTouchY = -1
    }
    else {
      players.secondPlayerTouchY = -1
    }
  }
}

function changeTarget(touches, id) {
  for (let i = 0; i < touches.length; i++) {
    let touch = touches[i]
    if (touchList[id] == 1) {
      players.firstPlayerTouchY = touch.clientY
    }
    else if(touchList[id] == 2){
      players.secondPlayerTouchY = touch.clientY
    }
  }
}

function startTouch(touches, id) {

  let horizontalCenter = canvas.width / 2
  for (let i = 0; i < touches.length; i++) {
    let touch = touches[i]
    if (touch.clientX < horizontalCenter) {
      touchList[id] = 1
      players.firstPlayerTouchY = touch.clientY
    }
    else {
      touchList[id] = 2
      players.secondPlayerTouchY = touch.clientY
    }
  }
}

document.addEventListener('keydown', handleKeyEvent)
document.addEventListener('keyup', handleKeyEvent)

function handleKeyEvent(event) {
  let key = event.key.toUpperCase()
  keysPressed[key] = (event.type === 'keydown')
}

function prepareGame(canvas) {

  players.firstPlayerPos = players.secondPlayerPos = (canvas.height / 2) - (players.padHeight / 2)
  ball.x = canvas.width / 2
  ball.y = canvas.height / 2
  ball.velocity.x = 0
  ball.velocity.y = 0
}

function startGame() {

  prepareGame(canvas)
  setTimeout(function () {

    ball.velocity.x = 1.5
    ball.velocity.y = Math.random() * 2
    let rnd = Math.random() > 0.5
    if (rnd) {
      ball.velocity.x = -ball.velocity.x
      players.padToggle = rnd
    }
    if (Math.random() > 0.5) {
      ball.velocity.y = -ball.velocity.y
    }
  }, startDelay)
}

function checkPos(pos) {

  const max = canvas.height - players.padHeight
  return Math.min(Math.max(pos, 0), max)
}

function update() {

  updatePads()
  updateBall()
}

function render(ctx) {

  drawGameState(ctx)
  requestAnimationFrame(function () {
    render(ctx)
  })
}

function drawGameState(ctx) {
  ctx.fillStyle = "white"
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawDashLine(ctx)
  drawScore(ctx)
  drawBall(ctx, ball.x, ball.y, ball.radius)
  drawPads(ctx)
}

function drawPads(ctx) {
  ctx.fillRect(players.padMargin, players.firstPlayerPos, players.padWidth, players.padHeight)
  ctx.fillRect(canvas.width - players.padMargin - players.padWidth, players.secondPlayerPos, players.padWidth, players.padHeight)
}

function drawDashLine(ctx) {
  ctx.setLineDash([8, 8])
  ctx.beginPath()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = "white"
  ctx.moveTo(canvas.width / 2, 0)
  ctx.lineTo(canvas.width / 2, canvas.height)
  ctx.stroke()
}

function drawScore(ctx) {
  ctx.font = "48px 'Pixel', Fantasy"

  const canvasCenterX = canvas.width / 2
  const textMetrics1 = ctx.measureText(players.firstPlayerScore)
  const textWidth = textMetrics1.width

  const scoreTextMargin1 = canvasCenterX - textWidth - scoreMargin
  const scoreTextMargin2 = canvasCenterX + scoreMargin

  ctx.fillText(players.firstPlayerScore, scoreTextMargin1, scoreMargin / 1.5)
  ctx.fillText(players.secondPlayerScore, scoreTextMargin2, scoreMargin / 1.5)
}

function drawBall(ctx, x, y, radius) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.fill()
}

function playSound(sound) {
  var audio = document.getElementById(sound)
  audio.volume = 0.25
  audio.play()
}

function updateBall() {
  let wallBounce = false;

  function checkWallCollision() {
    const maxY = canvas.height - ball.radius;
    if (ball.y > maxY || ball.y < ball.radius) {
      playSound("collision");
      ball.velocity.y = -ball.velocity.y;
      wallBounce = true;
    }
  }

  function checkPadCollision() {
    if (players.padToggle) {
      checkLeftPadCollision();
    } else {
      checkRightPadCollision();
    }
  }

  function checkLeftPadCollision() {
    if (
      ball.x > players.padMargin + players.padWidth - ball.radius &&
      ball.x < ball.radius + players.padWidth + players.padMargin &&
      ball.y > players.firstPlayerPos - ball.radius &&
      ball.y < players.firstPlayerPos + players.padHeight + ball.radius
    ) {
      playSound("hit");
      ball.velocity.x = -ball.velocity.x * speedMultiplier;
      const difference = players.firstPlayerPos + players.padHeight / 2 - ball.y;
      ball.velocity.y = -ball.velocity.y - difference / yVelocityFactor;
      players.padToggle = !players.padToggle;
    }
  }

  function checkRightPadCollision() {
    if (
      ball.x < canvas.width - players.padMargin - players.padWidth + ball.radius &&
      ball.x > canvas.width - players.padWidth - players.padMargin - ball.radius &&
      ball.y > players.secondPlayerPos - ball.radius &&
      ball.y < players.secondPlayerPos + players.padHeight + ball.radius
    ) {
      playSound("hit");
      ball.velocity.x = -ball.velocity.x * speedMultiplier;
      const difference = players.secondPlayerPos + players.padHeight / 2 - ball.y;
      ball.velocity.y = -ball.velocity.y - difference / yVelocityFactor;
      players.padToggle = !players.padToggle;
    }
  }

  function checkGoal() {
    if (ball.x > canvas.width + ball.radius * 2) {
      players.firstPlayerScore++;
      playSound("goal");
      startGame();
    } else if (ball.x < -ball.radius * 2) {
      players.secondPlayerScore++;
      playSound("goal");
      startGame();
    }
  }

  function updateBall() {
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
  }

  function preventStuckBall() {
    if (wallBounce) {
      if (ball.y < canvas.height / 2) {
        ball.y += 1;
      } else {
        ball.y -= 1;
      }
    }
  }

  checkWallCollision();
  checkPadCollision();
  checkGoal();
  updateBall();
  preventStuckBall();
}


function updatePads() {

  pad1 = players.firstPlayerPos + players.padHeight / 2
  pad2 = players.secondPlayerPos + players.padHeight / 2

  if (ball.velocity.x != 0) {
    if (keysPressed["W"] || players.firstPlayerTouchY < pad1 && players.firstPlayerTouchY != -1) {
      players.firstPlayerPos = players.firstPlayerPos - padSpeed
      players.firstPlayerPos = checkPos(players.firstPlayerPos)
    }
    if (keysPressed["S"] || (players.firstPlayerTouchY > pad1 && players.firstPlayerTouchY != -1)) {
      players.firstPlayerPos = players.firstPlayerPos + padSpeed
      players.firstPlayerPos = checkPos(players.firstPlayerPos)
    }
    if (keysPressed["ARROWUP"] || players.secondPlayerTouchY < pad2 && players.secondPlayerTouchY != -1) {
      players.secondPlayerPos = players.secondPlayerPos - padSpeed
      players.secondPlayerPos = checkPos(players.secondPlayerPos)
    }
    if (keysPressed["ARROWDOWN"] || (players.secondPlayerTouchY > pad2 && players.secondPlayerTouchY != -1)) {
      players.secondPlayerPos = players.secondPlayerPos + padSpeed
      players.secondPlayerPos = checkPos(players.secondPlayerPos)
    }
  }
}