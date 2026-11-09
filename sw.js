const C="cryptochat-m2",F=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
/* Notifications push : affichées seulement si l'application n'est pas au premier plan */
self.addEventListener("push",e=>{
  let p={};try{p=e.data?e.data.json():{}}catch(x){}
  const d=p.data||p.notification||p;
  const title=d.title||"CryptoChat",body=d.body||"🔒 Nouveau message chiffré";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    if(cs.some(c=>c.visibilityState==="visible"))return;
    return self.registration.showNotification(title,{body,icon:"icon-192.png",badge:"icon-192.png",tag:d.cid||"cc",renotify:true,data:{cid:d.cid||""}});
  }));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();const cid=(e.notification.data||{}).cid||"";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    if(cs.length){cs[0].postMessage({cid});return cs[0].focus()}
    return self.clients.openWindow("./#c="+cid);
  }));
});
