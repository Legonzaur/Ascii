const content = document.getElementById("content");

var pencil = "o";

var fontSize = parseFloat(
  window.getComputedStyle(content).getPropertyValue("font-size")
);

var test = document.getElementById("Test");
test.style.fontSize = fontSize;
var height = test.getBoundingClientRect().height;
var width = test.getBoundingClientRect().width;

var drawGrid = [];

var textify = new Worker("./js/textify.js");

var previousX;
var previousY;

function moveMouse(e) {
  if (e.buttons != 1) return;
  let x = Math.floor(e.clientX / width);
  let y = Math.floor(e.clientY / height);
  if (x == previousX && y == previousY) {
    return;
  }

  drawLine(previousX, previousY, x, y);
  previousX = x;
  previousY = y;
  render();
}

function drawLine(x0, y0, x1, y1) {
  //Bresenham's line algorithm
  let iterations = 0;
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  do {
    drawPoint(x0, y0);
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
    iterations++;
    if (iterations > 1000) break;
  } while (!(x0 == x1 && y0 == y1));
}
function fill(x, y) {
  //custom flood fill algorythm
  let iterations = 0;
  drawGrid[y] = drawGrid[y] ? drawGrid[y] : [];
  if (pencil != drawGrid[y][x]) {
    const fillChar = drawGrid[y][x];
    const pixelsToCheck = [x, y];
    while (pixelsToCheck.length > 0) {
      if (iterations > 100000) break;
      iterations++;
      const ypixel = pixelsToCheck.pop();
      const xpixel = pixelsToCheck.pop();
      drawGrid[ypixel] = drawGrid[ypixel] ? drawGrid[ypixel] : [];

      if (
        drawGrid[ypixel][xpixel] == fillChar &&
        !(
          xpixel > window.innerWidth / width ||
          ypixel > window.innerHeight / height ||
          xpixel < 0 ||
          ypixel < 0
        )
      ) {
        drawPoint(xpixel, ypixel);

        pixelsToCheck.push(xpixel + 1, ypixel);
        pixelsToCheck.push(xpixel - 1, ypixel);
        pixelsToCheck.push(xpixel, ypixel + 1);
        pixelsToCheck.push(xpixel, ypixel - 1);
      }
    }

    render();
  }
}
function drawPoint(x, y) {
  if (
    x > window.innerWidth / width ||
    y > window.innerHeight / height ||
    x < 0 ||
    y < 0
  )
    return;
  drawGrid[y] = drawGrid[y] ? drawGrid[y] : [];
  drawGrid[y][x] = pencil;
}
function render() {
  textify.postMessage(drawGrid);
}

textify.onmessage = async function (e) {
  content.innerHTML = e.data;
};

content.addEventListener("mousedown", function (e) {
  content.addEventListener("mousemove", moveMouse);
  let x = Math.floor(e.clientX / width);
  let y = Math.floor(e.clientY / height);
  if (e.shiftKey) {
    drawLine(previousX, previousY, x, y);
  }
  if (e.ctrlKey) {
    fill(x, y);
  }
  previousX = x;
  previousY = y;
  //  drawPoint(x, y);
  render();
});

content.addEventListener("mouseup", function (e) {
  content.removeEventListener("mousemove", moveMouse);
  drawPoint(x, y);
});

content;

document.addEventListener("keydown", function (e) {
  if (e.key.length == 1) {
    pencil = e.key;
  }
});
