import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on('paddleMove', (data) => {
  console.log(data);
  // player = data.player;
  // value = data.value;
});

/*function movePaddle(player, direction) {
  const newY = (player === 1 ? paddle1Y : paddle2Y) + direction * 10; // Paddle speed
  socket.emit('movePaddle', { player, y: newY });
}*/

document.querySelector('#app').innerHTML = `
  <div class="content">
    <div class="containerScore">
      <h1 class="scorePlayer1">0</h1>
    </div>
    <div class="canvasContainer">
      <canvas id="myCanvas" class="chart"></canvas>
    </div>
    <div class="containerScore">
      <h1 class="scorePlayer2">0</h1>
    </div>
  </div>
  <button id="runButton">Start game</button>
`
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let score_1 = document.querySelector('.scorePlayer1');
let score_2 = document.querySelector('.scorePlayer2');

fitToContainer(canvas);

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width  = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

}

let scorePlayer1 = 0;
let scorePlayer2 = 0;

const initialBallX = canvas.width / 2;
const initialBallY = canvas.height / 2;
const initialDx = 8; // Adjust speed as needed
const initialDy = 8;

let x = initialBallX;
let y = initialBallY;
let dx = initialDx;
let dy = -initialDy;

const ballRadius = 25;

let paddle1Hit = false;
let paddle2Hit = false;

function handlePaddleHit(paddle) {
  if (paddle === 1) {
    paddle1Hit = true;
    setTimeout(() => (paddle1Hit = false), 250); 
  } else if (paddle === 2) {
    paddle2Hit = true;
    setTimeout(() => (paddle2Hit = false), 250);
  }
}

let spinAngle = 10; // Current rotation angle of the ball
const spinSpeed = 0.1; // Speed of the spin (adjust as needed)

const ballImage = new Image();
ballImage.src = "ankaios.png";

function drawBall() {
  if (ballImage.complete) {
    ctx.save();

    // Translate and rotate the canvas
    ctx.translate(x, y);
    ctx.rotate(spinAngle);
    ctx.translate(-x, -y);

    // Draw the SVG image
    ctx.drawImage(
      ballImage,
      x - ballRadius,
      y - ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );

    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // Circle border
    ctx.strokeStyle = "#9c2f69";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    // Increment spin angle
    spinAngle += spinSpeed;
  } else {
    // Fallback circle
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#410b54";
    ctx.fill();
    ctx.closePath();
  }
}

const paddleHeight = 75;
const paddleWidth = 10;
const paddleXOffset = paddleWidth;

let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;

let wPressed = false;
let sPressed = false;

let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "w") {
    wPressed = true;
  }
  if (e.key === "ArrowUp") {
    upPressed = true;
  }
  if (e.key === "s") {
    sPressed = true;
  }
  if (e.key === "ArrowDown") {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "w") {
    wPressed = false;
  }
  if (e.key === "ArrowUp") {
    upPressed = false;
  }
  if (e.key === "s") {
    sPressed = false;
  }
  if (e.key === "ArrowDown") {
    downPressed = false;
  }
}

function drawPaddle1() {
  ctx.beginPath();
  ctx.rect(0 + paddleXOffset, paddle1Y, paddleWidth, paddleHeight);
  if (paddle1Hit) {
    const gradient = ctx.createLinearGradient(0, paddle1Y, paddleWidth, paddle1Y + paddleHeight);
    gradient.addColorStop(0, "#9b6d99");
    gradient.addColorStop(1, "#9c2f69");
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = "#410b54"; // Default paddle color
  }
  ctx.fill();
  ctx.closePath();
}

function drawPaddle2() {
  ctx.beginPath();
  ctx.rect(canvas.width - paddleWidth - paddleXOffset, paddle2Y, paddleWidth, paddleHeight);
  if (paddle2Hit) {
    const gradient = ctx.createLinearGradient(
      canvas.width - paddleWidth - paddleXOffset,
      paddle2Y,
      canvas.width - paddleXOffset,
      paddle2Y + paddleHeight
    );
    gradient.addColorStop(0, "#9b6d99"); // Start color (red)
    gradient.addColorStop(1, "#9c2f69"); // End color (yellow)
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = "#410b54"; // Default paddle color
  }
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  if (sPressed) {
    paddle1Y = Math.min(paddle1Y + 7, canvas.height - paddleHeight);
  } else if (wPressed) {
    paddle1Y = Math.max(paddle1Y - 7, 0);
  }

  if (downPressed) {
    paddle2Y = Math.min(paddle2Y + 7, canvas.height - paddleHeight);
  } else if (upPressed) {
    paddle2Y = Math.max(paddle2Y - 7, 0);
  }

  drawPaddle1();
  drawPaddle2();

  if (x - ballRadius < paddleWidth) {
    if (y > paddle1Y && y < paddle1Y + paddleHeight) {
      dx = -dx; // Reverse ball direction on x-axis
      handlePaddleHit(1);
    } else {
      console.log("Missed player 1 paddle");
      resetGame(1);
    }
  }

  // Ball collision with right paddle (player 2)
  if (x + ballRadius > canvas.width - paddleWidth) {
    if (y > paddle2Y && y < paddle2Y + paddleHeight) {
      dx = -dx; // Reverse ball direction on x-axis
      handlePaddleHit(2);
    } else {
      console.log("Missed player 2 paddle");
      resetGame(2); // Optionally reset game or adjust score
    }
  }
  
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
  
  x += dx;
  y += dy;
}

function resetGame(playerMissed) {
  // Update score based on which player missed
  if (playerMissed === 1) {
    scorePlayer2++;
    score_2.innerHTML = scorePlayer2; // Update Player 2 score in DOM
  } else if (playerMissed === 2) {
    scorePlayer1++;
    score_1.innerHTML = scorePlayer1; // Update Player 1 score in DOM
  }

  // Reset ball position and direction
  x = initialBallX;
  y = initialBallY;
  dx = (playerMissed === 1 ? 1 : -1) * initialDx; // Reverse direction based on who missed
  dy = initialDy;
}

function startGame() {
  setInterval(draw, 10);
}

document.getElementById("runButton").addEventListener("click", function () {
  startGame();
  this.disabled = true;
});