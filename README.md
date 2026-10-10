# Fafa Desktop Pet

Fafa is a small, photo-based desktop cat for Windows. Drag her around the screen, click her to pet, or use **Feed**, **Play**, and **Nap**. Her sitting and reclining poses are based on photos of the real Fafa; the raised-paw pose was edited from her sitting cutout.

## Download

Get the latest portable Windows build from this repository's **Releases** page. Download `Fafa-Desktop-Pet-Windows.exe` and open it; no installation is needed. Use the × button above Fafa to quit. This early release is unsigned, so Windows may show an unrecognized-app warning.

## Browser demo

Open `index.html` locally to preview Fafa and try the controls. Window dragging and Quit work in the desktop app.

## Build from source

With Node.js and pnpm installed:

```sh
pnpm install
pnpm run check
pnpm run dist:win
```

The portable executable is written to `release/`. This project uses Electron and electron-builder.

## Photos

The Fafa images are personal photos and edited cutouts shared with this project. Please ask the owner before reusing the images outside this desktop pet.
