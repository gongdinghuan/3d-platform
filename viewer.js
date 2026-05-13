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

// Camera 飞到中国中部
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(119.5, 28.5, 600000),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0,
  },
  duration: 2,
});

// 添加标记
MODELS.forEach((model) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(model.lon, model.lat),
    billboard: {
      image: "https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Assets/Widgets/Navigation/CompassOuterRing.svg",
      width: 32,
      height: 32,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
    label: {
      text: model.name,
      font: "14px sans-serif",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      outlineColor: Cesium.Color.BLACK,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 8),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    properties: {
      productionName: model.name,
      productionDir: model.dir,
    },
  });
});

// 点击事件
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

// Modal 逻辑
const modal = document.getElementById("viewerModal");
const frame = document.getElementById("viewerFrame");
const title = document.getElementById("modalTitle");
const closeBtn = document.getElementById("modalClose");

function openViewer(name, dir) {
  title.textContent = name;
  frame.src = `${R2_BASE_URL}/${dir}/App/index.html`;
  modal.classList.remove("hidden");
}

closeBtn.addEventListener("click", closeViewer);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeViewer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeViewer();
});

function closeViewer() {
  modal.classList.add("hidden");
  frame.src = "";
}
