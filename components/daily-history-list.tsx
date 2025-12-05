import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatWeekday } from '@/lib/date-utils'

interface DailyHistoryEntry {
  date: string
  total: number
}

interface DailyHistoryListProps {
  history: DailyHistoryEntry[]
}

export function DailyHistoryList({ history }: DailyHistoryListProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data yet. Start logging your push-ups!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.date}
              className="flex justify-between items-center py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium">{formatWeekday(entry.date)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
              </div>
              <div className="text-lg font-bold">{entry.total}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
