import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Medal, Award } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/supabase/types'

interface LeaderboardListProps {
  entries: (LeaderboardEntry & { profiles: { display_name: string } | null })[]
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No entries yet this week. Be the first!</p>
        </CardContent>
      </Card>
    )
  }

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Award className="h-6 w-6 text-amber-700" />
      default:
        return null
    }
  }

  const getPositionStyles = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900'
      case 1:
        return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
      case 2:
        return 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const displayName = entry.profiles?.display_name || 'Anonymous'
            const isTopThree = index < 3

            return (
              <div
                key={entry.user_id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isTopThree ? getPositionStyles(index) : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">
                    {isTopThree ? (
                      getPositionIcon(index)
                    ) : (
                      <span className="text-muted-foreground font-semibold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <Avatar>
                    <AvatarFallback>
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{displayName}</p>
                    {isTopThree && (
                      <p className="text-xs text-muted-foreground">
                        {index === 0 ? '🏆 Champion' : index === 1 ? '🥈 Runner-up' : '🥉 Third place'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">{entry.total_pushups || 0}</p>
                  <p className="text-xs text-muted-foreground">push-ups</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
