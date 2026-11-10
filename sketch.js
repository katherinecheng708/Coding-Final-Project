function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

let img;

function preload() {
  img = loadImage("image/images.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(200);
  image(img, windowWidth / 2, windowHeight / 2);
}

// Step 2 — Rectangular cells & click selection
// This version introduces a 2D array of cells (0 = off, 1 = on), draws each cell as a rectangle, and lets you click to toggle a cell’s state. We keep the hover outline for clarity and add a “C = clear” shortcut.

// === tunables ===
let cellSize = 25; // try other values like 12, 25, 40...

// === derived ===
let colCount, rowCount;

// === model: 2D array cells[col][row] with values 0 (off) or 1 (on) ===
let cells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textSize(14);
  textAlign(LEFT, TOP);
  recalcGrid();
  initCells(0); // start with all off
  describe('A clickable grid of rectangles. Click toggles a cell on/off.');
}

function draw() {
  background(255);

  // draw cells (view from model)
  noStroke();
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const alive = cells[c][r] === 1;

      // choose a fill per state
      fill(alive ? 0 : 0);
      rect(x, y, cellSize, cellSize);
    }
  }

  // light grid lines on top (optional)
  stroke(200);
  strokeWeight(1);
  for (let c = 0; c <= colCount; c++) {
    const x = c * cellSize;
    line(x, 0, x, rowCount * cellSize);
  }
  for (let r = 0; r <= rowCount; r++) {
    const y = r * cellSize;
    line(0, y, colCount * cellSize, y);
  }

  // hover highlight & coordinates
  const { col, row } = mouseCell();
  if (inBounds(col, row)) {
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(col * cellSize, row * cellSize, cellSize, cellSize);
  }

  // label
  drawLabel(
    `cellSize=${cellSize} | cols=${colCount} rows=${rowCount}` +
      (inBounds(col, row)
        ? ` | hover: col=${col} row=${row} val=${cells[col][row]}`
        : '')
  );
}

// === interactions ===
function mousePressed() {
  const { col, row } = mouseCell();
  if (inBounds(col, row)) {
    cells[col][row] = cells[col][row] ? 0 : 1; // toggle
  }
}

function keyPressed() {
  if (key === 'C' || key === 'c') initCells(0); // clear board
}

// === helpers ===
function recalcGrid() {
  colCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);
}

function initCells(fillValue = 0) {
  cells = [];
  for (let c = 0; c < colCount; c++) {
    cells[c] = [];
    for (let r = 0; r < rowCount; r++) {
      cells[c][r] = fillValue;
    }
  }
}

function mouseCell() {
  // constrain to avoid width/height edge rounding issues
  const mx = constrain(mouseX, 0, width - 1);
  const my = constrain(mouseY, 0, height - 1);
  return {
    col: floor(mx / cellSize),
    row: floor(my / cellSize),
  };
}

function inBounds(col, row) {
  return col >= 0 && col < colCount && row >= 0 && row < rowCount;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  recalcGrid();
  initCells(0); // simple approach: reset on resize (we’ll refine later if needed)
}

// small label with backdrop
function drawLabel(s) {
  const pad = 6;
  const w = textWidth(s) + pad * 2;
  const h = 20 + pad * 2;
  noStroke();
  fill(255, 240);
  rect(10, 10, w, h);
  fill(0);
  text(s, 10 + pad, 10 + pad);
}

