import "./style.css";

// 1. Initialize canvas and context

const canvas = document.querySelector("#board");
const context = canvas.getContext("2d");

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// 2. Game loop

function update() {
  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

update();
