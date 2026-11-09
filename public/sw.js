const CACHE_NAME = "nutrino-pwa-v1";
const APP_SHELL_URL = "/";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const url of [APP_SHELL_URL, OFFLINE_URL]) {
        try {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) await cache.put(url, response);
        } catch (error) {
          console.error(`Could not cache the PWA route ${url}.`, error);
        }
      }

      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith("nutrino-pwa-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok && requestUrl.pathname === APP_SHELL_URL) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(APP_SHELL_URL, response.clone());
          }
          return response;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const fallbackUrl = requestUrl.pathname === APP_SHELL_URL ? APP_SHELL_URL : OFFLINE_URL;
          return (await cache.match(fallbackUrl)) ?? Response.error();
        }
      })(),
    );
    return;
  }

  if (requestUrl.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      })(),
    );
  }
});
