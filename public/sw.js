// Self-unregistering service worker.
//
// A previous cache-first service worker (constant cache name) served stale
// index.html + hashed JS chunks after every deploy, causing "Importing a module
// script failed" (dead chunk 404s). This replacement clears ALL caches, removes
// itself, and reloads controlled tabs so clients always load fresh from network.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete every cache this origin created.
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      // Unregister this service worker.
      await self.registration.unregister();
    })()
  );
});
