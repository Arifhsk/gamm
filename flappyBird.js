const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const playerDisplay = document.getElementById('playerDisplay');

let playerName = '';
let score = 0;

// Game constants
const GRAVITY = 0.3;
const FLAP = -5;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 150;
const PIPE_SPEED = 1;
const PIPE_INTERVAL = 180;

// Load images
const birdImg = new Image();
birdImg.src = 'bird.png';
const pipeImg = new Image();
pipeImg.src = 'pipe.png';

// Bird properties
const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    speed: 0,
    update() {
        this.speed += GRAVITY;
        this.y += this.speed;
        if (this.y + this.height > canvas.height || this.y < 0) {
            resetGame();
        }
    },
    draw() {
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
    },
    flap() {
        this.speed = FLAP;
    }
};

// Pipes array
const pipes = [];
let frameCount = 0;

function addPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - 200)) + 50;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: PIPE_WIDTH,
        height: pipeHeight,
        passed: false,
        isTop: true
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + PIPE_SPACING,
        width: PIPE_WIDTH,
        height: canvas.height - pipeHeight - PIPE_SPACING,
        passed: false,
        isTop: false
    });
}

function update() {
    bird.update();

    frameCount++;
    if (frameCount % PIPE_INTERVAL === 0) {
        addPipe();
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }

        if (!pipes[i].passed && pipes[i].x + pipes[i].width < bird.x) {
            pipes[i].passed = true;
            score++;
            scoreBoard.innerText = `Score: ${score}`;
        }

        if (collision(bird, pipes[i])) {
            resetGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();

    for (const pipe of pipes) {
        if (pipe.isTop) {
            ctx.drawImage(pipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
        } else {
            ctx.drawImage(pipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
        }
    }
}

function collision(bird, pipe) {
    return (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
    );
}

function resetGame() {
    bird.y = 150;
    bird.speed = 0;
    pipes.length = 0;
    score = 0;
    scoreBoard.innerText = `Score: ${score}`;
    frameCount = 0;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.flap();
    }
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    playerName = document.getElementById('playerName').value;
    if (playerName) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'flex';
        playerDisplay.innerText = `Player: ${playerName}`;
        gameLoop();
    } else {
        alert('Please enter your name');
    }
}

birdImg.onload = function() {
    pipeImg.onload = function() {
        startGame();
    };
};
