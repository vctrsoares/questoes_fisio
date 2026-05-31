const CACHE = 'fisio-quiz-v6';

// Assets estáticos pré-cacheados (não mudam com frequência)
const STATIC = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './imgs/ENR_AOCP_q4.png',
  './imgs/ENR_AOCP_q20.png',
  './imgs/UNICAMP2025_q4.png',
  './imgs/UNICAMP2025_p5_left.png',
  './imgs/2016_q43.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
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
  // Navegação (index.html): network-first — sempre busca versão atualizada
  // Fallback para cache só se offline
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets estáticos: cache-first
  e.respondWith(
    caches.match(e.request).then(r => r ||
      fetch(e.request).then(r2 => {
        const clone = r2.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r2;
      })
    )
  );
});
