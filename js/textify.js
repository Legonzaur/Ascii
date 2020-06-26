onmessage = function (message) {
  let drawGrid = message.data;
  let text = [];
  for (let i = 0; i < drawGrid.length; i++) {
    let tempRow = "";
    drawGrid[i] = drawGrid[i] ? drawGrid[i] : [];
    let row = drawGrid[i];

    for (let j = 0; j < row.length; j++) {
      let char = row[j];
      if (char && char != " ") {
        tempRow += char;
      } else {
        tempRow += "&nbsp;";
      }
    }
    text[i] = tempRow;
  }
  postMessage(text.join("<br>"));
};
