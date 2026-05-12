const CESIUM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0N2E0ZGJjZi1kZGFkLTQ4MDAtYTgwMC05YmIxYTA2OWE1NzQiLCJpZCI6MTQyOTc1LCJpYXQiOjE2ODU0OTgwOTJ9.eG0QsVSO7AHQxKs2_pKFt_5_i1AvuPZios4fdRBQ8JU";

// TODO: 部署 R2 后将此处替换为你的 R2 公开桶地址
const R2_BASE_URL = "https://pub-xxxxxxxx.r2.dev";

const MODELS = [
  { name: "1jmg",  dir: "Production_1jmg",  lat: 29.299,   lon: 120.09118 },
  { name: "dsg",   dir: "Production_dsg",   lat: 30.02902, lon: 120.39771 },
  { name: "HTGC",  dir: "Production_HTGC",  lat: 25.46776, lon: 119.78198 },
  { name: "JHGZC", dir: "Production_JHGZC", lat: 29.10351, lon: 119.66209 },
  { name: "mqg",   dir: "Production_mqg",   lat: 29.1834,  lon: 120.30048 },
  { name: "NBGL",  dir: "Production_NBGL",  lat: 29.87707, lon: 121.54268 },
  { name: "pydf",  dir: "Production_pydf",  lat: 29.19554, lon: 120.30301 },
  { name: "SLS11", dir: "Production_SLS11", lat: 29.20985, lon: 120.05233 },
  { name: "TWG22", dir: "Production_TWG22", lat: 28.68401, lon: 115.87559 },
  { name: "wft",   dir: "Production_wft",   lat: 29.10487, lon: 119.66409 },
  { name: "wz",    dir: "Production_wz",    lat: 27.84158, lon: 121.12708 },
];
