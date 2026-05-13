#!/bin/bash
# 用 --remote 上传 Production 到 R2（确保 r2.dev 公开访问生效）
# 用法: ./upload-remote.sh Production_XXX

BUCKET="3d-models"
BASE="/Volumes/data/3Dproject/3D"
PROD="$1"

if [ -z "$PROD" ]; then
  echo "Usage: $0 Production_XXX"
  exit 1
fi

count=0
total=$(find "$BASE/$PROD" -type f | wc -l | tr -d ' ')
echo "Uploading $PROD ($total files) with --remote..."

find "$BASE/$PROD" -type f | while read file; do
  rel="${file#$BASE/}"
  ext="${file##*.}"
  case "$ext" in
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
done

echo "=== $PROD upload complete ==="
