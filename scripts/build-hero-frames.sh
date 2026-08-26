#!/usr/bin/env bash
# Converts assets/KALPATARU SHOW APARTMENT/scene*.png (428 source renders,
# odd-numbered scene00001..scene00855) into a 1-indexed, zero-padded webp
# sequence for the pinned hero scroll animation.
#
# Re-run this any time the source renders in
# "assets/KALPATARU SHOW APARTMENT/" are swapped out.
set -euo pipefail

SRC="assets/KALPATARU SHOW APARTMENT"
OUT="assets/hero-src/apartment-sequence"

mkdir -p "$OUT"
rm -f "$OUT"/frame-*.webp

shopt -s nullglob
files=("$SRC"/scene*.png)
shopt -u nullglob

if [ "${#files[@]}" -eq 0 ]; then
  echo "No source frames found in '$SRC'" >&2
  exit 1
fi

i=1
for f in "${files[@]}"; do
  out=$(printf "%s/frame-%03d.webp" "$OUT" "$i")
  ffmpeg -y -loglevel error -i "$f" -c:v libwebp -q:v 92 -compression_level 6 "$out"
  i=$((i + 1))
done

echo "Converted ${#files[@]} frames into $OUT"
