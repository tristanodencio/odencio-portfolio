# Tristan Odencio — Portfolio

Personal portfolio website built with plain HTML, CSS, and JavaScript (no build step).
Light-blue iPhone-style glass design: bento-grid hero with a live Cebu clock, Apple-Watch-style skill rings,
filterable projects (swipe carousel on phones), project details as a bottom sheet on phones, a floating
bottom dock for navigation on phones, Dynamic-Island-style notifications, optional dark mode, and a
contact form that opens the visitor's email app (mailto).

## Files
| File | Purpose |
|---|---|
| index.html | Homepage: all content (Home, About, Skills, Projects, Contact) |
| style.css | All styling. Change colors in `:root` at the top |
| script.js | Interactions: theme, menu, typing text, filters, pop-up, form |
| images/ | profile.jpg and project screenshots |

## Before publishing — replace placeholders
Search index.html for `EDIT` and replace each one:
1. Skills: in each ring card, set each legend item's `data-level` (0–100) and label to match your real abilities. The rings draw themselves from these numbers.
2. Projects: your part in Reksolva and in the CEC Voting System (BOBA Team) — the `data-role` lines.
   Pop-up buttons come from `data-l1` / `data-l1-label`, `data-l2` / `data-l2-label`, … on each project.
3. Typing phrases: edit the `phrases` list at the top of script.js.

## Preview locally
Open index.html in a browser, or use VS Code > Live Preview.

## Publish (GitHub Pages)
1. New public repository named `portfolio`.
2. Add file > Upload files: upload index.html, style.css, script.js, README.md, and the images/ folder. Commit.
3. Settings > Pages > Deploy from a branch > main / (root) > Save.
4. Live link: https://YOUR-USERNAME.github.io/portfolio/

## AI use note
Design and code generated with Claude (Anthropic), then personalized and checked by me.
