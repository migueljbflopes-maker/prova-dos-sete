/* A Prova dos Sete: guarda as três apps para abrirem sem rede. Rede primeiro, cópia guardada quando não há rede. */
const CACHE = 'prova-dos-sete-v6';
const SHELL = ['./', 'index.html', 'qrcode.js', 'manifest.webmanifest', 'manifest-gerir.webmanifest', 'manifest-mesa.webmanifest',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'icon-gerir-192.png', 'apple-touch-icon-gerir.png', 'icon-mesa-192.png', 'apple-touch-icon-mesa.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  /* Só os ficheiros da própria app. A ligação em tempo real à base de dados passa ao lado. */
  if(r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r, {ignoreSearch: true}).then(m => m || caches.match('index.html')))
  );
});
