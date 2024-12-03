const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const topLeftElement = document.getElementById('top-left');
const topRightElement = document.getElementById('top-right');
const bottomLeftElement = document.getElementById('bottom-left');
const bottomRightElement = document.getElementById('bottom-right');
const middleTopElement = document.getElementById('middle-top');
const middleBottomElement = document.getElementById('middle-bottom');
const middleLeftElement = document.getElementById('middle-left');
const middleRightElement = document.getElementById('middle-right');

const gridSize = 20;
const targetLength = 7; // Adjust target length to 7
const word = "SALVATION";
let snake = [{ x: gridSize * 2, y: gridSize * 2 }];
let food = generateFood();
let direction = 'RIGHT';
let score = 0;
let angle = 0;

canvas.width = 500; // Increase canvas size
canvas.height = 500; // Increase canvas size

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    if (gameOver()) {
        restartGame();
        return;
    }
    if (snake.length >= targetLength) {
        startRainbowBackground();
        setTimeout(() => {
            blinkScreen();
        }, 7000);
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawReuleauxTriangle();
        drawFood();
        moveSnake();
        drawSnake();
        updateWords();
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = '#000'; // Black background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawReuleauxTriangle() {
    angle += 0.01; // Adjust rotation speed
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    const radius = 250; // Increase radius
    for (let i = 0; i < 3; i++) {
        const x = radius * Math.cos((i * 2 * Math.PI) / 3 - Math.PI / 6);
        const y = radius * Math.sin((i * 2 * Math.PI) / 3 - Math.PI / 6);
        ctx.lineTo(x, y);
        ctx.arc(x, y, radius, (i * 2 * Math.PI) / 3 - Math.PI / 2, ((i + 1) * 2 * Math.PI) / 3 - Math.PI / 2);
    }
    ctx.closePath();
    ctx.strokeStyle = '#fff'; // White border
    ctx.lineWidth = 5; // Thicker border
    ctx.stroke();
    ctx.restore();
}

function drawSnake() {
    ctx.fillStyle = '#fff'; // White snake
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'RIGHT') head.x += gridSize;
    else if (direction === 'LEFT') head.x -= gridSize;
    else if (direction === 'UP') head.y -= gridSize;
    else if (direction === 'DOWN') head.y += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function drawFood() {
    if (snake.length === targetLength - 1) {
        ctx.fillStyle = '#ffd700'; // Gold color for the last food item
    } else {
        ctx.fillStyle = '#f00'; // Red color for regular food items
    }
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    return { x, y };
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    if (keyPressed === LEFT_KEY && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (keyPressed === UP_KEY && direction !== 'DOWN') {
        direction = 'UP';
    } else if (keyPressed === RIGHT_KEY && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (keyPressed === DOWN_KEY && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function gameOver() {
    const head = snake[0];
    const hitWall = head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height;
    const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

    return hitWall || hitSelf;
}

function restartGame() {
    snake = [{ x: gridSize * 2, y: gridSize * 2 }];
    food = generateFood();
    direction = 'RIGHT';
    score = 0;
    gameLoop();
}

function updateWords() {
    if (snake.length <= targetLength - 1) {
        const letters = word.slice(0, (snake.length - 1) * 2);
        topLeftElement.textContent = letters;
        topRightElement.textContent = letters;
        bottomLeftElement.textContent = letters;
        bottomRightElement.textContent = letters;
        middleTopElement.textContent = letters;
        middleBottomElement.textContent = letters;
        middleLeftElement.textContent = letters;
        middleRightElement.textContent = letters;
    } else if (snake.length === targetLength) {
        topLeftElement.textContent = word;
        topRightElement.textContent = word;
        bottomLeftElement.textContent = word;
        bottomRightElement.textContent = word;
        middleTopElement.textContent = word;
        middleBottomElement.textContent = word;
        middleLeftElement.textContent = word;
        middleRightElement.textContent = word;
    }
}

function startRainbowBackground() {
    let colors = [
        "#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3", 
        "#ff00ff", "#00ffff", "#ff1493", "#7fff00", "#ff4500", "#8a2be2", "#ff6347"
    ];
    let i = 0;
    let interval = setInterval(() => {
        document.body.style.backgroundColor = colors[i];
        i = (i + 1) % colors.length;
    }, 100); // Rapid color change every 100ms

    setTimeout(() => {
        clearInterval(interval);
        blinkScreen();
    }, 7000); // Stop after 7 seconds
}

function blinkScreen() {
    let blinks = 7;
    let blinkInterval = setInterval(() => {
        document.body.style.backgroundColor = document.body.style.backgroundColor === '#000' ? '#fff' : '#000';
        blinks--;
        if (blinks <= 0) {
            clearInterval(blinkInterval);
            fadeOutScreen();
        }
    }, 200); // Blink every 200ms
}

function fadeOutScreen() {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'title.html';
    }, 2000); // 2-second fade-out duration
}

gameLoop();