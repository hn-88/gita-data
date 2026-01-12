/**
 * Split commentary.json into:
 * commentaries/author{author_id}/lang{language_id}/chapter{n}.json
 *
 * Chapter number is derived from verse_id using
 * NUMBER_OF_VERSES_IN_CHAPTERS.
 */

const fs = require('fs');
const path = require('path');

// ---------------- CONFIG ----------------

const OUTPUT_BASE = path.join(process.cwd(), 'commentaries');

const NUMBER_OF_VERSES_IN_CHAPTERS = [
  47, // Chapter 1
  72, // Chapter 2
  43, // Chapter 3
  42, // Chapter 4
  29, // Chapter 5
  47, // Chapter 6
  30, // Chapter 7
  28, // Chapter 8
  34, // Chapter 9
  42, // Chapter 10
  55, // Chapter 11
  20, // Chapter 12
  35, // Chapter 13
  27, // Chapter 14
  20, // Chapter 15
  24, // Chapter 16
  28, // Chapter 17
  78  // Chapter 18
];

// ----------------------------------------

// Precompute verse_id ranges per chapter
const chapterRanges = [];
let currentStart = 1;

for (let i = 0; i < NUMBER_OF_VERSES_IN_CHAPTERS.length; i++) {
  const count = NUMBER_OF_VERSES_IN_CHAPTERS[i];
  const start = currentStart;
  const end = currentStart + count - 1;

  chapterRanges.push({
    chapter: i + 1,
    start,
    end
  });

  currentStart = end + 1;
}

function getChapterFromVerseId(verseId) {
  for (const range of chapterRanges) {
    if (verseId >= range.start && verseId <= range.end) {
      return range.chapter;
    }
  }
  throw new Error(`Invalid verse_id: ${verseId}`);
}

// ----------------------------------------

const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Usage: node split-commentary.js <commentary.json>');
  process.exit(1);
}

const raw = fs.readFileSync(inputFile, 'utf8');
const data = JSON.parse(raw);

// Map: authorId -> langId -> chapter -> entries[]
const grouped = {};

for (const entry of data) {
  const authorId = entry.author_id;
  const langId = entry.language_id;
  const verseId = entry.verse_id;

  if (typeof verseId !== 'number') {
    throw new Error(`Missing or invalid verse_id in entry id=${entry.id}`);
  }

  const chapter = getChapterFromVerseId(verseId);

  if (!grouped[authorId]) grouped[authorId] = {};
  if (!grouped[authorId][langId]) grouped[authorId][langId] = {};
  if (!grouped[authorId][langId][chapter]) {
    grouped[authorId][langId][chapter] = [];
  }

  grouped[authorId][langId][chapter].push(entry);
}

// Write output files
for (const authorId of Object.keys(grouped)) {
  for (const langId of Object.keys(grouped[authorId])) {
    const baseDir = path.join(
      OUTPUT_BASE,
      `author${authorId}`,
      `lang${langId}`
    );

    fs.mkdirSync(baseDir, { recursive: true });

    for (let chapter = 1; chapter <= 18; chapter++) {
      const entries = grouped[authorId][langId][chapter];
      if (!entries) continue;

      const outFile = path.join(
        baseDir,
        `chapter${chapter}.json`
      );

      fs.writeFileSync(
        outFile,
        JSON.stringify(entries, null, 2),
        'utf8'
      );
    }
  }
}

console.log('Commentary split completed successfully.');
