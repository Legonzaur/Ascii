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
