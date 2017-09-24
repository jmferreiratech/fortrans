const version = 4;
const currentCacheName = 'v' + version;

const files = [
    "/",
    "index.html",
    "app.js",
    "Content/",
    "Content/Images",
    "Content/Images/nacessivel2.gif",
    "Content/Images/acessivel.gif",
    "Content/Images/ajax-loader2.gif",
    "Content/Images/acessivel.ico",
    "Content/bootstrap.min.css",
    "Controllers/",
    "Controllers/linHorariosCtrl.js",
    "fonts/",
    "fonts/glyphicons-halflings-regular.eot?",
    "fonts/glyphicons-halflings-regular.ttf",
    "fonts/glyphicons-halflings-regular.eot",
    "images/",
    "images/icon-32.png",
    "images/icon-512.png",
    "images/icon-192.png",
    "Scripts/",
    "Scripts/angular.min.js",
    "Scripts/i18n/",
    "Scripts/i18n/angular-locale_pt-br.js",
    "Scripts/angular-ui",
    "Scripts/angular-ui/ui-bootstrap-tpls.min.js",
    "Scripts/angular-ui/ui-bootstrap.min.js",
    "Scripts/utilitarios/",
    "Scripts/utilitarios/utilitarios.js",
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(currentCacheName).then(function (cache) {
            return cache.addAll(files);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (currentCacheName !== key)
                    return caches.delete(key);
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response !== undefined)
            return response;
        return fetch(event.request).then(function (response) {
            var responseClone = response.clone();
            caches.open(currentCacheName).then(function (cache) {
                cache.put(event.request, responseClone);
            });
            return response;
        });
    }));
});
