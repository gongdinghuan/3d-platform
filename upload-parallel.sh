#!/bin/bash
# Parallel upload of Production_*/ to Cloudflare R2 with --remote
# Usage: ./upload-parallel.sh Production_XXX [parallelism]
# Default parallelism: 4

BUCKET="3d-models"
BASE="/Volumes/data/3Dproject/3D"
PROD="$1"
PARALLEL=${2:-4}

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
}

export -f upload_file
export BUCKET BASE

total=$(find "$BASE/$PROD" -type f | wc -l | tr -d ' ')
echo "Uploading $PROD ($total files) with $PARALLEL parallel workers..."

find "$BASE/$PROD" -type f | xargs -P $PARALLEL -I {} bash -c 'upload_file "$@"' _ {}

echo "=== $PROD upload complete ==="
