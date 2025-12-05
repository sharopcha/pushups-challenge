'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        // Don't show again for 7 days after dismissal
        return
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      
      // Only show on mobile
      if (window.innerWidth <= 768) {
        setShowPrompt(true)
      }
    }

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      localStorage.removeItem('pwa-install-dismissed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user's response
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <Sheet open={showPrompt} onOpenChange={setShowPrompt}>
      <SheetContent side="bottom" className="rounded-t-xl">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <SheetHeader className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-2xl">
              💪
            </div>
            <div>
              <SheetTitle>Install Push-Up Challenge</SheetTitle>
              <SheetDescription className="text-xs">
                Get the app on your home screen
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-muted-foreground">
            Install our app for a better experience:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Quick access from your home screen</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Works offline</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Native app-like experience</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleInstallClick}
            className="flex-1"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Not Now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
