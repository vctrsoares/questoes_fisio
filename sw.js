const CACHE = 'fisio-quiz-v5';
const FILES = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './imgs/ENR_AOCP_q4.png', './imgs/ENR_AOCP_q20.png',
  './imgs/UNICAMP2025_q4.png', './imgs/UNICAMP2025_p5_left.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
