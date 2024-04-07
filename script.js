const multiplicator = 1.05
const lineWidth = 3;
let scoreMargin = 128
let firstPlayerScore = 0
let secondPlayerScore = 0
let firstPlayerPos, secondPlayerPos;
let padHeight;
let padWidth;
let padMargin;
let toggle = false
var keysPressed = {};
let ball = {
  x: 0,
  y: 0,
  radius: 0,
  velocity: {
    x: 0,
    y: 0
  }
};

document.addEventListener("DOMContentLoaded", (event) => {

    const canvas = document.getElementById("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    padHeight = canvas.height / 8; 
    padMargin = padHeight / 3;
    padWidth = padHeight / 5;
    ball.radius = canvas.width / 64

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "white"
    startGame(canvas)
    setInterval(function(){
        update(ctx), 16
    });
})


document.addEventListener('keydown', function(event) {
  let key = event.key.toUpperCase();
  keysPressed[key] = true;
});


function prepareGame(canvas) {

  firstPlayerPos = secondPlayerPos = (canvas.height / 2) - (padHeight / 2);
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocity.x = 0
  ball.velocity.y = 0
}

function startGame() {

  prepareGame(canvas)
  setTimeout(function(){

    ball.velocity.x = 1.5
    ball.velocity.y = Math.random() * 2
    if (Math.random() > 0.5) {
      ball.velocity.x = -ball.velocity.x;
      toggle = true;
    }
    else {
      toggle = false
    }
    if (Math.random() > 0.5) {
      ball.velocity.y = -ball.velocity.y;
    }
  }, 1000)
}


document.addEventListener('keyup', function(event) {
  let key = event.key.toUpperCase();
  delete keysPressed[key];
});

   
function checkPos(pos) {

    var max = canvas.height - padHeight;
    if(pos > max){
      pos = max;
    }
    else if(pos < 0){
      pos = 0;
    }
    return pos
  }

function update(ctx){

    updatePads()
    updateBall()
    drawGameState(ctx);
}

function drawGameState(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(ctx, ball.x, ball.y, ball.radius);
  drawScore(ctx)
  drawDashLine(ctx);
  ctx.fillRect(padMargin, firstPlayerPos, padWidth, padHeight);
  ctx.fillRect(canvas.width - padMargin - padWidth, secondPlayerPos, padWidth, padHeight);
}

function drawDashLine(ctx) {
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = "white";
  ctx.moveTo(canvas.width / 2 - lineWidth, 0);
  ctx.lineTo(canvas.width / 2 - lineWidth, canvas.height);
  ctx.stroke();
}

function drawScore(ctx) {
  ctx.font = "48px 'Pixel', Fantasy";

  const canvasCenterX = canvas.width / 2;
  const textMetrics1 = ctx.measureText(firstPlayerScore);
  const textWidth = textMetrics1.width;

  const scoreTextMargin1 = canvasCenterX - textWidth - scoreMargin;
  const scoreTextMargin2 = canvasCenterX + scoreMargin;

  ctx.fillText(firstPlayerScore, scoreTextMargin1, scoreMargin / 1.5);
  ctx.fillText(secondPlayerScore, scoreTextMargin2, scoreMargin / 1.5);
}

function updateBall(){

  //Bottom and top
  var maxY = canvas.height - ball.radius;
  if(ball.y > maxY || ball.y < ball.radius){
    playSound("collision")
    ball.velocity.y = -ball.velocity.y;
  }

  //Left pad
  if(toggle == true && ball.x > padMargin + padWidth - ball.radius && ball.x < ball.radius + padWidth + padMargin && ball.y > firstPlayerPos - ball.radius && ball.y < firstPlayerPos + padHeight + ball.radius){
    playSound("hit")
    ball.velocity.x = -ball.velocity.x * multiplicator;
    let difference = firstPlayerPos + padHeight / 2 - ball.y
    ball.velocity.y = -ball.velocity.y - difference / 50;
    toggle = !toggle;
  }

  //Right pad
  if(toggle == false && ball.x < canvas.width - padMargin - padWidth + ball.radius && ball.x > canvas.width - padWidth - padMargin - ball.radius && ball.y > secondPlayerPos - ball.radius && ball.y < secondPlayerPos + padHeight + ball.radius){
    playSound("hit")
    ball.velocity.x = -ball.velocity.x * multiplicator;
    let difference = secondPlayerPos + padHeight / 2 - ball.y
    ball.velocity.y = -ball.velocity.y - difference / 50;
    toggle = !toggle;
  }

  //Goal for first player
  if(ball.x > canvas.width + ball.radius * 2){
    firstPlayerScore++
    playSound("goal")
    startGame()
  }

  //Goal for second player
  if(ball.x < -ball.radius * 2) {
    secondPlayerScore++
    playSound("goal")
    startGame()
  }

  ball.x += ball.velocity.x
  ball.y += ball.velocity.y
}

function updatePads(){

  if(ball.velocity.x != 0){
    if (keysPressed["W"]) {
      firstPlayerPos = firstPlayerPos - 2;
    }
    if (keysPressed["S"]) {
      firstPlayerPos = firstPlayerPos + 2;
    }
    if (keysPressed["ARROWUP"]) {
      secondPlayerPos = secondPlayerPos - 2;
    }
    if (keysPressed["ARROWDOWN"]) {
      secondPlayerPos = secondPlayerPos + 2;
    }
    firstPlayerPos = checkPos(firstPlayerPos)
    secondPlayerPos = checkPos(secondPlayerPos)
  }
}

function drawCircle(ctx, x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fill()
}

function playSound(sound) {
    var audio = document.getElementById(sound);
    audio.play();
}