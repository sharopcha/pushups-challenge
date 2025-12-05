'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Share2, X } from 'lucide-react'

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    
    if (!isIOS) return

    // Check if already installed (standalone mode on iOS)
    const isStandalone = (window.navigator as any).standalone === true
    if (isStandalone) return

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('ios-install-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 30) {
        // Don't show again for 30 days after dismissal
        return
      }
    }

    // Show prompt for iOS users
    setShowPrompt(true)
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('ios-install-dismissed', new Date().toISOString())
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden">
      <Alert className="relative pr-12 bg-card border-primary/20 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
            💪
          </div>
          <div className="flex-1">
            <AlertTitle className="text-sm font-semibold mb-1">
              Install Push-Up Challenge
            </AlertTitle>
            <AlertDescription className="text-xs space-y-2">
              <p>
                Install this app on your iPhone: tap{' '}
                <Share2 className="inline h-3 w-3 mx-1" />
                <span className="font-semibold">Share</span> then{' '}
                <span className="font-semibold">"Add to Home Screen"</span>
              </p>
            </AlertDescription>
          </div>
        </div>

        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-xs"
        >
          Got it
        </Button>
      </Alert>
    </div>
  )
}
