if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(function (reg) {

            if (reg.installing) {
                console.log('Service worker installing');
            } else if (reg.waiting) {
                console.log('Service worker installed');
                clearPastDays();
            } else if (reg.active) {
                console.log('Service worker active');
                clearPastDays();
            }

        }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}

function clearPastDays() {
    return caches.keys().then(function (keylist) {
        return keylist.map(function (key) {
            return caches.open(key);
        });
    }).then(function (cacheList) {
        return cacheList.map(clearPastDaysFromCache);
    });

    function clearPastDaysFromCache(cachePromise) {
        return cachePromise.then(function (cache) {
            return cache.keys().then(function (keyList) {
                const regexp = /\?data=(\d{8})/;
                const today = parseInt(dateToQueryValue(new Date()));
                keyList.forEach(function (key) {
                    const match = regexp.exec(key.url);
                    if (match && parseInt(match[1]) < today)
                        cache.delete(key);
                });
            });
        });
    }
}

function dateToQueryValue(dt) {
    return dt.getFullYear() + pad(dt.getMonth() + 1, 2) + pad(dt.getDate(), 2);

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
