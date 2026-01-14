# Static Gita JSON files API hosted on GitHub Pages

## Overview
This project follows the design provided in section: *Summary of best option for generous free-tier Gita API implementation* in [this blog post](https://raviswdev.blogspot.com/2025/12/create-gita-json-file-rest-api-hosted.html) to create a static Bhagavad Gita JSON files API hosted on GitHub Pages.  

The Gita JSON files API is now fully functional but has not been extensively tested and has a Next.js caching issue with 2.18 MB (compressed size) translation.json file.  

Users who use this API and encounter issues are requested to raise an issue in this GitHub repository.

The Gita data for this project has been taken from the open source [gita](https://github.com/gita/gita) project. This project is using the same Unlicense license as the original gita project.

## JSON files API Endpoints
GitHub pages (JSON files) site base URL: https://ravisiyer.github.io/gita-data/v1/  
Main endpoints:
- https://ravisiyer.github.io/gita-data/v1/chapters.json 43.1 KB
- https://ravisiyer.github.io/gita-data/v1/verse.json 644 KB
- https://ravisiyer.github.io/gita-data/v1/translation.json 2.18 MB
  - This file when uncompressed by Next.js is reported to be around 3.05 MB going beyond Nextjs cache size limit of 2 MB. So in future, this file may be split into smaller files with max. size of around 1 to 1.25 MB to enable Next.js caching.
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
- getVerseMeta(verseId: string)
  -	Gets verses.json and then filters the data to return only specified verse's metadata. 
- getTranslationsForChapter(chapterNumber: string)
  -	Gets translation.json, filters the data to pick up only specified chapter's translations data. Next it groups translation entries by verseId using a helper function: groupTranslationsByVerseId(translations: any)
    - After the above, accessing one particular translation author (translatorAuthorId) and one particular verse's (v.id) translation entry which includes translation text (description field) is done using the code (v.id is the verse Id which is unique across all verses in all chapters):  
		- const translationEntry = groupedTranslationsbyVerseId[v.id].find((tr: any) => tr.author_id.toString() === translatorAuthorId);
- getTranslationsForVerse(verseId: string)
  -	Gets translation.json, filters the data to pick up only specified verse's translations data.
- getCommentariesForChapterAuthorLang(chapterNumber: string, authorId: string, langId: string)
  -	Gets commentary JSON file for specified chapterNumber, authorId and langId. 
- getCommentaryForVerseAuthorLang(verseId: string, authorId: string, langId: string)
  - Gets commentary for specified verseId, authorId and langId. It uses getCommentariesForChapterAuthorLang function.

## Frontend Used for Testing API
Gita frontend app version with only Swami Sivananda translation and commentary that seems to be working with this gita-data JSON API is live at: https://gita-test.vercel.app/. But it has not been tested thoroughly. For this frontend app, I created a new Vercel project whose production site is mapped to datajson branch of Gita frontend app. GitHub repo, datajson branch: https://github.com/ravisiyer/gita/tree/datajson .

This frontend app code is unnecessarily complex as it is based on the full Gita frontend app code which used a graphQL API earlier and which is no longer available. So the key data access functions in it have been modified to use this gita-data JSON API and then populate the required data in the structures and formats returned by earlier graphQL API, which is then returned to UI components. This way, the existing UI components could be reused with minimal or no changes.

Even though this frontend app seems to be functional with its limited functionality of only one translator and commentator (Swami Sivananda), I view this frontend app as a temporary test frontend app to test this gita-data JSON API. Eventually it should be replaced by a better demo and test frontend project that uses this gita-data JSON files API.

This frontend app does not use the optimizations of chapters.json, verse.json and translation.json being directly imported into the (Next.js) frontend project as constant JSON objects, which is discussed in above mentioned section: *Summary of best option for generous free-tier Gita API implementation* in [this blog post](https://raviswdev.blogspot.com/2025/12/create-gita-json-file-rest-api-hosted.html). Even without these optimizations, this frontend app usually has acceptable performance with chapter and verse pages being loaded within few seconds (less than 2 seconds in one test). On occassion, it took slightly longer but which too, if I recall correctly, was still less than 5 or max. 10 seconds.

## Required (Must-Have) TODOs
- https://ravisiyer.github.io/gita-data/v1/translation.json of 2.18 MB size has to be split  into smaller files with max. size of around 1 to 1.25 MB to enable Next.js caching.
- Data corrections
  - Wrong data like Swami Sivananda commentaries having ? instead of probably comma.
  - Some data issues seen on frontend app could be app data rendering issues with special characters like some Sanskrit characters. If these are data issues and not app rendering issues, these need to be fixed in the gita-data JSON files. If they are app rendering issues, they need to be fixed in the frontend app.

## Optional (Nice-to-Have) TODOs
- Create a simple HTML/JS/CSS demo frontend project that uses this gita-data JSON files API and the JavaScript helper functions. This can then be used to:
  - Thoroughly test this API.
    - Possibility of AI tool creating automated tests for this API can also be explored.
  - Demonstrate usage of this API.

## About Project
This project is service-oriented and not-for-profit, providing free access to the Bhagavad Gita data as JSON files. This work has been supported by voluntary contributions from individuals who wished to encourage the effort. Currently the main developer is Ravi S. Iyer. 

Details about how this project is being executed and supported are documented in the [linked blog post](https://raviswdev.blogspot.com/2025/12/are-any-persons-interested-in.html).

This project is not affiliated with the original [gita](https://github.com/gita/gita) project and is an independent project.

Here's the [`README`](https://github.com/gita/gita#readme) of the original [gita](https://github.com/gita/gita) project whose data is being used in this project.