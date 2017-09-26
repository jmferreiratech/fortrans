const version = 15;
const currentCacheName = 'v' + version;

const files = [
    "index.html",
    "app.js",
    "Content/Images/nacessivel2.gif",
    "Content/Images/acessivel.gif",
    "Content/Images/ajax-loader2.gif",
    "Content/Images/acessivel.ico",
    "Content/bootstrap.min.css",
    "Controllers/linHorariosCtrl.js",
    "fonts/glyphicons-halflings-regular.eot?",
    "fonts/glyphicons-halflings-regular.ttf",
    "fonts/glyphicons-halflings-regular.eot",
    "images/icon-32.png",
    "images/icon-512.png",
    "images/icon-192.png",
    "Scripts/angular.min.js",
    "Scripts/i18n/angular-locale_pt-br.js",
    "Scripts/angular-ui/ui-bootstrap-tpls.min.js",
    "Scripts/angular-ui/ui-bootstrap.min.js",
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
    event.respondWith(lazyFetch(event.request));
    prefetchNextDays(event.request);
});

function prefetchNextDays(request) {
    const url = new URL(request.url);
    if (!url.search.startsWith('?data='))
        return;
    dates().reduce(function (acc, dt) {
            return acc.then(function () {
                return lazyFetch(url.origin + url.pathname + '?data=' + dateToQueryValue(dt));
            });
        },
        Promise.resolve());
}

function lazyFetch(request) {
    return caches.match(request).then(function (response) {
        if (response !== undefined)
            return response;
        return fetch(request).then(function (response) {
            var responseClone = response.clone();
            caches.open(currentCacheName).then(function (cache) {
                cache.put(request, responseClone);
            });
            return response;
        });
    });
}

function dateToQueryValue(dt) {
    return dt.getFullYear() + pad(dt.getMonth() + 1, 2) + pad(dt.getDate(), 2);

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}

function dates() {
    const result = [];
    for (var i = 0; i < 10; i++) {
        const dt = new Date();
        dt.setDate(dt.getDate() + i);
        result.push(dt);
    }
    return result;
}
