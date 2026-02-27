// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - SERVICE WORKER (PWA COMPLETA)
// ─────────────────────────────────────────────────────────────────────

const CACHE_NAME = 'aula-preescolar-v1';
const CACHE_VERSION = '2026-01';

// Archivos para cachear inmediatamente
const urlsToCache = [
    './',
    './index.html',
    './login.html',
    './admin.html',
    './lenguajes.html',
    './styles.css',
    './app.js',
    './auth.js',
    './admin.js',
    './lenguajes.js',
    './firebase-config.js',
    './data/actividades.js',
    './manifest.json'
];

// ─────────────────────────────────────────────────────────────────────
// INSTALAR SERVICE WORKER
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('install', function(event) {
    console.log('🔧 SW: Instalando...', CACHE_NAME);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('🔧 SW: Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('🔧 SW: Archivos cacheados');
                return self.skipWaiting(); // Forzar activación inmediata
            })
            .catch(function(error) {
                console.error('🔧 SW: Error al cachear:', error);
            })
    );
});

// ─────────────────────────────────────────────────────────────────────
// ACTIVAR SERVICE WORKER
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('activate', function(event) {
    console.log('🔧 SW: Activando...', CACHE_NAME);
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // Borrar caches viejas
                    if (cacheName !== CACHE_NAME && cacheName.startsWith('aula-preescolar')) {
                        console.log('🔧 SW: Borrando cache vieja:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('🔧 SW: Activación completada');
            return self.clients.claim(); // Tomar control inmediato de todas las páginas
        })
    );
});

// ─────────────────────────────────────────────────────────────────────
// FETCH - ESTRATEGIA DE RED Y CACHE
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
    // Ignorar solicitudes que no sean GET
    if (event.request.method !== 'GET') return;
    
    // Ignorar solicitudes externas (Firebase, CDN, etc.)
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Si está en cache, devolverlo
                if (response) {
                    console.log('🔧 SW: Sirviendo desde cache:', event.request.url);
                    
                    // Actualizar cache en segundo plano (stale-while-revalidate)
                    fetch(event.request).then(function(newResponse) {
                        if (newResponse && newResponse.status === 200) {
                            caches.open(CACHE_NAME).then(function(cache) {
                                cache.put(event.request, newResponse);
                            });
                        }
                    }).catch(function() {
                        // Ignorar errores de red
                    });
                    
                    return response;
                }
                
                // Si no está en cache, intentar red
                console.log('🔧 SW: Solicitando de red:', event.request.url);
                return fetch(event.request)
                    .then(function(response) {
                        // Si la respuesta es válida, guardar en cache
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        var responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                        
                        return response;
                    })
                    .catch(function(error) {
                        console.error('🔧 SW: Error de red:', error);
                        
                        // Si es navegación, devolver offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        
                        // Error genérico
                        return new Response('Offline - Sin conexión', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// ─────────────────────────────────────────────────────────────────────
// MENSAJE PARA ACTUALIZAR CACHE
// ─────────────────────────────────────────────────────────────────────
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('✅ Service Worker cargado - PWA lista para instalar');
