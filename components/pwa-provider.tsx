'use client'

import { useEffect, useState } from 'react'
import { PWAInstallPrompt } from './pwa-install-prompt'
import { IOSInstallPrompt } from './ios-install-prompt'

export function PWAProvider() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <>
      <PWAInstallPrompt />
      <IOSInstallPrompt />
    </>
  )
}
