#!/usr/bin/env bash
# Build the site and publish it to the gh-pages branch of origin.
# GitHub Pages serves that branch at https://e-landeros.github.io/
#
# Usage: ./publish.sh
set -euo pipefail

cd "$(dirname "$0")"

REMOTE="$(git remote get-url origin)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "$BRANCH" != "main" ]; then
  echo "warning: publishing from '$BRANCH' instead of 'main'" >&2
fi

# Notebooks in this project are .ipynb sources whose outputs are rendered
# as-is; the .qmd posts execute against this environment.
if [ ! -x ".venv/bin/python" ]; then
  echo "error: .venv missing — run 'uv sync' first" >&2
  exit 1
fi
export QUARTO_PYTHON="$PWD/.venv/bin/python"

echo "==> rendering site"
quarto render

# GitHub Pages must not run the output through Jekyll.
touch _site/.nojekyll

if [ -e "_site/.env" ]; then
  echo "error: .env leaked into _site" >&2
  exit 1
fi

echo "==> staging output"
STAGE="$(mktemp -d)"
cleanup() { rm -rf "$STAGE"; }
trap cleanup EXIT

cp -R _site/. "$STAGE"/
git -C "$STAGE" init -q -b gh-pages
git -C "$STAGE" add -A
git -C "$STAGE" \
  -c user.name="$(git config user.name || echo 'Fabian Landeros')" \
  -c user.email="$(git config user.email || echo 'landerosedgard@gmail.com')" \
  commit -q -m "publish: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "==> pushing gh-pages to $REMOTE"
git -C "$STAGE" push -q --force "$REMOTE" gh-pages

echo
echo "published. live site: https://e-landeros.github.io/"
echo "first time only: repo Settings -> Pages -> Deploy from a branch -> gh-pages / (root), then Enforce HTTPS"
