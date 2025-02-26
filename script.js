const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdImg = new Image();
birdImg.src = "bird1.jpg"; // Replace with the correct image path

let bird = { 
    x: 50, 
    y: 200, 
    width: 60, 
    height: 40, 
    velocity: 0, 
    gravity: 0.3, 
    lift: -7 
};

let pipes = [];
let score = 0;
let pipeWidth = 50;
let pipeGap = 150;
let gameRunning = false;
let paused = false;
let startedJumping = false;

const jumpSound = document.getElementById('jumpSound');
const gameOverSound = document.getElementById('gameOverSound');
const backgroundMusic = document.getElementById('backgroundMusic');

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function showWelcomeScreen() {
    document.getElementById("welcomeScreen").style.display = "block";
    document.getElementById("gameOverScreen").style.display = "none";
}

function startGame() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    gameRunning = true;
    score = 0;
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    startedJumping = false;
    jumpSound.pause();
    jumpSound.currentTime = 0;
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    backgroundMusic.play();
    updateGame();
}

function quitGame() {
    document.location.reload();
}

function restartGame() {
    startGame();
}



function stopGame() {
    gameRunning = false;
    showGameOver();
}

function showGameOver() {
    document.getElementById("finalScore").innerText = "Score: " + score;
    document.getElementById("gameOverScreen").style.display = "block";
    gameOverSound.play();
    backgroundMusic.pause();
    
}

function createPipe() {
    if (!gameRunning || paused) return;
    let height = Math.floor(Math.random() * (300 - 100) + 100);
    pipes.push({ x: canvas.width, top: height, bottom: height + pipeGap });
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

function updateGame() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    pipes.forEach(pipe => { pipe.x -= 2; });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) createPipe();

    if (pipes[0] && pipes[0].x < -pipeWidth) { pipes.shift(); score++; }

    drawBird();
    drawPipes();

    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) {
                gameRunning = false;
                showGameOver();
            }
        }
    });

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameRunning = false;
        showGameOver();
    }

    if (gameRunning) requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameRunning && !paused) {
        bird.velocity = bird.lift;
        startedJumping = true;
        jumpSound.play();
    }
});

document.addEventListener("touchstart", () => {
    if (gameRunning && !paused) {
        bird.velocity = bird.lift;
        // startedJumping = true;
    }
});

birdImg.onload = () => {
    showWelcomeScreen();
};