#!/usr/bin/env bash

set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
favicon="$root/static/favicon/favicon.svg"
social="$root/static/images/logo.svg"
headshot="$root/static/images/dean-cochran-headshot-512.webp"

magick -background none "$favicon" -resize 16x16 "$root/static/favicon/favicon-16x16.png"
magick -background none "$favicon" -resize 32x32 "$root/static/favicon/favicon-32x32.png"
magick -background none "$favicon" -resize 180x180 "$root/static/favicon/apple-touch-icon.png"
magick -background none "$favicon" -resize 192x192 "$root/static/favicon/android-chrome-192x192.png"
magick -background none "$favicon" -resize 512x512 "$root/static/favicon/android-chrome-512x512.png"
magick "$root/static/favicon/favicon-16x16.png" "$root/static/favicon/favicon-32x32.png" "$root/static/favicon/favicon.ico"

magick "$social" "$root/static/images/logo.png"
magick -quality 90 "$social" "$root/static/images/logo.webp"
cp "$root/static/images/logo.webp" "$root/src/lib/assets/post-images/logo.webp"
magick "$headshot" "$root/static/images/dean-cochran-headshot-social.png"
