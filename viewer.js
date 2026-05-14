Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayerPicker: false,
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  fullscreenButton: false,
});

function makeLabelSvg(name) {
  const fontSize = 15;
  const paddingX = 18;
  const paddingY = 10;
  const textLen = name.length * fontSize;
  const w = textLen + paddingX * 2;
  const h = fontSize + paddingY * 2;

  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + 8}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(10,20,40,0.88)"/>
      <stop offset="100%" stop-color="rgba(0,120,180,0.72)"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="3" ry="3" fill="url(#bg)" stroke="#00d4ff" stroke-width="1.2"/>
  <line x1="4" y1="1" x2="14" y2="1" stroke="#00ffff" stroke-width="2"/>
  <line x1="${w - 14}" y1="1" x2="${w - 4}" y2="1" stroke="#00ffff" stroke-width="2"/>
  <line x1="4" y1="${h - 1}" x2="14" y2="${h - 1}" stroke="#00ffff" stroke-width="2"/>
  <line x1="${w - 14}" y1="${h - 1}" x2="${w - 4}" y2="${h - 1}" stroke="#00ffff" stroke-width="2"/>
  <polygon points="${w / 2 - 5},${h} ${w / 2 + 5},${h} ${w / 2},${h + 8}" fill="url(#bg)" stroke="#00d4ff" stroke-width="1"/>
  <text x="${w / 2}" y="${h / 2 + fontSize * 0.35}" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="${fontSize}" font-weight="500" fill="#fff" filter="url(#glow)">${name}</text>
</svg>`)}`;
}

MODELS.forEach((model) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(model.lon, model.lat),
    billboard: {
      image: makeLabelSvg(model.name),
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    properties: {
      productionName: model.name,
      productionDir: model.dir,
    },
  });
});

const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction((click) => {
  const picked = viewer.scene.pick(click.position);
  if (Cesium.defined(picked) && picked.id && picked.id.properties) {
    const props = picked.id.properties;
    const dir = props.productionDir && props.productionDir.getValue ? props.productionDir.getValue() : null;
    if (dir) {
      openViewer(props.productionName.getValue ? props.productionName.getValue() : "", dir);
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function openViewer(name, dir) {
  const url = `${R2_BASE_URL}/${dir}/App/index.html`;
  const win = window.open(url, "_blank");
  if (!win || win.closed) {
    alert("浏览器阻止了弹窗，请允许本站弹出窗口后重试。");
  }
}

// Wait for globe tiles to fully render, then hide loading and fly to China
const loadingEl = document.getElementById("loading");
let tilesStarted = false;
let done = false;

viewer.scene.globe.tileLoadProgressEvent.addEventListener(function (queueLength) {
  if (queueLength > 0) tilesStarted = true;
  if (tilesStarted && queueLength === 0 && !done) {
    done = true;
    setTimeout(function () {
      loadingEl.classList.add("fade-out");
      setTimeout(function () { loadingEl.remove(); }, 800);
      flyToChina();
    }, 600);
  }
});

function flyToChina() {
  const lats = MODELS.map(m => m.lat);
  const lons = MODELS.map(m => m.lon);
  const pad = 1.5;
  const rect = Cesium.Rectangle.fromDegrees(
    Math.min(...lons) - pad,
    Math.min(...lats) - pad,
    Math.max(...lons) + pad,
    Math.max(...lats) + pad
  );
  viewer.camera.flyTo({ destination: rect, duration: 2 });
}
