// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - SERVICE WORKER (OFFLINE)
// ─────────────────────────────────────────────────────────────────────

const CACHE_NAME = 'aula-preescolar-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './data/actividades.js',
    './manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch - Servir desde cache si offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});