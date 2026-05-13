#!/bin/bash
# Retry failed uploads with rate limiting
# Usage: ./retry-failed-safe.sh Production_XXX [parallelism]

BUCKET="3d-models"
BASE="/Volumes/data/3Dproject/3D"
PROD="$1"
PARALLEL=${2:-2}
LOG="/tmp/upload_${PROD}.log"

# Also check safe log
if [ ! -f "$LOG" ]; then
  LOG="/tmp/upload_${PROD}_safe.log"
fi
if [ ! -f "$LOG" ]; then
  echo "No log file found for $PROD"
  exit 1
fi

grep "^✗" "$LOG" | sed 's/^✗ //' > /tmp/failed_${PROD}.txt
failed_count=$(wc -l < /tmp/failed_${PROD}.txt | tr -d ' ')
echo "Found $failed_count failed files in $PROD to retry"

if [ "$failed_count" -eq 0 ]; then
  echo "No failed files to retry"
  exit 0
fi

upload_file() {
  local rel="$1"
  local file="$BASE/$rel"
  if [ ! -f "$file" ]; then
    echo "✗ $rel (missing)"
    return 1
  fi
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
  sleep 0.5
}

export -f upload_file
export BUCKET BASE

echo "Retrying with $PARALLEL workers..."
cat /tmp/failed_${PROD}.txt | xargs -P $PARALLEL -I {} bash -c 'upload_file "$@"' _ {}

echo "=== $PROD retry complete ==="
