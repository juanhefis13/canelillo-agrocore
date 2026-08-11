const CACHE = "canelillo-agrocore-v251-fertilizer-history-users";
const ASSETS = ["./", "./index.html", "./privacidad.html", "./styles.css?v=251-fertilizer-history-users", "./app.js?v=251-fertilizer-history-users", "./manifest.json", "./data/programa_fitosanitario.json", "./data/canelillo_limites.geojson", "./vendor/xlsx.full.min.js", "./vendor/pdf-lib.min.js"];

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
