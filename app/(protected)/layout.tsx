'use client'
import { ReactNode, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { MobileTabs } from '@/components/mobile-tabs'
import { useRegisterPushSubscription } from '@/lib/hooks/user-register-subscriptions'


export default function ProtectedLayout({ children }: { children: ReactNode }) {

  useRegisterPushSubscription()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-8">
        {children}
      </main>
      <MobileTabs />
    </div>
  )
}
