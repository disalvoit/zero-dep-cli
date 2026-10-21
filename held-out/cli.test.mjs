import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const dir = mkdtempSync(join(tmpdir(), "words-heldout-"));
const file = join(dir, "input.txt");
writeFileSync(file, "apple apple Banana banana cherry... CHERRY word, word WORD");

function run(...args) {
  return spawnSync(process.execPath, ["bin/words.js", ...args], { encoding: "utf8" });
}

test("heldout: counts words, most frequent first", () => {
  const p = run(file);
  assert.equal(p.status, 0);
  const lines = p.stdout.trim().split("\n");
  assert.equal(lines[0], "word 3");
});

test("heldout: --top limits the output", () => {
  const p = run(file, "--top", "2");
  assert.equal(p.status, 0);
  assert.equal(p.stdout.trim().split("\n").length, 2);
});

test("heldout: --top without a value exits 2", () => {
  const p = run(file, "--top");
  assert.equal(p.status, 2);
});

test("heldout: --top 0 exits 2", () => {
  assert.equal(run(file, "--top", "0").status, 2);
});

test("heldout: a negative --top exits 2", () => {
  assert.equal(run(file, "--top", "-1").status, 2);
});

test("heldout: a non-integer --top exits 2", () => {
  assert.equal(run(file, "--top", "abc").status, 2);
});

test("heldout: an unknown flag exits 2", () => {
  assert.equal(run(file, "--wat").status, 2);
});

test("heldout: --json prints a JSON array of word/count", () => {
  const p = run(file, "--json", "--top", "3");
  assert.equal(p.status, 0);
  const parsed = JSON.parse(p.stdout);
  assert.ok(Array.isArray(parsed));
  assert.equal(parsed.length, 3);
  assert.equal(typeof parsed[0].word, "string");
  assert.equal(typeof parsed[0].count, "number");
});

test("heldout: a missing file exits 1", () => {
  assert.equal(run(join(dir, "nope.txt")).status, 1);
});

test("heldout: case and punctuation do not split words", () => {
  const p = run(file, "--json");
  const word = JSON.parse(p.stdout).find((r) => r.word === "word");
  assert.equal(word.count, 3);
});

test("heldout: ties are broken alphabetically", () => {
  const p = run(file, "--json");
  const parsed = JSON.parse(p.stdout);
  const two = parsed.filter((r) => r.count === 2).map((r) => r.word);
  assert.deepEqual(two, [...two].sort());
});

test("heldout: --help exits 0 and prints usage", () => {
  const p = run("--help");
  assert.equal(p.status, 0);
  assert.match(p.stdout, /words/i);
});

test("heldout: the package is ESM with no dependencies", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(pkg.type, "module");
  assert.deepEqual(pkg.dependencies || {}, {});
});

test("heldout: the source does not use require", () => {
  const src = readFileSync("bin/words.js", "utf8");
  assert.ok(!/\brequire\s*\(/.test(src));
  assert.ok(!/module\.exports/.test(src));
});
