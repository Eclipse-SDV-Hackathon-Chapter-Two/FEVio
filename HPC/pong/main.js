import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// 50 = 0
// 0-49 = down
// 51-100 = up
let value1 = 50;
let value2 = 50;

socket.on('paddleMove', (data) => {
  console.log(data);
  let player = data.player;
  if (player == 1) {
    value1 = data.value;
  } else if (player == 2) {
    value2 = data.value;
  }
});

document.querySelector('#app').innerHTML = `
<div class="outerContent">
  <h1 id="message" class="gameMessage">Press any button to start the game</h1>
  <div class="scoreBoard">
    <div class="playerScore leftScore">
      <h2 class="player1Tag">Player 1:</h2>
      <h2 class="scorePlayer1">0</h2>
    </div>
    <div class="playerScore rightScore">
      <h2 class="player2Tag">Player 2:</h2>
      <h2 class="scorePlayer2">0</h2>
    </div>
  </div>
  <div class="content">
    <div class="canvasContainer">
      <canvas id="myCanvas" class="chart"></canvas>
    </div>
  </div>
</div>

`
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let score_1 = document.querySelector('.scorePlayer1');
let score_2 = document.querySelector('.scorePlayer2');
let messageElement = document.getElementById('message');

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
const winningScore = 5;

const initialBallX = canvas.width / 2;
const initialBallY = canvas.height / 2;
const initialDx = 6; // Adjust speed as needed
const initialDy = 6;

let x = initialBallX;
let y = initialBallY;
let dx = initialDx;
let dy = -initialDy;

const ballRadius = 32;

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

let spinAngle = 0; // Current rotation angle of the ball
const spinSpeed = 0; // Speed of the spin (adjust as needed)

const ballImage = new Image();
ballImage.src = "ankaios.png";

let isSpawning = false;
let spawnStartTime = null;
const spawnDuration = 600;
let speedScaling = 0; // Scales from 0 to 1 during the spawn animation

function drawBall() {
  ctx.save();

  // Calculate the ball's properties if it is spawning
  let currentBallRadius = ballRadius; // Default size
  let currentOpacity = 1; // Default opacity

  if (isSpawning) {
    const now = performance.now();
    const elapsed = now - spawnStartTime;

    if (elapsed < spawnDuration) {
      const progress = elapsed / spawnDuration; // Progress from 0 to 1
      currentBallRadius = ballRadius * progress; // Gradually increase size
      currentOpacity = progress; // Gradually increase opacity
      speedScaling = progress; // Gradually scale speed
    } else {
      isSpawning = false; // End the animation
      speedScaling = 1; // Set speed scaling to normal
    }
  }

  // Set ball opacity
  ctx.globalAlpha = currentOpacity;

  ctx.beginPath();
  ctx.arc(x, y, currentBallRadius, 0, Math.PI * 2); // Draw the circle
  ctx.fillStyle = "#9c2f69"; // Color of the circle
  ctx.fill();
  ctx.closePath();

  // Draw the ball
  if (ballImage.complete) {
    // ctx.translate(x, y);
    // ctx.rotate(spinAngle);
    // ctx.translate(-x, -y);
    ctx.drawImage(
      ballImage,
      x - currentBallRadius,
      y - currentBallRadius,
      currentBallRadius * 2,
      currentBallRadius * 2
    );
    ctx.restore();

    // Draw the border
    ctx.beginPath();
    ctx.arc(x, y, currentBallRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#9c2f69";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
    spinAngle += spinSpeed;
  } else {
    // Fallback ball
    ctx.beginPath();
    ctx.arc(x, y, currentBallRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#410b54";
    ctx.fill();
    ctx.closePath();
  }

  ctx.restore();
  ctx.globalAlpha = 1; // Reset global alpha for other elements
}

const paddleHeight = 75;
const paddleWidth = 10;
const paddleXOffset = 2 * paddleWidth;

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

function drawField() {
  // Draw middle line
  ctx.beginPath();
  ctx.setLineDash([10, 5]); // Dashed line
  ctx.moveTo(canvas.width / 2, 0); // Start at the top middle
  ctx.lineTo(canvas.width / 2, canvas.height); // Draw to the bottom middle
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; // Semi-transparent white
  ctx.lineWidth = 5; // Line thickness
  ctx.stroke();
  ctx.closePath();

  // Draw center circle
  ctx.beginPath();
  ctx.setLineDash([]); // Remove dashes for the circle
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2); // Center and radius
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();
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
    ctx.fillStyle = "#40225f"; // Default paddle color
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
    ctx.fillStyle = "#9c2f6d"; // Default paddle color
  }
  ctx.fill();
  ctx.closePath();
}

function setPaddle1Y(paddle1YValue) {
  console.log("setPaddle1Y: ", paddle1YValue)
  paddle1Y = paddle1YValue;
}

function setPaddle2Y(paddle2YValue) {
  console.log("setPaddle2Y: ", paddle2YValue)
  paddle2Y = paddle2YValue;
}

function getDelta(value) {
  let delta = 0;
  // up
  if (value > 50 && value <= 100) {
    if (value >= 75) {
      delta = 10;
    } else {
      delta = 5;
    }
  // down
  } else if (value >= 0 && value < 50) {
    if (value < 25) {
      delta = -10;
    } else {
      delta = -5;
    }
  }
  return delta;
}

function draw() {
  //console.log("draw");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //drawField();
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

  let delta1 = getDelta(value1);
  let delta2 = getDelta(value2);

  if (delta1 > 0) {
    paddle1Y = Math.min(paddle1Y + delta1, canvas.height - paddleHeight);
  } else if (delta1 < 0) {
    paddle1Y = Math.max(paddle1Y + delta1, 0);
  }

  if (delta2 > 0) {
    paddle2Y = Math.min(paddle2Y + delta2, canvas.height - paddleHeight);
  } else if (delta2 < 0) {
    paddle2Y = Math.max(paddle2Y + delta2, 0);
  }
 
  drawPaddle1();
  drawPaddle2();

  // Ball collision with left paddle (player 1)
  if (dx < 0 && x - ballRadius <= paddleWidth + paddleXOffset) { // Ball moving left and touches paddle plane
    if (y + ballRadius >= paddle1Y && y - ballRadius <= paddle1Y + paddleHeight) { // Include ball radius in vertical check
      dx = -dx; // Reverse ball direction on x-axis
      handlePaddleHit(1);

      // Adjust vertical speed based on hit position (angle reflection)
      const paddleCenter = paddle1Y + paddleHeight / 2;
      const distanceFromCenter = y - paddleCenter;
      dy += distanceFromCenter * 0.1; // Adjust vertical speed based on hit position
    } else {
      console.log("Missed player 1 paddle");
      resetGame(1);
    }
  }

  // Ball collision with right paddle (player 2)
  if (dx > 0 && x + ballRadius >= canvas.width - paddleWidth - paddleXOffset) { // Ball moving right and touches paddle plane
    if (y + ballRadius >= paddle2Y && y - ballRadius <= paddle2Y + paddleHeight) { // Include ball radius in vertical check
      dx = -dx; // Reverse ball direction on x-axis
      handlePaddleHit(2);

      // Adjust vertical speed based on hit position (angle reflection)
      const paddleCenter = paddle2Y + paddleHeight / 2;
      const distanceFromCenter = y - paddleCenter;
      dy += distanceFromCenter * 0.1; // Adjust vertical speed based on hit position
    } else {
      console.log("Missed player 2 paddle");
      resetGame(2);
    }
  }
  
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
  
  x += dx * speedScaling;
  y += dy * speedScaling;
}

let gameStarted = false;
let gameRunning = false;

function resetGame(playerMissed) {
  if (!gameRunning) return;

  // Update score based on which player missed
  if (playerMissed === 1) {
    scorePlayer2++;
    score_2.innerHTML = scorePlayer2; // Update Player 2 score in DOM
  } else if (playerMissed === 2) {
    scorePlayer1++;
    score_1.innerHTML = scorePlayer1; // Update Player 1 score in DOM
  }

  socket.emit("playerScores", {
    score1: scorePlayer1,
    score2: scorePlayer2
  });

  if (scorePlayer1 >= winningScore || scorePlayer2 >= winningScore) {
    endGame();
    return;
  }

  // Reset ball position and direction
  x = initialBallX;
  y = initialBallY;

  const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // Range: [-PI/6, PI/6] for variation
  const speed = initialDx; // Ball's initial speed

  // Determine direction based on which player missed
  const direction = playerMissed === 1 ? 1 : -1;

  // Calculate dx and dy based on the angle
  dx = direction * speed * Math.cos(angle); // Horizontal velocity
  dy = speed * Math.sin(angle);

  value1 = 50;
  value2 = 50;

  isSpawning = true;
  spawnStartTime = performance.now();
  speedScaling = 0;
}

let intervalId;
let winner = "Player 1";

function endGame() {
  gameRunning = false;
  winner = scorePlayer1 >= winningScore ? "Player 1" : "Player 2";

  clearInterval(intervalId);
  // Show a message announcing the winner
  const messageElement = document.getElementById("message");
  messageElement.style.display = "block";
  messageElement.textContent = `${winner} Wins! Press any button to restart.`;

  // Reset scores and restart on key press
  document.addEventListener("keydown", restartGame, { once: true });
}

function restartGame() {
  // Reset scores and game state
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  score_1.innerHTML = scorePlayer1;
  score_2.innerHTML = scorePlayer2;

  gameRunning = true;

  // Hide the message
  const messageElement = document.getElementById("message");
  messageElement.style.display = "none";

  // Reset ball position and direction
  x = initialBallX;
  y = initialBallY;

  const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // Range: [-PI/6, PI/6] for variation
  const speed = initialDx; // Ball's initial speed

  // Determine direction based on which player missed
  const direction = winner === "Player 2" ? 1 : -1;

  // Calculate dx and dy based on the angle
  dx = direction * speed * Math.cos(angle); // Horizontal velocity
  dy = speed * Math.sin(angle);

  // reset player paddles
  setPaddle1Y((canvas.height - paddleHeight) / 2);
  setPaddle2Y((canvas.height - paddleHeight) / 2);

  value1 = 50;
  value2 = 50;

  intervalId = setInterval(draw, 10);
}

document.addEventListener("keydown", () => {
  if (!gameStarted) {
    messageElement.style.display = "none";
    intervalId = setInterval(draw, 10);
    gameStarted = true;
    gameRunning = true;
    isSpawning = true;
    spawnStartTime = performance.now();
    speedScaling = 0;
  }
});

function sendPlayerScores() {
  socket.emit("playerScores", {
    score1: scorePlayer1,
    score2: scorePlayer2
  });
}

setInterval(sendPlayerScores, 200);

/*
function startGame() {
  setInterval(draw, 10);
}

document.getElementById("runButton").addEventListener("click", function () {
  startGame();
  this.disabled = true;
});*/