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
  __forwardData: [],
  __backwardData: [],
  get forwardData() {
    return this.__forwardData;
  },
  get backwardData() {
    return this.__backwardData;
  },
  set forwardData(value) {
    this.__forwardData = value;
    // title.innerHTML = `B:${this.__backwardData.length} F:${this.__forwardData.length}`;
  },
  set backwardData(value) {
    this.__backwardData = value;
  },
  forwards: function () {
    if (this.forwardData[0]) {
      this.backwardData.unshift(JSON.stringify(drawGrid));
      // title.innerHTML = `B:${this.__backwardData.length} F:${
      //   this.__forwardData.length - 1
      // }`;
      return JSON.parse(this.forwardData.shift());
    }
  },
  backwards: function () {
    if (this.backwardData[0]) {
      this.forwardData.unshift(JSON.stringify(drawGrid));
      // title.innerHTML = `B:${this.__backwardData.length - 1} F:${
      //   this.__forwardData.length
      // }`;
      return JSON.parse(this.backwardData.shift());
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

document.addEventListener("keydown", async function (e) {
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
      case "s":
        e.preventDefault();
        download("ascii.txt", JSON.stringify(drawGrid));
        break;
      case "o":
        e.preventDefault();
        text = await upload();
        drawGrid = JSON.parse(text);
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
