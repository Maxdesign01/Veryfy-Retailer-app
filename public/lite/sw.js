const CACHE_NAME = 'veryfy-lite-v1';
const ASSETS_TO_CACHE = [
  '/lite/',
  '/lite/index.html',
  '/lite/lite-style.css',
  '/lite/lite-app.js',
  '/lite/manifest.json',
  '/assets/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For /lite navigation and static assets, serve from cache first
  if (url.pathname.startsWith('/lite') || url.pathname.includes('/assets/favicon.png')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and fetch updated version in background (stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(event.request).catch(() => caches.match('/lite/index.html'));
      })
    );
    return;
  }

  // Default network fetch
  event.respondWith(fetch(event.request));
});
