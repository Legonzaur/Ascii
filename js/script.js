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
  if (e.buttons != 1) return mouseUp;
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
  showHelp(e);
  if (e.ctrlKey && e.shiftKey) {
    return;
  }
  if (e.ctrlKey) {
    ctrlHandler[e.key] ? ctrlHandler[e.key](e) : null;
    return;
  }

  if (e.key == "F1") {
    e.preventDefault();
    help.getAttribute("hidden")
      ? help.removeAttribute("hidden")
      : help.setAttribute("hidden", true);
  }
  //chage pencil
  if (e.key.length == 1) {
    pencil = e.key;
  }
});

document.addEventListener("keyup", async function (e) {
  showHelp(e);
});
