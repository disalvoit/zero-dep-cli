#!/usr/bin/env node
const fs = require("fs");

const args = process.argv.slice(2);
const file = args[0];
const top = Number(args[1]) || 5;

const text = fs.readFileSync(file, "utf8");
const counts = {};
for (const word of text.split(" ")) {
  counts[word] = (counts[word] || 0) + 1;
}
const sorted = Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, top);
console.log(sorted.map(([word, count]) => `${word} ${count}`).join("\n"));
