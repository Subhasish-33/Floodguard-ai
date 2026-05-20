const env = import.meta.env

export const appConfig = {
  appName: env.VITE_APP_NAME ?? 'FloodGuard AI',
  initialDistrictRisk: Number(env.VITE_INITIAL_DISTRICT_RISK ?? 0.55),
  heatmapOpacity: Number(env.VITE_HEATMAP_OPACITY ?? 0.7),
  terrainHeightScale: Number(env.VITE_TERRAIN_HEIGHT_SCALE ?? 6),
  cameraDistance: Number(env.VITE_CAMERA_DISTANCE ?? 28),
  manifestPath: env.VITE_DATA_MANIFEST_PATH ?? '/data/manifest.json',
}
