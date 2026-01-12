/**
 * Verify output of split-commentary.js
 *
 * Usage:
 *   node verify-split-output.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(process.cwd(), 'commentaries');

const EXPECTED = {
  author1: {
    lang1: {
      chapter1: 1,
      chapter2: 1,
      chapter3: 1
    }
  },
  author2: {
    lang2: {
      chapter1: 1,
      chapter2: 1
    }
  },
  author3: {
    lang3: {
      chapter3: 1
    }
  }
};

function fail(msg) {
  console.error('❌ TEST FAILED:', msg);
  process.exit(1);
}

for (const author of Object.keys(EXPECTED)) {
  for (const lang of Object.keys(EXPECTED[author])) {
    for (const chapter of Object.keys(EXPECTED[author][lang])) {
      const expectedCount = EXPECTED[author][lang][chapter];

      const filePath = path.join(
        BASE,
        author,
        lang,
        `${chapter}.json`
      );

      if (!fs.existsSync(filePath)) {
        fail(`Missing file: ${filePath}`);
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (!Array.isArray(data)) {
        fail(`Not an array: ${filePath}`);
      }

      if (data.length !== expectedCount) {
        fail(
          `${filePath}: expected ${expectedCount} entries, found ${data.length}`
        );
      }
    }
  }
}

console.log('✅ All split-commentary tests passed successfully.');
