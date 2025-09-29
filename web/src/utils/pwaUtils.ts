// PWA Utilities for Canadian Music DNA platform
// Handles service worker registration and PWA features

export interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null
  private isInstalled = false
  private isOnline = navigator.onLine

  constructor() {
    this.setupEventListeners()
    this.registerServiceWorker()
  }

  private setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available')
      e.preventDefault()
      this.deferredPrompt = e as PWAInstallPrompt
    })

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully')
      this.isInstalled = true
      this.deferredPrompt = null
    })

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('PWA: App is online')
      this.isOnline = true
    })

    window.addEventListener('offline', () => {
      console.log('PWA: App is offline')
      this.isOnline = false
    })

    // Listen for service worker updates
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      console.log('PWA: Service worker updated')
      window.location.reload()
    })
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        console.log('PWA: Service worker registered successfully', registration)
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('PWA: New content available, please refresh')
                this.showUpdateNotification()
              }
            })
          }
        })
        
      } catch (error) {
        console.error('PWA: Service worker registration failed', error)
      }
    } else {
      console.log('PWA: Service worker not supported')
    }
  }

  private showUpdateNotification() {
    // Show a notification to the user about the update
    if (confirm('A new version of Canadian Music DNA is available. Would you like to refresh to get the latest features?')) {
      window.location.reload()
    }
  }

  // Check if PWA can be installed
  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled
  }

  // Show install prompt
  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false
    }

    try {
      await this.deferredPrompt.prompt()
      const choiceResult = await this.deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted install prompt')
        return true
      } else {
        console.log('PWA: User dismissed install prompt')
        return false
      }
    } catch (error) {
      console.error('PWA: Install prompt failed', error)
      return false
    }
  }

  // Check if app is installed
  isAppInstalled(): boolean {
    return this.isInstalled || window.matchMedia('(display-mode: standalone)').matches
  }

  // Check if app is online
  isAppOnline(): boolean {
    return this.isOnline
  }

  // Get PWA status
  getStatus() {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isAppInstalled(),
      isOnline: this.isAppOnline(),
      hasServiceWorker: 'serviceWorker' in navigator
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('PWA: Notifications not supported')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  // Show notification
  async showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker?.ready
      if (registration) {
        registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options
        })
      }
    }
  }

  // Cache URLs for offline use
  async cacheUrls(urls: string[]) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls
      })
    }
  }

  // Clear all caches
  async clearCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('PWA: All caches cleared')
    }
  }
}

// Create singleton instance
const pwaManager = new PWAManager()

export default pwaManager

// Export utility functions
export const isPWAInstalled = () => pwaManager.isAppInstalled()
export const canInstallPWA = () => pwaManager.canInstall()
export const installPWA = () => pwaManager.install()
export const getPWAStatus = () => pwaManager.getStatus()
export const requestNotificationPermission = () => pwaManager.requestNotificationPermission()
export const showNotification = (title: string, options?: NotificationOptions) => pwaManager.showNotification(title, options)
export const cacheUrls = (urls: string[]) => pwaManager.cacheUrls(urls)
export const clearCaches = () => pwaManager.clearCaches()
