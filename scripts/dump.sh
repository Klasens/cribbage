#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/dump.sh                  # writes to cribbage_dump.txt in repo root
#   scripts/dump.sh /path/to/out.txt # custom output file

ROOT="$(cd "$(dirname "$0")/.."; pwd)"
OUT="${1:-$ROOT/../cribbage_dump.txt}"

# Make sure we run from repo root for consistent paths
cd "$ROOT"

# Turn on ** for recursive globs
shopt -s globstar nullglob

# Clean output
: > "$OUT"

# Write rules header at the very top
{
  echo "RULES"
  echo
  echo "## Build Rules (we’re following these)"
  echo "1. **Micro-steps only** — land small, testable changes end-to-end."
  echo "2. **Trust-first UX** — minimal enforcement; avoid heavy rules engine."
  echo "3. **Server is the source of truth** — client is a renderer/emitter."
  echo "4. **File Writing** — anytime you touch a file, write the file out in full omitting nothing."
  echo "5. **Test Path** — after making changes, outline how we test the changes in the UI."
  echo
} >> "$OUT"

# Helper to append a file to OUT with a pretty header
append() {
  local f="$1"
  {
    echo
    echo "========== FILE: $f =========="
    cat "$f"
    echo
  } >> "$OUT"
}

# Always include these (top-level docs / configs)
TOP_FILES=(
  "package.json"
  "PLAN.md"
  "README.md"
  "shared/**/*.js"
)

SERVER_FILES=(
  "server/**/*.js"
)

CLIENT_FILES=(
  "client/index.html"
  "client/vite.config.js"
  "client/src/**/*.js"
  "client/src/**/*.jsx"
  "client/src/**/*.css"
)

# Build a flat list of files that actually exist
FILES=()

for pat in "${TOP_FILES[@]}";   do FILES+=( $pat ); done
for pat in "${SERVER_FILES[@]}"; do FILES+=( $pat ); done
for pat in "${CLIENT_FILES[@]}"; do FILES+=( $pat ); done

# Filter out anything we absolutely don't want (defensive, though patterns above avoid them)
FILTERED=()
for f in "${FILES[@]}"; do
  # Skip directories or non-regular
  [[ -f "$f" ]] || continue
  # Skip node_modules, git, dist, lockfiles, public assets
  [[ "$f" == *"node_modules/"* ]] && continue
  [[ "$f" == ".git"* || "$f" == */".git"* ]] && continue
  [[ "$f" == *"package-lock.json" ]] && continue
  [[ "$f" == "client/dist"* || "$f" == */"dist/"* ]] && continue
  [[ "$f" == "client/public/"* ]] && continue
  FILTERED+=( "$f" )
done

# Write a header with a trimmed tree (informational)
{
  echo "========== FILE TREE (filtered) =========="
  for f in "${FILTERED[@]}"; do echo "$f"; done | sort
  echo
} >> "$OUT"

# Append each file with a clear header
for f in "${FILTERED[@]}"; do
  append "$f"
done

echo "Wrote $((${#FILTERED[@]})) files to: $OUT"

