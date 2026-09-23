const CACHE = 'monade-os-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/extra.css',
  './css/mobile.css',
  './js/theme.js',
  './js/site-theme.js',
  './js/search.js',
  './js/hero-logo.js',
  './js/boot-screen.js'
];

self.addEventListener('install', e => {
  // Сразу активируем новый SW, не ждём закрытия вкладок
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', e => {
  // Удаляем ВСЕ старые кеши
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('[SW] Удаляю старый кеш:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // HTML — сначала сеть, потом кеш (чтобы всегда свежий)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        var copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // JS и CSS — сначала сеть, потом кеш (важно для обновлений)
  if (e.request.url.match(/\.(js|css)($|\?)/)) {
    e.respondWith(
      fetch(e.request).then(res => {
        var copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Всё остальное — сначала кеш
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
