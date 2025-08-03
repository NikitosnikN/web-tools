const CACHE_NAME = 'webtools-v1';
const STATIC_CACHE = 'webtools-static-v1';
const DYNAMIC_CACHE = 'webtools-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/timer/',
  '/qr/',
  '/qr-creator/',
  '/jpg/',
  '/heic/',
  '/wa/',
  '/golden-ratio/',
  '/pi-visualization/',
  '/fractal-tree/',
  '/manifest.json',
  '/icon.svg',
  '/offline.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

const CACHE_STRATEGIES = {
  static: ['/', '.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'],
  networkFirst: ['.json'],
  cacheFirst: ['.woff2', '.woff', '.ttf', 'font-awesome']
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.protocol === 'chrome-extension:') {
    return;
  }

  if (shouldCacheFirst(request.url)) {
    event.respondWith(cacheFirst(request));
  } else if (shouldNetworkFirst(request.url)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

function shouldCacheFirst(url) {
  return CACHE_STRATEGIES.cacheFirst.some(pattern => url.includes(pattern));
}

function shouldNetworkFirst(url) {
  return CACHE_STRATEGIES.networkFirst.some(pattern => url.includes(pattern));
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (request.destination === 'document') {
      return caches.match('/') || caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    throw error;
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    if (request.destination === 'document') {
      return caches.match('/') || caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    throw new Error('Network error');
  });

  return cachedResponse || fetchPromise;
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});