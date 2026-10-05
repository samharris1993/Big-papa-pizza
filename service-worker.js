const CACHE='big-papa-v3';
const ASSETS=["./", "index.html", "success.html", "styles.css", "app.js", "manifest.json", "big-papa-logo.jpeg", "icon-192.png", "icon-512.png", "margarita.jpg", "pepperoni.jpg", "pepperoni-crumble.jpg", "pepper-honey.jpg", "hot-honey.jpg", "fully-loaded.jpg"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.startsWith('/.netlify/functions/')) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
