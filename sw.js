// Bewaart de pagina, foto's en iconen zodat de app ook zonder internet opent.
// Nummers worden niet bewaard: die streamen gewoon vanaf de server.
const CACHE = "david-v1";
const BESTANDEN = ["./", "index.html", "manifest.webmanifest", "img/david-portret.jpg", "img/palomine.jpg", "img/david-zon.jpg", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BESTANDEN)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.includes("/audio/")) return;
  // Eerst internet (zodat updates meteen zichtbaar zijn), anders de bewaarde versie
  e.respondWith(
    fetch(e.request).then(r => {
      const kopie = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, kopie));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
