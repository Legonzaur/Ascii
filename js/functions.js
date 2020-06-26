const help = document.getElementById("help");

const shiftMessage = "SHIFT + Lclick : Draw Line";
const ctrlMessage =
  "CTRL + Lclick : Fill (does not checks diagonals)\nCTRL + Z : Go back\nCTRL + Y : Go Forth (only available if you gone back)\nCTRL + S : Save current image into a reusable txt file\nCTRL + O : Open previously saved image";
const ctrlShiftMessage = "";
const idleMessage =
  "F1 : Toggle help\nAny character : Change pencil\nCTRL+\nSHIFT+";

help.innerText = idleMessage;
/**
 * Prompts the user to save a file
 * @param {string} filename Name of the file you want to save
 * @param {*} text Data you want to save
 */
function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Returns the content of a file uploaded by the user
 */
function upload() {
  return new Promise(function (resolve, reject) {
    var element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("accept", ".txt");

    element.style.display = "none";
    document.body.appendChild(element);

    element.addEventListener("input", async function (e) {
      text = await element.files[0].text();
      resolve(text);
      document.body.removeChild(element);
    });
    element.click();
  });
}

const ctrlHandler = {
  z: function (e) {
    let backwards = drawHistory.backwards();
    drawGrid = backwards ? backwards : drawGrid;
    render();
  },
  y: function (e) {
    let forwards = drawHistory.forwards();
    drawGrid = forwards ? forwards : drawGrid;
    render();
  },
  s: function (e) {
    e.preventDefault();
    download("ascii.txt", JSON.stringify(drawGrid));
  },
  o: async function (e) {
    e.preventDefault();
    text = await upload();
    drawGrid = JSON.parse(text);
    render();
  },
};

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
  },
  set backwardData(value) {
    this.__backwardData = value;
  },
  forwards: function () {
    if (this.forwardData[0]) {
      this.backwardData.unshift(JSON.stringify(drawGrid));
      return JSON.parse(this.forwardData.shift());
    }
  },
  backwards: function () {
    if (this.backwardData[0]) {
      this.forwardData.unshift(JSON.stringify(drawGrid));
      return JSON.parse(this.backwardData.shift());
    }
  },
};

/**
 *
 * @param {event} e keyboard or mouse event
 */
function showHelp(e) {
  if (e.ctrlKey && e.shiftKey) {
    help.innerText = ctrlShiftMessage;
    return;
  }
  if (e.ctrlKey) {
    help.innerText = ctrlMessage;
    return;
  }
  if (e.shiftKey) {
    help.innerText = shiftMessage;
    return;
  }
  help.innerText = idleMessage;
}
