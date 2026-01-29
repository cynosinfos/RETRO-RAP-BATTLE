const CACHE_NAME = 'fighter-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/main.js',
  './js/utils.js',
  './js/classes/Sprite.js',
  './js/classes/Fighter.js',
  './js/classes/AudioManager.js',
  './js/data/roster.js',
  './manifest.json',
  './icon-512.png',
  './img/quebo_500.png',
  './img/peja_500.png',
  './img/astek_500.png',
  './img/atutowy_500.png',
  './img/bambi_500.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
