const CACHE = "canelillo-agrocore-v340-field-boundary";
const ASSETS = ["./", "./index.html", "./privacidad.html", "./styles.css?v=340-field-boundary", "./agricultural-map.js?v=340-field-boundary", "./index-color-scales.js?v=340-field-boundary", "./app.js?v=340-field-boundary", "./manifest.json", "./logo-canelillo.png", "./data/programa_fitosanitario.json", "./data/programa_fertilizante.json?v=3", "./data/canelillo_limites.geojson", "./outputs/potreros.geojson", "./outputs/bloques.geojson", "./outputs/casetas.geojson", "./outputs/tranques.geojson", "./outputs/monitoreo_arboles.json?v=1", "./assets/tree-marker-cc0.png?v=2", "./assets/caseta-map-marker.png", "./vendor/xlsx.full.min.js", "./vendor/pdf-lib.min.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
