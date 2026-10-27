# Portfolio

My personal site: https://jpcass07.github.io/Portfolio/

Version 2, rebuilt in October 2026. One static page in plain HTML, CSS and a little JavaScript, with no build step and no dependencies.

## Run it locally
```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## What's where
| File | What |
|---|---|
| `index.html` | The page |
| `styles.css` | Design tokens in `:root` for the dark and light themes, then each section |
| `script.js` | Theme switch, scroll reveals, project sorting and the write-up pop-ups. The page works without it |
| `assets/` | Favicon, app icons and the social preview image, with their SVG sources |

## Version 1
The first version (August 2025) started as a Flask app and was rebuilt as static pages to host on GitHub Pages. It is in this repo's history, and the Flask version is on the `Flask-Backend-useage` branch.
