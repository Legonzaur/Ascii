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
