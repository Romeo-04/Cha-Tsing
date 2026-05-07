# Cha-Tsing 🍌

> Chico is a monkey. Chico knows money. Chico will help you not be broke.

Cha-Tsing is a personal finance PWA built for Filipinos who don't want spreadsheets, don't want a financial advisor, and definitely don't want to think too hard about money. You tell Chico your income. Chico tells you what's going on. Chico reacts emotionally. You save bananas.

Live: **[romeo-04.github.io/Cha-Tsing](https://romeo-04.github.io/Cha-Tsing/)**

---

## What it does

- Set your monthly income and savings rate — Chico adjusts his face accordingly
- Drag expense bubbles onto Chico and he eats them (that's budgeting now)
- Log real savings and spending, watch the numbers go up or down
- Track dreams with actual timelines (Boracay, iPhone, condo, whatever)
- Budget tracker shows how much of each category you've burned through
- Chico gives real insights based on your actual data, not made-up percentages
- Full offline support — works when you have no signal, like a monkey in a cave

---

## Stack

Built with React + Vite. No backend. No database. No cloud. Everything lives in `localStorage` on your device. Chico is a parametric SVG with 5 emotional states and gaze-tracking eyes.

```
React 18        — ui
Vite 5          — build
vite-plugin-pwa — service worker, offline, installable
localStorage    — all persistence
```

---

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/Cha-Tsing/`. Chico will be there.

---

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

Enable GitHub Pages first: **Settings → Pages → Source: GitHub Actions**

---

## Reset everything

Open the app → tap the 🐒 button → Settings → **Remove all bananas**

Chico will beg you not to do it. Three times. He is not liable for what happens next.

---

## Generate Chico assets

Animated MP4s and PNGs of Chico's 5 faces live in `chico-exports/` (git-ignored).

```bash
cd chico-exports
npm install
node make-videos.js   # → .mov files with alpha (ProRes 4444, Premiere-ready)
node make-bg.js       # → background-wide.png (3840×1080)
```

---

## Icons

```bash
npm run generate-pwa-assets
```

Regenerates all PWA icon sizes from `public/icon.svg` (Chico's thriving face, cream background).

---

## 🍌 Disclaimer

Chico is a monkey.

Chico is not your financial advisor. Chico has never been to business school. Chico cannot be sued. Chico does not know what a fiduciary is and frankly does not want to.

Anything you do with your money after looking at this app is on you. Completely. Chico warned you. Chico is just sitting here eating bananas and watching numbers go up or down. That is all Chico does.

If you lose money — not Chico's fault. If you make money — you're welcome. If you need real financial advice, talk to a real licensed human professional who went to school for that. Chico did not go to school.

*Chico believes in you. But Chico is still a monkey. Act accordingly.*
