'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            No internet connection detected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Some features may not be available while you're offline. Your data will sync automatically when you're back online.
          </p>

          <div className="space-y-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              asChild
              className="w-full"
              variant="outline"
            >
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Available Offline:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ View cached pages</li>
              <li>✓ Browse your history</li>
              <li>✗ Log new push-ups</li>
              <li>✗ View leaderboard updates</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
