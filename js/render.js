onmessage = function (message) {
  let contentArray = message.data;
  let text = [];
  for (let i = 0; i < contentArray.length; i++) {
    let tempRow = "";
    contentArray[i] = contentArray[i] ? contentArray[i] : [];
    let row = contentArray[i];

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
