// Tama-Tama service worker
// Strategy:
//   /_next/static/*  → cache-first (content-hashed, immutable)
//   public files     → cache-first (images, fonts, manifest)
//   pages/API        → network-first, fall back to cache

const CACHE = 'tama-tama-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // skip cross-origin (Twemoji CDN handled by browser cache)

  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    /\.(png|jpg|jpeg|svg|ico|webp|woff2?|json)$/.test(url.pathname);

  if (isStatic) {
    // Cache-first: static assets rarely change; hashed names guarantee freshness
    e.respondWith(
      caches.match(request).then(cached =>
        cached ?? fetch(request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
      )
    );
  } else {
    // Network-first for HTML pages: always try to get fresh content
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request))
    );
  }
});
