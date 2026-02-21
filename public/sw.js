// rePROMPTer Service Worker
// Cache-first for static assets, network-first for API calls.

const CACHE_NAME = 'repromter-v2';

self.addEventListener('install', (event) => {
  // Cache the scope root (index.html), manifest, and favicon relative to the SW scope.
  const scope = self.registration.scope;
  const urls = [scope, new URL('manifest.json', scope).href, new URL('favicon.svg', scope).href];
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urls))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-only for API calls — never cache mutable data
  if (url.pathname.includes('/api/')) {
    return;
  }

  // Cache-first for same-origin static assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
