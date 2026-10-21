const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const fixture = join(tmpdir(), `words-${process.pid}.txt`);
writeFileSync(fixture, "apple apple banana");

test("counts the words in a file", () => {
  const out = execFileSync(process.execPath, ["bin/words.js", fixture], { encoding: "utf8" });
  assert.match(out, /apple 2/);
  assert.match(out, /banana 1/);
});
