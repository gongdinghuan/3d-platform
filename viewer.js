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

// 计算所有模型的包围矩形，让初始视图展示所有标记
viewer.scene.postRender.addEventListener(function flyToBounds() {
  viewer.scene.postRender.removeEventListener(flyToBounds);
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
});

// 添加标记
MODELS.forEach((model) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(model.lon, model.lat),
    billboard: {
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23e74c3c' stroke='%23fff' stroke-width='3'/%3E%3Ccircle cx='16' cy='12' r='4' fill='%23fff'/%3E%3C/svg%3E",
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

function openViewer(name, dir) {
  window.open(`${R2_BASE_URL}/${dir}/App/index.html`, "_blank");
}
