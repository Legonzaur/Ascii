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

var drawHistory = {
  forward: [],
  backward: [],
};

var textify = new Worker("./js/textify.js");

var previousX;
var previousY;

function moveMouse(e) {
  if (e.buttons != 1) return mouseUp;
  let x = Math.floor(e.clientX / width);
  let y = Math.floor(e.clientY / height);
  if (x == previousX && y == previousY) {
    return;
  }

  drawLine(previousX, previousY, x, y);
  drawPoint(x, y);
  previousX = x;
  previousY = y;
  render();
}

function render() {
  textify.postMessage(drawGrid);
}

function mouseUp(e) {
  content.removeEventListener("mousemove", moveMouse);
}

textify.onmessage = async function (e) {
  content.innerHTML = e.data;
};

content.addEventListener("mousedown", function (e) {
  content.addEventListener("mousemove", moveMouse);
  let x = Math.floor(e.clientX / width);
  let y = Math.floor(e.clientY / height);
  drawHistory.backward.unshift(JSON.stringify(drawGrid));
  drawHistory.forward = [];
  if (e.shiftKey) {
    drawLine(previousX, previousY, x, y);
  }
  if (e.ctrlKey) {
    fill(x, y);
  }
  previousX = x;
  previousY = y;
  render();
});

content.addEventListener("mouseup", mouseUp);

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey == true) {
    console.log(drawHistory.backward.length);
    switch (e.key) {
      case "z":
        if (drawHistory.backward[0]) {
          drawHistory.forward.unshift(JSON.stringify(drawGrid));
          drawGrid = JSON.parse(drawHistory.backward.shift());
          render();
        }

        break;
      case "y":
        if (drawHistory.forward[0]) {
          drawHistory.backward.unshift(JSON.stringify(drawGrid));
          drawGrid = JSON.parse(drawHistory.forward.shift());
          render();
        }

        break;

      default:
        break;
    }
    return;
  }
  if (e.key.length == 1) {
    pencil = e.key;
  }
});
