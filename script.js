// select the elements to interact with from HTML file
const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

// create our game grid matrix
// 0 - empty cell
// 1 - bar segment
const gridMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0], //this is our starting currentRowIndex
];

// vars to keep track of the game values as we play
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
let gameInterval;

function draw() {
  grid.innerHTML = '';

  gridMatrix.forEach(function (rowContent) {
    rowContent.forEach(function (cellContent) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (cellContent === 1) {
        cell.classList.add('bar');
      }

      grid.appendChild(cell);
    });
  });
}

function endGame(isVictory) {
  if (isVictory) {
    endGameText.innerHTML = 'YOU<br>WON!';
    endGameScreen.classList.add('win');
  }

  endGameScreen.classList.remove('hidden');
}

function onPlayAgain() {
  location.reload();
}

function updateScore() {
  score += barSize;
  scoreCounter.innerText = score.toString().padStart(5, 0);
}

function checkWin() {
  if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(gameInterval);
    endGame(true);
  }
}

function checkLost() {
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];

  if (!prevRow) return;
  for (let i = 0; i < currentRow.length; i++) {
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      currentRow[i] = 0;
      barSize--;
    }
    if (barSize === 0) {
      isGameOver = true;
      clearInterval(gameInterval);
      endGame(false);
    }
  }
}

function onStack() {
  checkWin();
  checkLost();
  updateScore();

  if (isGameOver) return;

  currentRowIndex--;
  barDirection = 'right';

  for (let i = 0; i < barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }
  draw();

  toggleDifficultyOverlay(false);
}

function moveRight(currentRow) {
  if (barDirection === 'right') {
    currentRow.pop();
    currentRow.unshift(0);
  }
}

function moveLeft(currentRow) {
  if (barDirection === 'left') {
    currentRow.shift();
    currentRow.push(0);
  }
}

function moveBar() {
  const currentRow = gridMatrix[currentRowIndex];

  if (barDirection === 'right') {
    moveRight(currentRow);

    const lastElement = currentRow[currentRow.length - 1];
    if (lastElement === 1) {
      barDirection = 'left';
    }
  } else if (barDirection === 'left') {
    moveLeft(currentRow);

    const firstElement = currentRow[0];
    if (firstElement === 1) {
      barDirection = 'right';
    }
  }
}

let currentDifficulty = 'easy';
let gameSpeed;

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
}

// Function to toggle visibility of the difficulty overlay
// ... Your existing code

function toggleDifficultyOverlay(visible) {
  const overlay = document.querySelector('.difficulty-overlay');
  overlay.classList.toggle('hidden', !visible);

  if (!visible) {
    overlay.classList.add('fadeOut');
  } else {
    overlay.classList.remove('fadeOut');
  }
}

function startGame() {
  // Clear existing interval if any
  if (gameInterval) {
    clearInterval(gameInterval);
  }

  // Set gameSpeed based on currentDifficulty
  switch (currentDifficulty) {
    case 'easy':
      gameSpeed = 600;
      break;
    case 'medium':
      gameSpeed = 400;
      break;
    case 'hard':
      gameSpeed = 200;
      break;
  }

  // Start a new game interval
  gameInterval = setInterval(main, gameSpeed);

  // Show the difficulty overlay when starting a new game
  toggleDifficultyOverlay(true);
}

function main() {
  toggleDifficultyOverlay(false);
  moveBar();
  draw();
}

// Events
stackBtn.addEventListener('click', () => {
  onStack();
  // Hide difficulty overlay when stacking
  toggleDifficultyOverlay(false);
});

playAgainBtn.addEventListener('click', () => {
  onPlayAgain();
  // Show difficulty overlay when playing again
  toggleDifficultyOverlay(true);
});

// Connect the startGame function to difficulty buttons
document.getElementById('easy-difficulty-btn').addEventListener('click', () => {
  setDifficulty('easy');
  // Start the game when difficulty is selected
  startGame();
});

document.getElementById('medium-difficulty-btn').addEventListener('click', () => {
  setDifficulty('medium');
  // Start the game when difficulty is selected
  startGame();
});

document.getElementById('hard-difficulty-btn').addEventListener('click', () => {
  setDifficulty('hard');
  // Start the game when difficulty is selected
  startGame();
});
