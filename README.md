# Terminal - Online Code Editor

IntelliJ-style **two-pane** web IDE: write code in Monaco, see **terminal** or **live preview**. Built with **Next.js** and ready for **Vercel**.

## Features

- Languages: **Java**, **Python**, **C**, **C++**, **JavaScript**, **HTML**, **CSS**
- Monaco editor with syntax highlighting per language
- Split layout: **editor (top)** + **terminal / preview (bottom)**, drag to resize
- **Run / Preview** + `Ctrl/Cmd + Enter`
- Code is remembered when switching languages
- Optional **stdin** for Java, Python, C, and C++

| Language | Output |
|----------|--------|
| Java | Terminal (Judge0 sandbox) |
| Python | Terminal (Judge0 sandbox) |
| C | Terminal (Judge0 sandbox) |
| C++ | Terminal (Judge0 sandbox) |
| JavaScript | Terminal (browser console) |
| HTML | Live preview iframe |
| CSS | Live preview on a demo page |

## How execution works

The browser does **not** run Java/Python/C/C++ locally. The `/api/run` route sends code to **[Judge0 CE](https://ce.judge0.com)** (`ce.judge0.com`), which compiles and runs it in a sandbox.

No local JDK, Python, or GCC is required on your machine or on Vercel.

## Local development

```bash
cd java-editor
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
cd java-editor
vercel
```

### Option B — GitHub

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repo → Deploy (defaults work; Framework: Next.js).

### Optional env

| Variable | Default | Purpose |
|----------|---------|---------|
| `JUDGE0_API_URL` | `https://ce.judge0.com` | Judge0 base URL (self-host or RapidAPI host) |
| `JUDGE0_JAVA_LANGUAGE_ID` | `62` | Judge0 language id for Java |
| `JUDGE0_API_KEY` | — | Auth token if your Judge0 instance requires it |
| `JUDGE0_RAPIDAPI_KEY` | — | RapidAPI key if using Judge0 on RapidAPI |

Public `ce.judge0.com` works without a key for light use. For production traffic, [self-host](https://github.com/judge0/judge0) or use [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).

## Project structure

```
src/
  app/
    api/run/route.ts   # Java execute API (Judge0 CE)
    page.tsx           # Main workspace
    layout.tsx
    globals.css
  components/
    Workspace.tsx      # Split panes + run logic
    CodeEditor.tsx     # Monaco
    Terminal.tsx       # Output panel
    Toolbar.tsx        # Run / Clear / Reset
  lib/
    java.ts            # Sample code + class name helper
```

## Notes & limits

- Public Judge0 has rate limits and CPU/memory caps (~5s CPU).
- Use a `public class` with a `main` method (e.g. `public class Main`).
- Network required for Run (calls the execution API).

## Project notes

- HTML/CSS never leave the browser (preview only).
- JavaScript runs in the browser by default (fast, offline-capable).
- Java uses Judge0 over the network.
