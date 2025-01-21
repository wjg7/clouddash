const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
const player = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 50, dx: 0 };
const obstacles = [];
const stars = [];
let gameOver = false;

// Load assets
const playerImg = new Image();
playerImg.src = 'assets/player.png';

const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.png';

const starImg = new Image();
starImg.src = 'assets/star.png';

// Add player controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.dx = -5;
  if (e.key === 'ArrowRight') player.dx = 5;
});

document.addEventListener('keyup', () => {
  player.dx = 0;
});

// Generate obstacles and stars
function generateObstacles() {
  if (Math.random() < 0.02) {
    obstacles.push({
      x: Math.random() * canvas.width,
      y: -50,
      width: 50,
      height: 50,
      dy: 3,
    });
  }
}

function generateStars() {
  if (Math.random() < 0.01) {
    stars.push({
      x: Math.random() * canvas.width,
      y: -50,
      width: 30,
      height: 30,
      dy: 3,
    });
  }
}

// Update game objects
function update() {
  player.x += player.dx;

  // Prevent player from going out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Update obstacles
  obstacles.forEach((obs, index) => {
    obs.y += obs.dy;

    // Check collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }

    // Remove off-screen obstacles
    if (obs.y > canvas.height) obstacles.splice(index, 1);
  });

  // Update stars
  stars.forEach((star, index) => {
    star.y += star.dy;

    // Check collection
    if (
      player.x < star.x + star.width &&
      player.x + player.width > star.x &&
      player.y < star.y + star.height &&
      player.y + player.height > star.y
    ) {
      score += 10;
      stars.splice(index, 1);
    }

    // Remove off-screen stars
    if (star.y > canvas.height) stars.splice(index, 1);
  });

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    // Save high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    alert('Game Over! Your score: ' + score);
    location.reload();
  }
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Draw obstacles
  obstacles.forEach((obs) => {
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
  });

  // Draw stars
  stars.forEach((star) => {
    ctx.drawImage(starImg, star.x, star.y, star.width, star.height);
  });

  // Draw score
  document.querySelector('.score').textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Game loop
function gameLoop() {
  generateObstacles();
  generateStars();
  update();
  draw();
}

gameLoop();
