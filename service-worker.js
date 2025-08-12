const CACHE_NAME = 'minvata-pwa-v2';
const ASSETS = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

// Установка и кэширование
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Активация и удаление старых кэшей
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
});

// Обработка запросов
self.addEventListener('fetch', e => {
  // Если это навигация — отдать index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(resp => resp || fetch('./index.html'))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request))
    );
  }
});
