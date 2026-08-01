const CACHE = "peakbook-v4";
const APP_SHELL = ["/", "/adventures", "/adventures/new", "/profile"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => { const url = new URL(event.request.url); if (event.request.method !== "GET" || url.origin !== self.location.origin) return; event.respondWith(fetch(event.request).then(response => { const clone = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, clone)); return response; }).catch(() => caches.match(event.request))); });
