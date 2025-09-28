#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/dump.sh                    # full codebase → ../cribbage_dump.txt
#   scripts/dump.sh --frontend         # FE-only      → ../cribbage_dump_frontend.txt
#   scripts/dump.sh --backend          # BE-only      → ../cribbage_dump_backend.txt
#   scripts/dump.sh --split            # FE + BE      → ../cribbage_dump_frontend.txt and ..._backend.txt
#
# Notes:
# - "TOP" + "shared" are included in both FE and BE so each dump stands alone.

MODE="${1:---full}"

ROOT="$(cd "$(dirname "$0")/.."; pwd)"
OUT_FULL="$ROOT/../cribbage_dump.txt"
OUT_FE="$ROOT/../cribbage_dump_frontend.txt"
OUT_BE="$ROOT/../cribbage_dump_backend.txt"

cd "$ROOT"
shopt -s globstar nullglob

# ---------- file sets ----------
TOP_FILES=(
  "package.json"
  "PLAN.md"
  "README.md"
)

SHARED_FILES=(
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

# ---------- helpers ----------
write_rules_header() {
  local out="$1"
  : > "$out"
  {

    echo "RULES"
    echo
    echo "## Build Rules (we’re following these)"
    echo "1. **Server is truth** — UI only renders state, never owns game logic."
    echo "2. **File Writing** — if a file changes, output the full file in full."
    echo "3. **Test Path** — describe how to check the UI update in browser."
    echo "4. **Commit Format** — 72-char subject, then 3 concise bullets."
    echo
  } >> "$out"
}

append_file() {
  local out="$1" f="$2"
  {
    echo
    echo "========== FILE: $f =========="
    cat "$f"
    echo
  } >> "$out"
}

collect_and_filter() {
  # args: patterns...
  local pats=("$@")
  local files=()
  for pat in "${pats[@]}"; do files+=( $pat ); done

  local kept=()
  for f in "${files[@]}"; do
    [[ -f "$f" ]] || continue
    [[ "$f" == *"node_modules/"* ]] && continue
    [[ "$f" == ".git"* || "$f" == */".git"* ]] && continue
    [[ "$f" == *"package-lock.json" ]] && continue
    [[ "$f" == "client/dist"* || "$f" == */"dist/"* ]] && continue
    [[ "$f" == "client/public/"* ]] && continue
    kept+=( "$f" )
  done
  printf "%s\n" "${kept[@]}"
}

dump_set() {
  # args: out_file; patterns...
  local out="$1"; shift
  write_rules_header "$out"

  mapfile -t filtered < <(collect_and_filter "$@")

  {
    echo "========== FILE TREE (filtered) =========="
    for f in "${filtered[@]}"; do echo "$f"; done | sort
    echo
  } >> "$out"

  for f in "${filtered[@]}"; do
    append_file "$out" "$f"
  done

  echo "Wrote ${#filtered[@]} files to: $out"
}

# ---------- execution ----------
case "$MODE" in
  --frontend)
    dump_set "$OUT_FE" \
      "${TOP_FILES[@]}" \
      "${SHARED_FILES[@]}" \
      "${CLIENT_FILES[@]}"
    ;;
  --backend)
    dump_set "$OUT_BE" \
      "${TOP_FILES[@]}" \
      "${SHARED_FILES[@]}" \
      "${SERVER_FILES[@]}"
    ;;
  --split)
    dump_set "$OUT_FE" \
      "${TOP_FILES[@]}" \
      "${SHARED_FILES[@]}" \
      "${CLIENT_FILES[@]}"
    dump_set "$OUT_BE" \
      "${TOP_FILES[@]}" \
      "${SHARED_FILES[@]}" \
      "${SERVER_FILES[@]}"
    ;;
  --full|*)
    # default: everything into one file
    dump_set "$OUT_FULL" \
      "${TOP_FILES[@]}" \
      "${SHARED_FILES[@]}" \
      "${SERVER_FILES[@]}" \
      "${CLIENT_FILES[@]}"
    ;;
esac

