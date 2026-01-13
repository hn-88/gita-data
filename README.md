# Static Gita JSON files API hosted on GitHub Pages

## Overview
This project follows the design provided in section: *Summary of best option for generous free-tier Gita API implementation* in [this blog post](https://raviswdev.blogspot.com/2025/12/create-gita-json-file-rest-api-hosted.html) to create a static Bhagavad Gita JSON files API hosted on GitHub Pages.  

The Gita JSON files API is now fully functional but has not been extensively tested. Users who use this API and encounter issues are requested to raise an issue in this GitHub repository.

The Gita data for this project has been taken from the open source [gita](https://github.com/gita/gita) project. This project is using the same Unlicense license as the original gita project.

## JSON files API Endpoints
GitHub pages (JSON files) site base URL: https://ravisiyer.github.io/gita-data/v1/  
Main endpoints:
- https://ravisiyer.github.io/gita-data/v1/chapters.json 43.1 KB
- https://ravisiyer.github.io/gita-data/v1/verse.json 644 KB
- https://ravisiyer.github.io/gita-data/v1/translation.json 2.18 MB
- https://ravisiyer.github.io/gita-data/v1/authors.json 1.39 KB
- https://ravisiyer.github.io/gita-data/v1/languages.json 181 Bytes

commentary.json is 26.9 MB and is split into smaller files per author, per language, per chapter for efficient access.  
Currently it has been split into 288 files (16 authors, each with only 1 language, for 18 chapters; so 16 x 1 x 18).  
Endpoint for access is in the format: commentaries/author{author_id}/lang{lang}/chapter{chapter_number}.json  
Example URLs for commentary files:
- https://ravisiyer.github.io/gita-data/v1/commentaries/author16/lang1/chapter1.json 28.7 KB 
  - author16 - Swami Sivananda, lang1 - English
- https://ravisiyer.github.io/gita-data/v1/commentaries/author2/lang2/chapter12.json 139 KB 
  - author2 - Swami Chinmayananda, lang2 - Hindi
- https://ravisiyer.github.io/gita-data/v1/commentaries/author14/lang3/chapter5.json 51.2 KB 
  - author14 - Sri Shankaracharya, lang3 - Sanskrit 

## JavaScript Helper Functions for gita-data JSON API
Currently these functions are in a separate frontend project. [app\lib\datarest.ts file in branch datajson](https://github.com/ravisiyer/gita/blob/datajson/app/lib/datarest.ts) of [gita repository](https://github.com/ravisiyer/gita) has the implementation of these functions listed below:
- getChapterMeta(chapterNumber: string) 
  -	Gets chapters.json and then filters the data to return only specified chapter's data (chapter metadata)
- getVersesForChapter(chapterNumber: string)
  -	Gets verses.json and then filters the data to return only verses data (verses metatdata) for specified chapter
- getTranslationsForChapter(chapterNumber: string)
  -	Gets translation.json, filters the data to pick up only specified chapter's translations data. Next it groups translation entries by verseId using a helper function: groupTranslationsByVerseId(translations: any)
    - After the above, accessing one particular translation author (translatorAuthorId) and one particular verse's (v.id) translation entry which includes translation text (description field) is done using the code (v.id is the verse Id which is unique across all verses in all chapters):  
		- const translationEntry = groupedTranslationsbyVerseId[v.id].find((tr: any) => tr.author_id.toString() === translatorAuthorId);

Commentary data access function is not yet implemented.

## About Project
This project is service-oriented and not-for-profit, providing free access to the Bhagavad Gita data. This work has been supported by voluntary contributions from individuals who wished to encourage the effort. Currently the main developer is Ravi S. Iyer. 

Details about how this project is being executed and supported are documented in the [linked blog post](https://raviswdev.blogspot.com/2025/12/are-any-persons-interested-in.html).

This project is not affiliated with the original [gita](https://github.com/gita/gita) project and is an independent project.

Here's the [`README`](https://github.com/gita/gita#readme) of the original [gita](https://github.com/gita/gita) project whose data is being used in this project.