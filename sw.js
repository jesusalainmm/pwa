var CACHE_NAME = 'my_plc_cache_v1';
var urlsToCache = [
  './',
  './css/bootstrap.min.css',
  './css/one-page-wonder.css',
  './js/app.js',
  './img/01.jpg',
  './img/02.jpg',
  './img/03.jpg',
  'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900',
  'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css',
  'https://cdn.datatables.net/1.10.21/css/dataTables.bootstrap4.min.css',
  'https://cdn.datatables.net/responsive/2.2.5/css/responsive.bootstrap4.min.css',
  'https://code.jquery.com/jquery-3.5.1.js',
  'https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js',
  'https://cdn.datatables.net/1.10.21/js/dataTables.bootstrap4.min.js',
  'https://cdn.datatables.net/responsive/2.2.5/js/dataTables.responsive.min.js',
  'https://cdn.datatables.net/responsive/2.2.5/js/responsive.bootstrap4.min.js'
];


//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})