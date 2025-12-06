'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddPushupFormProps {
  userId: string
}

export function AddPushupForm({ userId }: AddPushupFormProps) {
  const [count, setCount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const pushupCount = parseInt(count)
    if (isNaN(pushupCount) || pushupCount <= 0) {
      setError('Please enter a valid number greater than 0')
      setLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('pushup_entries')
        .insert({
          user_id: userId,
          count: pushupCount,
        })

      if (insertError) throw insertError

      // Only call edge function in production
      if (process.env.NODE_ENV === 'production') {
        const { error: fnError } = await supabase.functions.invoke('pushup-notify', {
          body: {
            userId,
            count: pushupCount
          }
        });

        if (fnError) throw fnError
      }

      // Reset form and refresh data
      setCount('')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Push-Ups</CardTitle>
        <CardDescription>Add your push-ups for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="count">Number of Push-Ups</Label>
            <Input
              id="count"
              type="number"
              min="1"
              placeholder="50"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add Push-Ups'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
