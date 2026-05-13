#!/bin/bash
# 并行上传 Production_*/ 到 Cloudflare R2
# 用法: ./upload.sh [production_name]
# 不带参数则上传所有 production

BUCKET="3d-models"
BASE="/Volumes/data/3Dproject/3D"
PARALLEL=8

upload_file() {
  local file="$1"
  local rel="${file#$BASE/}"
  # 根据扩展名设置 content-type
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
  wrangler r2 object put "$BUCKET/$rel" --file="$file" --content-type="$ct" 2>/dev/null && echo "✓ $rel" || echo "✗ $rel"
}

export -f upload_file
export BUCKET BASE

if [ -n "$1" ]; then
  # 上传指定 production
  find "$BASE/$1" -type f | xargs -P $PARALLEL -I {} bash -c 'upload_file "$@"' _ {}
else
  # 上传所有 production
  find "$BASE"/Production_* -type f | xargs -P $PARALLEL -I {} bash -c 'upload_file "$@"' _ {}
fi
