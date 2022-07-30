var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event) {
    //console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function(cache) {
                //console.log('[Service Worker] Precaching App Shell');
                cache.addAll([
                    '/', // internet olmasa bile bu sayfayı cache ettiriyoruz. Sayfa daha önceden ziyaret edilmese bile bu sayfa cache edilir.
                 ]);
            })
    )
});

self.addEventListener('activate', function(event) {
    //console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        //console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then(function(res) {
                            // Dynamic cache eklenir. Dynamic cache sadece daha önceden ziyaret edilen sayfaları cache eder. Dynamic cache aynı zamanda google fonts vs gibi sayfaları da cache eder. Statik cache de anasayfayı cache et demek o sayfaya dışarıdan eklenen google fonts vs gibi sayfaları cache etmez !
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function(cache) {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                        .catch(function(err) {
                            //console.error(err);
                        });
                }
            })
    );
});