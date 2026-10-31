# elanderos.github.io — redesign & migration plan

Working document. Check items off as they land. Batches are ordered so that nothing
references a file that does not exist yet, and so that every batch leaves the repo
renderable.

**Target:** `https://e-landeros.github.io/` — GitHub user site, public repo
`e-landeros.github.io`, wordmark `elanderos`, dark Catppuccin Mocha, no CI, no content rewrite.

**Locked decisions**

| Decision | Choice |
|---|---|
| Wordmark / title | `elanderos` · "Fabian Landeros" |
| Repo + URL | rename `landeros_labs_blog` → `e-landeros.github.io`, public, root URL |
| Account rename | No — keep `e-landeros` |
| Theme | Catppuccin **Mocha**, dark only, whole site |
| IDE resemblance | Blog layout as-is + colorful IDE-style icons (no VSCode costume) |
| Icons | Catppuccin-accent social icons, per-category icons, custom favicon |
| Hero | Keep layout + birds animation, recolor to Mocha |
| Nav | Posts, About, search; resurrect `about.qmd` |
| Infra | RSS, sitemap, OG cards, 404 |
| Comments | None |
| Deploy | Local render → orphan `gh-pages` branch via `publish.sh`, no CI |
| Freeze | Regenerate and commit `_freeze` |
| Content | No pruning/rewrite in this pass (owner does it manually) |
| Analytics | Keep `G-8BJ08S4YXX` |
| Local repo path | Stays `fab_blog/myblog/` |

---

## Batch 1 — Repo hygiene

- [ ] Create branch `redesign/catppuccin`
- [ ] Untrack orphaned freeze caches for deleted posts (`first-post`, `post-with-code`, `reinforcement-learning-summarize`)
- [ ] `git mv _archive/about.qmd about.qmd`, remove `_archive/` (content rewritten in Batch 5)
- [ ] Rewrite `.gitignore` — it currently ignores itself (line 4) and is **untracked**, so the repo ships with no ignore rules at all. New rules: `.env`, `.DS_Store`, `_site/`, `.quarto/`, `**/*.quarto_ipynb`, `*.log`, `.venv/`, `__pycache__/`. Force-add it so it is tracked.
- [ ] Delete junk one level up: `fab_blog/.DS_Store`, `fab_blog/.gitignore`, `fab_blog/.nojekyll`, `fab_blog/.env` (both API keys are dead — verified 401/400)
- [ ] Rename `posts/Vector-search-anomoly-detection/anomalous_name_detection_blog.ipynb` → `index.ipynb` so the post publishes at `/index.html` instead of a stray filename
- [ ] Confirm no `.DS_Store` is tracked (verified: 0 tracked, all ignored)
- [ ] Commit: `chore: repo hygiene — gitignore, stale freeze, archive, stray files`

**Gate:** `git status` clean, `git ls-files | grep -c DS_Store` = 0, `quarto render` still resolves (theme file untouched until Batch 3).

---

## Batch 2 — uv environment (local render + freeze)

- [ ] Delete `requirements.txt` (it pins `tensorflow`, which **no notebook imports** — verified)
- [ ] Create `pyproject.toml`: Python 3.12, deps = actual import surface: numpy, pandas, matplotlib, seaborn, scikit-learn, torch, torchvision, tensorboard (needed by `MAB-deep-dive`), scipy, pydantic, pydantic-ai, plotly, statsmodels, opencv-python-headless, pillow, pytesseract, easyocr, pymc, faiss-cpu, ollama, flask, networkx, requests, faker, python-dotenv, nest-asyncio, sortedcontainers, ipython, ipykernel, jupyter
- [ ] `uv lock`, commit `uv.lock`
- [ ] `uv sync`, register the venv kernel so Quarto resolves `python3` to it (`QUARTO_PYTHON=.venv/bin/python`)
- [ ] `brew install tesseract` if not present (`pytesseract` needs the binary)
- [ ] Render + freeze every post **except** the two blocked API posts (see Open Items)
- [ ] Commit regenerated `_freeze/`
- [ ] Commit: `build: uv environment and refreshed freeze cache`

**Gate:** a second `quarto render` completes with zero notebook execution (cache hits) and no errors.

---

## Batch 3 — Catppuccin Mocha site theme

- [ ] Add `theme/catppuccin-mocha.scss` — Bootstrap variable overrides + component styles (navbar, footer, cards, listing, tables, callouts, TOC, search)
- [ ] Add `theme/catppuccin-mocha.theme` — Pandoc syntax-highlighting JSON built on the Mocha palette (base `#1e1e2e`, mantle `#181825`, crust `#11111b`, surface0 `#313244`, text `#cdd6f4`, blue `#89b4fa`, mauve `#cba6f7`, red `#f38ba8`, green `#a6e3a1`, peach `#fab387`, teal `#94e2d5`, yellow `#f9e2af`, pink `#f5c2e7`, sky `#89dceb`, lavender `#b4befe`)
- [ ] `_quarto.yml`: replace `theme: cyborg` with the Mocha SCSS; replace `syntax-highlighting: one-dark-catppuccin-latte.theme` with the Mocha theme; delete the Latte `.theme` file; drop `output: ipynb: theme: red`
- [ ] Rewrite `styles.css` — remove the Latte overrides that force `#eff1f5` code blocks, add Mocha code-block chrome (border, radius, line numbers), listing cards, category chips
- [ ] Contrast pass: body text ≥ AA on `#1e1e2e`, code text ≥ AA on `#181825`
- [ ] Commit: `feat: Catppuccin Mocha theme for site and code blocks`

**Gate:** rendered post shows Mocha code blocks with no light-palette leakage; mobile width 375px has no overflow.

---

## Batch 4 — Icons

- [ ] Navbar + footer: recolored icons (Mauve/Blue/Peach/Green) instead of brand colors
- [ ] Normalize social URLs — navbar currently points X at `landeros_labs`, footer at `e_landeros_`, and footer LinkedIn at `flanderos` while navbar says `e_landeros_`. All become `e_landeros_` / `e_landeros` / `elanderos` (Kaggle)
- [ ] Category icons + accent colors on listing cards: Marketing Analytics → Peach, Reinforcement Learning → Mauve, Machine Learning → Blue, AI Research → Green, Data Science → Teal
- [ ] Favicon: `e_` monogram, Mauve on Crust, as SVG + `.ico` + apple-touch-icon, wired via `_quarto.yml`
- [ ] Icon CSS uses `currentColor`/`mask` so icons recolor per context
- [ ] Commit: `feat: Catppuccin icon set, favicon, normalized social links`

**Gate:** icons legible at 16px and 32px; favicon resolves at `/favicon.ico`.

---

## Batch 5 — Homepage, About, navigation

- [ ] Hero recolored to Mocha; birds canvas recolored to Sky/Lavender; profile ring Mauve; career-highlight bullets in Teal
- [ ] Rewrite `about.qmd` from the archived copy, move the career highlights there
- [ ] Navbar: `Posts`, `About`, search box; keep social icons on the right
- [ ] Style search results + About page
- [ ] Commit: `feat: Mocha hero, About page, navigation and search`

**Gate:** every navbar link resolves; search returns results for a known post title.

---

## Batch 6 — Blog infrastructure

- [ ] RSS feed + sitemap in `_quarto.yml`
- [ ] Open Graph / Twitter card metadata on posts
- [ ] Styled `404.qmd`
- [ ] Commit: `feat: RSS, sitemap, social cards, 404`

**Gate:** `/sitemap.xml` and `/index.xml` render; 404 page styled.

---

## Batch 7 — Publish

- [ ] `git remote` → rename repo: `gh repo rename e-landeros.github.io --repo e-landeros/landeros_labs_blog` (GitHub keeps redirects from the old name)
- [ ] `gh repo edit e-landeros.github.io --visibility public --description "..." --homepage "https://e-landeros.github.io"`
- [ ] Add `publish.sh`: render → `touch _site/.nojekyll` → push `_site` to orphan `gh-pages` (force, with a timestamped commit message)
- [ ] Rewrite `README.md`: uv workflow, publish flow, what is committed vs ignored, drop Netlify instructions
- [ ] Commit: `chore: publish script and README`
- [ ] **Manual (you):** repo Settings → Pages → Source: *Deploy from a branch* → `gh-pages` / `/ (root)`; then Enforce HTTPS
- [ ] **Manual (you):** verify `https://e-landeros.github.io/` loads, code blocks are Mocha, icons render

**Gate:** live site matches local render; no `.env` or secrets in the published tree.

---

## Open items (blocked on you)

1. **Two posts cannot be re-executed.** `posts/cs-agents-pydantic` and `posts/pydantic-ai-agent-patterns` have no freeze cache and their code calls `OpenAIModel` / `run_sync` (plus a DuckDuckGo tool and an Ollama reference). Both API keys in `.env` are dead. Options:
   - (a) supply one working `OPENAI_API_KEY` — cleanest, post outputs stay real;
   - (b) add `execute: enabled: false` to those two posts — code renders, outputs disappear;
   - (c) keep their existing `_site` HTML and never re-render them — outputs preserved but they drift from the new theme.
2. **Directory rename** `posts/Vector-search-anomoly-detection/` → `posts/vector-search-anomaly-detection/` (fixes the typo and the capital letters, changes the URL). Old URLs are already dead with the Netlify domain, so this is free — confirm and I'll do it.
3. **Install weight:** `torch` + `torchvision` + `easyocr` is ~2.5 GB in the uv venv, and `pymc` pulls a compiler toolchain. Confirm you are fine with that disk cost, or I trim `easyocr`/`pymc` and accept that those posts cannot be re-executed.
4. **`tesseract`** binary is required by `pytesseract` (you said it is installed via brew — I will verify with `brew list tesseract`).

## Verification checklist (final)

- [ ] `quarto render` from a clean clone succeeds with the committed `_freeze`
- [ ] No secrets tracked (`git ls-files | grep -i env` shows only `.env.example` if added)
- [ ] Every post page returns 200 on the live site
- [ ] Mobile 375px / desktop 1440px both clean
- [ ] Lighthouse a11y ≥ 90
