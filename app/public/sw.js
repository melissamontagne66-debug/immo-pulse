// Service worker minimal — requis par Chrome pour proposer l'installation
// de la PWA (un gestionnaire fetch doit exister, même sans cache offline).
// Le push FCM utilise un service worker séparé (firebase-messaging-sw.js,
// scope distinct) — ne pas fusionner les deux.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
