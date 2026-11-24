//Variables
let img1;
let cellSize = 30; 
let colCount, rowCount;
let cells = [];
let currentColor = [255, 255, 255];

function preload() {
  img1 = loadImage("image/Coloringsheet.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textSize(14);
  textAlign(LEFT, TOP);
  recalcGrid();
  initCells(0); // start with all off
  describe('A clickable grid of rectangles. Click toggles a cell on/off.');
  imageMode(CENTER);
}

function draw() {
  //background(200);
  background(255);
  //background(255);

  let scale = 2;
  //let newW = img1.width * scale;
  //let newH = img1.height * scale;
  image(img1, width / 2, height / 2); 

  // draw cells (view from model)
  noStroke();
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      const x = c * cellSize;
      const y = r * cellSize;
      //const alive = cells[c][r] === 1;

      // choose a fill per state
      //fill(alive ? 0 : 255);
      //rect(x, y, cellSize, cellSize);
      if (!cells[c][r].revealed) {
        fill(cells[c][r].color);
        rect(x, y, cellSize, cellSize);
      }
    }
    drawInstructions();
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

function mouseClicked(){
  const { col, row } = mouseCell();

  if (inBounds(col, row)) {
    cells[col][row].revealed = !cells[col][row].revealed;

    if (!cells[col][row].revealed){
      cells[col][row].color = [...currentColor];
    }
  }
}

function keyPressed() {
  if (key === 'C' || key === 'c') initCells(0); // clear board

  if (key === '1') currentColor = [255, 0, 0]; // Red
  if (key === '2') currentColor = [255, 165, 0]; // Orange
  if (key === '3') currentColor = [255, 255, 0]; // Yellow
  if (key === '4') currentColor = [0, 128, 0]; // Green 
  if (key === '5') currentColor = [0, 0, 255]; // Blue
  if (key === '6') currentColor = [128, 0, 128]; // Purple 
  if (key === '7') currentColor = [0, 0, 0]; // black
  if (key === '8') currentColor = [255, 255, 255]; //white
draw}

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
      cells[c][r] = {
        revealed: true,
        color: [255, 255, 255]
      };
    }
  }
}

function mouseCell() {
  // constrain to avoid width/height edge rounding issues
  const mx = constrain(mouseX, 0, width );
  const my = constrain(mouseY, 0, height );
  return {
    col: floor(mx / cellSize),
    row: floor(my / cellSize),
  };
}

function inBounds(col, row) {
  return col >= 0 && col < colCount && row >= 0 && row < rowCount;
}

function windowResized() {
  cellSize = max(10, min(40, floor(min(windowWidth, windowHeight) / 50))); // adjust cellSize based on window size

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

const audio = new Audio('Click-sound.wav');
audio.loop = true;

window.addEventListener('mousedown', () => {
  audio.currentTime = 0;
  audio.play().catch(err => console.error(err));
});

window.addEventListener('mouseup', () => {
  audio.pause();
  audio.currentTime = 0;
});

function drawInstructions() {
 push();

 fill(255,230);
 noStroke();
 rect(10,60,220,240);

 fill(0);
 textSize(14);
  textAlign(LEFT, TOP);

  text("CONTROLS", 20, 70);
  text("1: Red", 20, 95);
  text("2: Orange", 20, 115);
  text("3: Yellow", 20, 135);
  text("4: Green", 20, 155);
  text("5: Blue", 20, 175);
  text("6: Purple", 20, 195);
  text("7: Black", 20, 215);
  text("8: White", 20, 235);
  text("C: Clear Board", 20, 255);

  pop();
}