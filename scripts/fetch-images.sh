#!/bin/sh
# Pull logo/hero/OG images from the Netlify production copy.
# Binary images are not pushed through the GitHub text connector.
set -eu
base="${1:-https://sitewizard-buildy.netlify.app}"
mkdir -p img
for f in logo-120.png favicon.png hero-1100.webp buildys-head.png og.png; do
  echo "fetching $f"
  curl -fsSL "$base/img/$f" -o "img/$f"
done
ls -l img
