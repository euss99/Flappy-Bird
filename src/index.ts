import "./scss/styles.scss";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const gameContainer = document.getElementById(
  "game-container"
) as HTMLDivElement;

const flappyImg = new Image();
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

// we add a bool variable, so we can check when flappy passes we increase
// the value
let scored = false;

// Declares a variable indicating whether the game has ended
let gameOver = false;

document.body.onkeyup = function(e) {
  if (!gameOver && e.code == 'Space') {
      birdVelocity = FLAP_SPEED;
  } else if (gameOver && e.code == 'Space') {
      hideEndMenu();
      resetGame();
      loop();
      gameOver = false;
  }
}

document
  .getElementById("restart-button")!
  .addEventListener("click", function () {
    hideEndMenu();
    resetGame();
    loop();
  });

function increaseScore(): void {
  // increase now our counter when our flappy passes the pipes
  if (
    birdX > pipeX + PIPE_WIDTH &&
    (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
    !scored
  ) {
    score++;
    scoreDiv.innerHTML = score.toString();
    scored = true;
  }

  // reset the flag, if bird passes the pipes
  if (birdX < pipeX + PIPE_WIDTH) {
    scored = false;
  }
}

function collisionCheck(): boolean {
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
  const endMenu = document.getElementById("end-menu") as HTMLElement;
  endMenu.style.display = "none";
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

  // This way we update always our highscore at the end of our game
  // if we have a higher high score than the previous
  if (highScore < score) {
    highScore = score;
  }

  const bestScore = document.getElementById("best-score");
  if (bestScore) {
    bestScore.innerHTML = highScore.toString();
  }
}

// We reset the values to the beginning so we start with the bird at the beginning
function resetGame(): void {
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;

  pipeX = 400;
  pipeY = canvas.height - 200;

  score = 0;
}

function endGame(): void {
  if (!gameOver) {
    showEndMenu();
    gameOver = true;
}
}

function loop(): void {
  // reset the ctx after every loop iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Flappy Bird
  ctx.drawImage(flappyImg, birdX, birdY);

  // Draw Pipes
  ctx.fillStyle = "#333";
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  // now we would need to add an collision check to display our end-menu
  // and end the game
  // the collisionCheck will return us true if we have a collision
  // otherwise false
  if (collisionCheck()) {
    endGame();
    return;
  }

  // forgot to move the pipes
  pipeX -= 1.5;
  // if the pipe moves out of the frame we need to reset the pipe
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  // apply gravity to the bird and let it move
  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  // always check if you call the function ...
  increaseScore();
  requestAnimationFrame(loop);
}

loop();
