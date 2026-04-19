# Wheel Randomizer

A static React-based wheel app hosted on GitHub Pages.

## Project structure

- `index.html` - entry point and script/style includes
- `assets/css/` - split styles (`base.css`, `components.css`)
- `assets/js/core/` - constants, storage, wheel renderer
- `assets/js/ui/` - UI components source and runtime builds
- `assets/js/App.js` - main app source
- `assets/js/main.js` - app mount source
- `scripts/build-runtime.sh` - rebuilds runtime JS from source JSX files

## Development flow

1. Edit source files:
   - `assets/js/ui/icons.js`
   - `assets/js/ui/Wheel.js`
   - `assets/js/App.js`
   - `assets/js/main.js`
2. Rebuild runtime files:

```bash
./scripts/build-runtime.sh
```

3. Commit both source and runtime files.

## Why runtime files exist

- Browsers block Babel `type="text/babel" src="..."` XHR when opened via `file://`.
- Runtime files (`*.runtime.js`) are plain JS built from JSX, so the app works on:
  - GitHub Pages (`https://...`)
  - direct local open (`file://...`)

## Deploy

- Push `index.html`, `assets/`, and `scripts/` to the repository branch used by GitHub Pages.
