#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   scripts/dump.sh server/engine/pegging
#
# This will create a file like:
#   ../cribbage_dump_server_engine_pegging.txt
#
# Notes:
# - Paths are relative to the repo root.
# - node_modules, .git, dist, client/public, and package-lock.json are skipped.

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <folder-relative-to-repo-root>" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.."; pwd)"
cd "$ROOT"

FOLDER="${1%/}"   # strip trailing slash if present

if [[ ! -d "$FOLDER" ]]; then
  echo "Error: folder '$FOLDER' does not exist under $ROOT" >&2
  exit 1
fi

# Normalize folder name for the output filename: replace / with _
SAFE_NAME="${FOLDER//\//_}"
OUT_FILE="$ROOT/../cribbage_dump_${SAFE_NAME}.txt"

shopt -s globstar nullglob

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

dump_folder() {
  local folder="$1"
  local out="$2"

  write_rules_header "$out"

  # collect all files under the folder, recursively
  mapfile -t filtered < <(collect_and_filter "$folder"/**/*)

  {
    echo "========== FILE TREE (filtered) =========="
    for f in "${filtered[@]}"; do echo "$f"; done | sort
    echo
  } >> "$out"

  for f in "${filtered[@]}"; do
    append_file "$out" "$f"
  done

  echo "Wrote ${#filtered[@]} files from '$folder' to: $out"
}

# ---------- execution ----------
dump_folder "$FOLDER" "$OUT_FILE"

