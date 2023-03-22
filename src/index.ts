import "./scss/styles.scss";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const gameContainer = document.getElementById(
  "game-container"
) as HTMLDivElement;

const flappyImg = new Image();
flappyImg.onload = function () {
  // call loop() once the image has loaded
  console.log("Se hizo el load");

  loop();
};
flappyImg.src = "https://i.imgur.com/w79JtQ1.png";

// Game constants
const FLAP_SPEED: number = -5;
const BIRD_WIDTH: number = 40;
const BIRD_HEIGHT: number = 30;
const PIPE_WIDTH: number = 50;
const PIPE_GAP: number = 125;

// Game variables
let birdX: number = 30;
let birdY: number = 3;
let birdVelocity: number = 0;
let birdAcceleration: number = 0.1;

// Pipe variables
let pipeX: number = 400;
let pipeY: number = canvas.height - 200;

// Score and high score variables
let scoreDiv = document.getElementById("score-display") as HTMLDivElement;
let score: number = 0;
let highScore: number = 0;

document.body.onkeyup = function (e: KeyboardEvent): void {
  if (e.code === "Space") {
    birdVelocity = FLAP_SPEED;
  }
};

/* CAMBIAR A TS */
function collisionCheck() {
  // Create bounding Boxes for the bird and the pipes

  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
  };

  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY,
  };

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP,
  };

  // Check for collision with upper pipe box
  if (
    birdBox.x + birdBox.width > topPipeBox.x &&
    birdBox.x < topPipeBox.x + topPipeBox.width &&
    birdBox.y < topPipeBox.y
  ) {
    return true;
  }

  // Check for collision with lower pipe box
  if (
    birdBox.x + birdBox.width > bottomPipeBox.x &&
    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    birdBox.y + birdBox.height > bottomPipeBox.y
  ) {
    return true;
  }

  // check if bird hits boundaries
  if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
    return true;
  }

  return false;
}

function hideEndMenu(): void {
  const endMenu = document.getElementById("end-menu");
  if (endMenu) {
    endMenu.style.display = "none";
  }
  gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu(): void {
  const endMenu = document.getElementById("end-menu");
  if (endMenu) {
    endMenu.style.display = "block";
  }

  gameContainer.classList.add("backdrop-blur");

  const endScore = document.getElementById("end-score");
  if (endScore) {
    endScore.innerHTML = score.toString();
  }
}

function endGame() {
  alert("Loose");
}

function loop(): void {
  // reset the ctx after every loop iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw the bird
  ctx.drawImage(flappyImg, birdX, birdY);

  // draw the pipe
  ctx.fillStyle = "#333";
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  // now we need to add an collision check to display our end-menu
  // and end the game
  // the collisionCheck will return us true if we hace a collision
  // otherwise false
  if (collisionCheck()) {
    endGame();
    return;
  }

  // forgot to move the pipe
  pipeX -= 1.5;
  // If the pipe moves out of the frame we need to reset the pipe
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  requestAnimationFrame(loop);
}
