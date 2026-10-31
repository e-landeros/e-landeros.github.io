# elanderos

Source for **[e-landeros.github.io](https://e-landeros.github.io/)** — a Quarto
blog about AI, data, and the things I build. Dark Catppuccin Mocha theme, IDE-style
iconography.

## Stack

- [Quarto](https://quarto.org/) 1.10 for the site build
- [uv](https://docs.astral.sh/uv/) for the Python environment
- GitHub Pages (served from the `gh-pages` branch)

## Setup

```bash
brew install quarto tesseract
uv sync
```

`tesseract` is required by `pytesseract` in the OCR posts; `uv sync` installs the
notebook dependencies (torch, pymc, easyocr, …) which is a multi-GB download.

## Preview

```bash
export QUARTO_PYTHON="$PWD/.venv/bin/python"
quarto preview
```

`QUARTO_PYTHON` is required — without it Quarto will not find the project
environment.

## Publishing

```bash
./publish.sh
```

The script renders the site, writes `_site/.nojekyll`, and force-pushes the output
to an orphan `gh-pages` branch on `origin`. There is no CI: publishing happens from
this machine.

**`git push` does not update the live site.** GitHub Pages serves the `gh-pages`
branch, not `main`. Pushing to `main` only backs up source; run `./publish.sh`
whenever you want the public site to change. `publish.sh` publishes whatever is in
the working tree, so commit first if you want source and site in sync. Each publish
replaces the `gh-pages` history — never hand-edit that branch.

After a publish, Pages takes roughly 30–60 seconds to build and the CDN caches pages
for up to 10 minutes; if content looks stale, wait and hard-refresh.

First-time setup on GitHub (one manual step): repository **Settings → Pages →
Deploy from a branch → `gh-pages` / `(root)`**, then enable **Enforce HTTPS**.

## How content builds

- **`.ipynb` posts are never executed.** Quarto renders the outputs already stored
  in the notebook. No API keys or kernels are needed for them.
- **`.qmd` posts execute** against the uv environment. Their results are cached in
  `_freeze/`, which is committed, so repeat renders are cache hits.
- If a `.qmd` post needs an API key, put it in a gitignored `.env` at the repo root
  (`python-dotenv` loads it) and re-render that post to refresh its freeze cache.

## What is ignored

`.env`, `.venv/`, `_site/`, `.quarto/`, `.DS_Store`, `**/*.quarto_ipynb`,
`__pycache__/`.

## Layout

```
_quarto.yml               site config (theme, nav, feed, social cards)
theme/                    Catppuccin Mocha SCSS + Pandoc syntax theme + head include
styles.css                hero, about, 404, icon accents
site.js                   category icon tagging + hero animation
posts/                    blog posts (.qmd and .ipynb)
_freeze/                  execution cache for .qmd posts
publish.sh                build + publish to gh-pages
```

## Credits

Catppuccin palette: [catppuccin/catppuccin](https://github.com/catppuccin/catppuccin).
