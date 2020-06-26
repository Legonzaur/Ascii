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

const drawHistory = {
  forwardData: [],
  backwardData: [],
  forwards: function () {
    if (this.forward[0]) {
      this.backward.unshift(JSON.stringify(drawGrid));
      return JSON.parse(this.forward.shift());
    }
  },
  backwards: function () {
    if (this.backward[0]) {
      this.forward.unshift(JSON.stringify(drawGrid));
      return JSON.parse(this.backward.shift());
    }
  },
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
  //adding to history
  drawHistory.backwardData.unshift(JSON.stringify(drawGrid));
  drawHistory.forwardData = [];
  if (e.shiftKey) {
    drawLine(previousX, previousY, x, y);
  }
  if (e.ctrlKey) {
    fill(x, y);
  }
  drawPoint(x, y);
  previousX = x;
  previousY = y;
  render();
});

content.addEventListener("mouseup", mouseUp);

document.addEventListener("keydown", function (e) {
  //history shit
  if (e.ctrlKey == true) {
    switch (e.key) {
      case "z":
        let backwards = drawHistory.backwards();
        drawGrid = backwards ? backwards : drawGrid;
        render();
        break;
      case "y":
        let forwards = drawHistory.forwards();
        drawGrid = forwards ? forwards : drawGrid;
        render();
        break;

      default:
        break;
    }
    return;
  }
  //chage pencil
  if (e.key.length == 1) {
    pencil = e.key;
  }
});
