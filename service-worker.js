const CACHE='big-papa-v6-send-to-kitchen';
const ASSETS=['./','index.html','styles.css','app.js','manifest.json','big-papa-logo.jpeg','icon-192.png','icon-512.png','margarita.jpg','pepperoni.jpg','pepperoni-crumble.jpg','pepper-honey.jpg','hot-honey.jpg','fully-loaded.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return; if(e.request.mode==='navigate'||['script','style'].includes(e.request.destination)){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return;}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
