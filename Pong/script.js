const multiplicator = 1.05
let firstPlayerPos, secondPlayerPos;
let padHeight;
let padWidth;
let padMargin;
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
    padHeight = canvas.height / 8;
    padMargin = padHeight / 3;
    padWidth = padHeight / 5;
    firstPlayerPos = secondPlayerPos = (canvas.height / 2) - (padHeight / 2);

    ball.x = canvas.width / 2 - ball.radius
    ball.y = canvas.height / 2

    if(Math.random() > 0.5){
      ball.velocity.x = -ball.velocity.x
    }
    if(Math.random() > 0.5){
      ball.velocity.y = -ball.velocity.y
    }


    var context = canvas.getContext('2d');
    context.fillStyle = "white"

    setInterval(function(){
      update(context), 16
    });
})

document.addEventListener('keydown', function(event) {
  keysPressed[event.key] = true;
});

document.addEventListener('keyup', function(event) {
  delete keysPressed[event.key];
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(padMargin, firstPlayerPos, padWidth, padHeight)
    ctx.fillRect(canvas.width - padMargin - padWidth, secondPlayerPos, padWidth, padHeight)
    drawCircle(ctx, ball.x, ball.y, ball.radius, "white")

}

function updateBall(){


  var maxY = canvas.height - ball.radius;
  if(ball.y > maxY || ball.y < ball.radius){
    ball.velocity.y = -ball.velocity.y * multiplicator;
  }

  var maxX = canvas.width - ball.radius;
  if(ball.x > maxX || ball.x < ball.radius){
    ball.velocity.x = -ball.velocity.x * multiplicator;
    //GOAL
  }

  ball.x += ball.velocity.x
  ball.y += ball.velocity.y


}

function updatePads(){

  if (keysPressed["w"]) {
    firstPlayerPos = firstPlayerPos - 2;
  }
  if (keysPressed["s"]) {
    firstPlayerPos = firstPlayerPos + 2;
  }
  if (keysPressed["ArrowUp"]) {
    secondPlayerPos = secondPlayerPos - 2;
  }
  if (keysPressed["ArrowDown"]) {
    secondPlayerPos = secondPlayerPos + 2;
  }
  firstPlayerPos = checkPos(firstPlayerPos)
  secondPlayerPos = checkPos(secondPlayerPos)
}

function drawCircle(ctx, x, y, radius, fill) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
  }