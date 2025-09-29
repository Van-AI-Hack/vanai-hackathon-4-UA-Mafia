// Service Worker for Canadian Music DNA PWA
// Provides offline functionality and caching

const CACHE_NAME = 'canadian-music-dna-v1.0.0'
const STATIC_CACHE = 'static-v1.0.0'
const DYNAMIC_CACHE = 'dynamic-v1.0.0'

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/desktop-home.png',
  '/screenshots/mobile-quiz.png'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url)
          return cachedResponse
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response for caching
            const responseToCache = response.clone()
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache)
              })
            
            return response
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error)
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html')
            }
            
            // Return a custom offline response for other requests
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'This content is not available offline',
                url: request.url
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      handleBackgroundSync()
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received')
  
  const options = {
    body: event.data ? event.data.text() : 'New music insights available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Now',
        icon: '/icons/explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Canadian Music DNA', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?action=dashboard')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Handle background sync tasks
async function handleBackgroundSync() {
  try {
    // Get pending offline actions from IndexedDB
    const pendingActions = await getPendingActions()
    
    for (const action of pendingActions) {
      try {
        await processOfflineAction(action)
        await removePendingAction(action.id)
      } catch (error) {
        console.error('Service Worker: Failed to process offline action', error)
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Get pending actions from IndexedDB
async function getPendingActions() {
  // This would typically use IndexedDB to store offline actions
  // For now, return empty array
  return []
}

// Process offline action
async function processOfflineAction(action) {
  // Process the offline action (e.g., sync quiz results, upload data)
  console.log('Service Worker: Processing offline action', action)
}

// Remove processed action
async function removePendingAction(actionId) {
  // Remove the action from IndexedDB
  console.log('Service Worker: Removing processed action', actionId)
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(urlsToCache)
        })
    )
  }
})


