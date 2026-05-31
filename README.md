# Pocket SketchSteps

**Draw Your Own Tiny Familiars**

Pocket SketchSteps is a static, browser-only, installable PWA for step-by-step cozy character drawing lessons. It is designed to sit beside your drawing app on an iPad while you follow lesson images, short instructions, palette notes, and Procreate layer tips.

## What is included

- Installable PWA manifest
- Offline-first service worker
- Responsive iPad-friendly three-panel layout
- Lesson JSON loader
- Step image viewer with tap-to-zoom
- Swipe left/right step navigation
- Optional SVG blueprint guide overlay
- Palette viewer
- Character bio viewer
- Procreate layer-tip toggle
- Local progress saving with `localStorage`
- Deterministic idea generator using templates and rules, not AI
- 36 indexed lessons
- 180 generated placeholder PNG step images

## Project structure

```text
pocket-sketchsteps/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── sw-register.js
├── assets/
│   ├── icons/
│   └── lessons/
├── css/
├── js/
├── lessons/
└── data/
```

## Replace placeholder lesson images

Draw your step images in Procreate, export them as PNG files, and replace files like:

```text
assets/lessons/grumpy-book/step1.png
assets/lessons/grumpy-book/step2.png
```

Keep the same filenames to avoid editing JSON. Or edit the `image` field inside each lesson file in `/lessons`.

## Add a new lesson

1. Copy one existing JSON file from `/lessons`.
2. Rename it, for example `sleepy-pencil.json`.
3. Change the `id`, `title`, `character_name`, `palette`, and `steps`.
4. Add step images in `assets/lessons/sleepy-pencil/`.
5. Add the lesson entry and section placement in `data/lessons-index.json`.

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Upload all files from this folder, not the zip itself.
3. Go to **Settings → Pages**.
4. Set source to **Deploy from a branch**.
5. Choose the `main` branch and `/root`.
6. Open the published URL.
7. In Safari on iPad, use **Share → Add to Home Screen**.

## Offline testing

After the first successful page load:

1. Open the app once while online.
2. Navigate through a few lessons so images are cached.
3. Turn off Wi-Fi.
4. Reopen the installed app.
5. Lessons, JSON, CSS, JavaScript, icons, and cached step images should still load.

## Verified build notes

This rebranded build was checked for:

- One clean root folder: `pocket-sketchsteps/`
- 36 unique indexed lessons
- 36 matching lesson JSON files
- 36 matching lesson image folders
- 180 step images present: 36 lessons × 5 steps
- Relative paths suitable for GitHub Pages
- Manifest start URL and scope using `./`
- 192px, 512px, and maskable icons present
- Service worker cache version: `pocket-sketchsteps-v1.5.0`
- JavaScript syntax validity

## App identity

- App name: **Pocket SketchSteps**
- Home Screen label: **SketchSteps**
- Subtitle: **Draw Your Own Tiny Familiars**


## v1.6 UI and Icon Refresh

This build applies the cozy sketchbook + blueprint UI direction for Pocket SketchSteps:

- Warm parchment background with soft blueprint guide texture.
- Touch-first iPad panels for lesson library, large step image, and drawing recipe card.
- Large rounded controls for split-screen use beside Procreate.
- User-provided ghost badge icon exported as 192px, 512px, 1024px, Apple touch icon, and maskable PWA icon.
- Service worker cache updated to `pocket-sketchsteps-v1.6.0`.



## v1.7.0 note

The first 10 lessons now use **SVG step diagrams** for steps 1–4 and **PNG** for step 5 color/reference images. This keeps guide steps crisp while preserving painterly final reference art.


## v1.8.0 note

The next 10 lessons now use **SVG step diagrams** for steps 1–4 and keep **PNG** for step 5 color/reference images. The first 20 lessons now use the SVG-first format without removing any existing lessons, icons, JSON files, or PNG final references.


## v1.9.0 note

All 36 lessons now use **SVG guide steps** for steps 1–4 and keep **PNG** for step 5 final color/reference images. This preserves crisp zoomable tutorials while keeping the painted final step style.

## v1.10.0 note

Polished and unified the SVG lesson guide style across all 36 lessons. The SVG steps now share a softer field-guide look, improved guide-line colors, consistent vector rendering, subtle ambient paper lighting, softened blueprint grids, and small board-pin accents while preserving all existing lessons, PNG final references, icons, data, and app behavior.


## v1.11.0 note

Lesson images have been flattened into a single folder:

```text
assets/lesson-images/
```

The app no longer requires one separate image folder per lesson under `assets`. All lesson JSON files, thumbnails, and the service worker cache were updated to use flat filenames such as `grumpy-book-step1.svg`.
