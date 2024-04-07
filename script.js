const multiplicator = 1.05
const lineWidth = 1;
const maxVelocity = 2;
let firstPlayerPos, secondPlayerPos;
let firstPlayerVelocity = secondPlayerVelocity = 0
let padHeight;
let padWidth;
let padMargin;
let toggle = false
var keysPressed = {};
let ball = {
  x: 0,
  y: 0,
  radius: 30,
  velocity: {
    x: 1.5,
    y:  Math.random() * 2
  }
};

document.addEventListener("DOMContentLoaded", (event) => {

    const canvas = document.getElementById("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    padHeight = canvas.height / 8; //To 8
    padMargin = padHeight / 3;
    padWidth = padHeight / 5;
    firstPlayerPos = secondPlayerPos = (canvas.height / 2) - (padHeight / 2);

    ball.x = canvas.width / 2
    ball.y = canvas.height / 2

    if(Math.random() > 0.5){
      ball.velocity.x = -ball.velocity.x
      toggle = true
    }
    if(Math.random() > 0.5){
      ball.velocity.y = -ball.velocity.y
    }


    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "white"

    drawGameState(ctx);
    setTimeout(function() {
      setInterval(function(){
        update(ctx), 16
      });
    }, 250); //To 1000
})


document.addEventListener('keydown', function(event) {
  let key = event.key.toUpperCase();
  keysPressed[key] = true;

  let direction
  if(key == "ARROWUP" || key == "W"){
    direction = "up"  
  }
  else{
    direction = "down"
  }
  if(key == "W" || key == "S"){
    firstPlayerVelocity = handlePlayerMovement(firstPlayerVelocity, direction);
  }
  else{
    secondPlayerVelocity = handlePlayerMovement(secondPlayerVelocity, direction);
  }

});


function handlePlayerMovement(playerVelocity, direction) {
  if (direction == "up") {
      if (playerVelocity > 0) {
          playerVelocity = 0;
      }
      if (playerVelocity > -maxVelocity) {
          playerVelocity -= 1;
      }
  } else if (direction == "down") {
      if (playerVelocity < 0) {
          playerVelocity = 0;
      }
      if (playerVelocity < maxVelocity) {
          playerVelocity += 1;
      }
  }
  return playerVelocity
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

    firstPlayerVelocity += Math.sign(firstPlayerVelocity) * (-0.05)
    secondPlayerVelocity += Math.sign(secondPlayerVelocity) * (-0.05)

    console.log(firstPlayerVelocity)
    console.log(secondPlayerVelocity)

    updatePads()
    updateBall()
    drawGameState(ctx);
}

function drawGameState(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(ctx, ball.x, ball.y, ball.radius);
  ctx.fillRect(canvas.width / 2 - lineWidth, 0, lineWidth, canvas.height);
  ctx.fillRect(padMargin, firstPlayerPos, padWidth, padHeight);
  ctx.fillRect(canvas.width - padMargin - padWidth, secondPlayerPos, padWidth, padHeight);
}

function updateBall(){


  var maxY = canvas.height - ball.radius;
  if(ball.y > maxY || ball.y < ball.radius){
    ball.velocity.y = -ball.velocity.y;
  }

  //Left pad
  if(toggle == true && ball.x > padMargin + padWidth && ball.x < ball.radius + padWidth + padMargin && ball.y > firstPlayerPos - ball.radius && ball.y < firstPlayerPos + padHeight + ball.radius){
    ball.velocity.x = -ball.velocity.x * multiplicator;
    ball.velocity.y = -ball.velocity.y * multiplicator;
    toggle = !toggle;
  }

  //Right pad
  if(toggle == false && ball.x < canvas.width - padMargin - padWidth && ball.x > canvas.width - padWidth - padMargin - ball.radius && ball.y > secondPlayerPos - ball.radius && ball.y < secondPlayerPos + padHeight + ball.radius){
    ball.velocity.x = -ball.velocity.x * multiplicator;
    ball.velocity.y = -ball.velocity.y * multiplicator;
    toggle = !toggle;
  }


  var maxX = canvas.width - ball.radius;
  if(ball.x > maxX || ball.x < ball.radius){
    ball.velocity.x = -ball.velocity.x;
    //GOAL
  }

  ball.x += ball.velocity.x
  ball.y += ball.velocity.y


}

function updatePads(){

  if (keysPressed["W"]) {
    firstPlayerPos = firstPlayerPos + firstPlayerVelocity - 2;
  }
  if (keysPressed["S"]) {
    firstPlayerPos = firstPlayerPos + firstPlayerVelocity + 2;
  }
  if (keysPressed["ARROWUP"]) {
    secondPlayerPos = secondPlayerPos + secondPlayerVelocity - 2;
  }
  if (keysPressed["ARROWDOWN"]) {
    secondPlayerPos = secondPlayerPos + secondPlayerVelocity + 2;
  }
  firstPlayerPos = checkPos(firstPlayerPos)
  secondPlayerPos = checkPos(secondPlayerPos)
}

function drawCircle(ctx, x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fill()
  }