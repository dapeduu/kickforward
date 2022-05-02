import fs from "fs";

export function readFile(pathToFile, func) {
  fs.readFile(pathToFile, "utf-8", (err, data) => {
    func(data, normalize); // filter_chars
  });
}

export function filterChars(strData, func) {
  func(String(strData).replace(/[\W_]+/g, " "), scan); // normalize
}

function normalize(strData, func) {
  func(strData.toLowerCase(), removeStopWords); // scan
}

function scan(strData, func) {
  func(
    strData.split(" ").filter((item) => item !== ""),
    frequencies
  ); // removeStopWords
}

function removeStopWords(wordList, func) {
  fs.readFile("stop_words.txt", "utf-8", (err, data) => {
    const stopWords = data.split("\n");
    const fullStopWords = stopWords.concat(
      Array.from("abcdefghijklmnopqrstuvwxyz")
    );
    const filteredWordList = wordList.filter(
      (item) => !fullStopWords.includes(item)
    );

    func(filteredWordList, sort); // frequencies
  });
}

function frequencies(wordList, func) {
  const wordFrequency = {};
  wordList.forEach((item) => {
    if (wordFrequency.hasOwnProperty(item)) {
      wordFrequency[item] += 1;
    } else {
      wordFrequency[item] = 1;
    }
  });

  func(wordFrequency, printText); // sort
}

function sort(wf, func) {
  const entries = Object.entries(wf);
  const sorted = entries.sort((a, b) => a[1] - b[1]).reverse();

  func(sorted, noOp);
}

function printText(wordFreqs, func) {
  var words;
  words = wordFreqs.slice(0, 25);
  words.forEach((word) => {
    console.log(`${word[0]} - ${word[1]}`);
  });

  noOp();
}

function noOp() {
  return;
}

readFile(process.argv[2], filterChars);
