import "./style.css";
import { ARROW_KEYS, BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, PIECES } from "./constants.js";

// 1. Initialize canvas and context

const canvas = document.querySelector("#board");
const context = canvas.getContext("2d");
const $score = document.getElementById("score-text");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

let score = 0;

// 2. Create board

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

function createBoard(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(0));
}

// 3. Player piece

const piece = {
  position: { x: 5, y: 0 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

// 4. Move piece

document.addEventListener("keydown", event => {
  if (event.key === ARROW_KEYS.LEFT) {
    piece.position.x--;
    if (checkCollision(piece, board)) {
      piece.position.x++;
    }
  } else if (event.key === ARROW_KEYS.RIGHT) {
    piece.position.x++;
    if (checkCollision(piece, board)) {
      piece.position.x--;
    }
  } else if (event.key === ARROW_KEYS.DOWN) {
    piece.position.y++;
    if (checkCollision(piece, board)) {
      piece.position.y--;
      solidifyPiece(piece, board);
      removeRows(board);
    }
  } else if (event.key === ARROW_KEYS.UP) {
    const rotatedShape = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotatedShape.push(row);
    }
    const previousShape = piece.shape;
    piece.shape = rotatedShape;
    if (checkCollision(piece, board)) {
      piece.shape = previousShape;
    }
  }
});

// 5. Collision detection

function checkCollision(piece, board) {
  return piece.shape.find((row, y) =>
    row.find(
      (value, x) => value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0,
    ),
  );
}

// 6. Solidify piece

function solidifyPiece(piece, board) {
  // Add piece to board
  piece.shape.forEach((row, y) =>
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    }),
  );
  // Reset piece position
  piece.position.x = 5;
  piece.position.y = 0;
  // Set random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];
  if (checkCollision(piece, board)) {
    window.alert(`Game Over!! Your score was: ${score}`);
    board.forEach(row => row.fill(0));
  }
}

// 7. Remove rows

function removeRows(board) {
  // Find rows to remove
  const rowsToRemove = [];
  board.forEach((row, index) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(index);
    }
  });
  rowsToRemove.forEach(row => {
    // Remove row
    board.splice(row, 1);
    // Add new row at the beginning
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    // Update score
    score += 10;
  });
}

// Game loop & draw

let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    piece.position.y++;
    if (checkCollision(piece, board)) {
      piece.position.y--;
      solidifyPiece(piece, board);
      removeRows(board);
    }
    dropCounter = 0;
  }

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "yellow";
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "red";
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });

  $score.innerText = score;
}

update();
