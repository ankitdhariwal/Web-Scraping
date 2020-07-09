const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const { until } = require("selenium-webdriver");
const xlsx = require("xlsx");
const mobileList = [];
var file = require("./file.js");
const URL = file.URL;
const path = require("path");
const sendMail = require("./mail.js");

request(URL, function (error, response, body) {
  // body=html

  if (typeof response === "undefined") {
    console.log("Url is not able to hit the Browser");
    return;
  } else if (error == null && response.statusCode == 200) {
    fs.writeFileSync("main.html", body);
    console.log("File written to disk");
    parseHtml(body);
    sendMail();
  } else if (response.statusCode == 404) {
    console.log("Invalid URL");
  } else {
    console.log(error);
    console.log(response.statusCode);
  }
});

console.log("==============================================");

// parse Html can be changed acc to information we need.

function parseHtml(html) {
  // To parse the incoming body above.
  console.log("Parsing html");
  const $ = cheerio.load(html);
  let data = $("._3RA-"); // 8 Row
  let items = data.find("a");

  for (let r = 0; r < items.length; r++) {
    let title = $(items[r]).attr("title");
    let price = $(items[r]).find("span").text().split("-")[0];
    let obj = { title, price };
    mobileList.push(obj);
  }
  let fileData = mobileList;
  excelWriter(file.filePath, fileData, file.fileName);
  let readedData = excelReader(
    file.filePath + "/" + file.fileName + ".xlsx",
    file.fileName
  );
  console.log(readedData);
}

function excelReader(filePath, name) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  // workbook
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[name];
  let readData = xlsx.utils.sheet_to_json(excelData);
  return readData;
}

function excelWriter(filePath, data, name) {
  var newWB = xlsx.utils.book_new();
  var newWS = xlsx.utils.json_to_sheet(data);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("New directory successfully created.");
      }
    });
  }
  var newpath = path.join(filePath, name + ".xlsx");
  xlsx.utils.book_append_sheet(newWB, newWS, name); //workbook name as param
  xlsx.writeFile(newWB, newpath);
}
