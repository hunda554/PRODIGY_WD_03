const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;

const boardState = Array(tiles.length);
boardState.fill(null);

// Elements
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
const gameArea = document.getElementById("game-area");
const modeSelection = document.getElementById("mode-selection");
const playWithFriendBtn = document.getElementById("play-with-friend");
const playWithAiBtn = document.getElementById("play-with-ai");

playAgain.addEventListener("click", startNewGame);

// Mode selection
let playMode = "friend"; // Default is friend mode

playWithFriendBtn.addEventListener("click", () => {
  playMode = "friend";
  startGame();
});

playWithAiBtn.addEventListener("click", () => {
  playMode = "ai";
  startGame();
});

function startGame() {
  modeSelection.classList.add("hidden");
  gameArea.classList.remove("hidden");
  startNewGame();
}

// Sounds
const gameOverSound = new Audio("sounds/game_over.wav");
const clickSound = new Audio("sounds/click.wav");

tiles.forEach((tile) => tile.addEventListener("click", tileClick));

// AI move logic (random for now)
function aiMove() {
  let availableTiles = [];
  
  // Find available tiles
  tiles.forEach((tile, index) => {
    if (!tile.innerText) {
      availableTiles.push(index);
    }
  });

  if (availableTiles.length === 0) return; // No moves left

  // Pick a random tile for the AI
  const randomTileIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  const tile = tiles[randomTileIndex];
  tile.innerText = PLAYER_O;
  boardState[randomTileIndex] = PLAYER_O;

  clickSound.play();
  checkWinner();
  turn = PLAYER_X;
  setHoverText();
}

function setHoverText() {
  // Remove all hover text
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;
  if (tile.innerText != "") {
    return;
  }

  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
    clickSound.play();
    setHoverText();
    checkWinner();

    // If playing with AI, let the AI make a move
    if (playMode === "ai" && !gameOverArea.classList.contains("visible")) {
      setTimeout(aiMove, 500); // AI moves after 0.5 seconds
    }
  } else if (playMode === "friend") {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
    clickSound.play();
    setHoverText();
    checkWinner();
  }
}

function checkWinner() {
  // Check for a winner
  for (const winningCombination of winningCombinations) {
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass);
      gameOverScreen(tileValue1);
      return;
    }
  }

  // Check for a draw
  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  gameOverSound.play();
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = PLAYER_X;
  setHoverText();
}

// Winning combinations
const winningCombinations = [
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];
