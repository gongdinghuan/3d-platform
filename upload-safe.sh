#!/bin/bash
# Rate-limit-safe parallel upload to Cloudflare R2
# Usage: ./upload-safe.sh Production_XXX [parallelism]
# Adds 0.5s delay between spawns to avoid 429 errors

BUCKET="3d-models"
BASE="/Volumes/data/3Dproject/3D"
PROD="$1"
PARALLEL=${2:-3}

if [ -z "$PROD" ]; then
  echo "Usage: $0 Production_XXX [parallelism]"
  exit 1
fi

upload_file() {
  local file="$1"
  local rel="${file#$BASE/}"
  local ct=""
  case "${file##*.}" in
    html) ct="text/html" ;;
    js)   ct="application/javascript" ;;
    css)  ct="text/css" ;;
    json) ct="application/json" ;;
    xml)  ct="application/xml" ;;
    jpg)  ct="image/jpeg" ;;
    png)  ct="image/png" ;;
    pdf)  ct="application/pdf" ;;
    map)  ct="application/json" ;;
    3mx)  ct="application/json" ;;
    3mxb) ct="application/octet-stream" ;;
    *)    ct="application/octet-stream" ;;
  esac
  wrangler r2 object put "$BUCKET/$rel" --file="$file" --content-type="$ct" --remote 2>/dev/null && echo "✓ $rel" || echo "✗ $rel"
  sleep 0.3
}

export -f upload_file
export BUCKET BASE

total=$(find "$BASE/$PROD" -type f | wc -l | tr -d ' ')
echo "Uploading $PROD ($total files) with $PARALLEL workers + rate limit..."

find "$BASE/$PROD" -type f | xargs -P $PARALLEL -I {} bash -c 'upload_file "$@"' _ {}

echo "=== $PROD upload complete ==="
