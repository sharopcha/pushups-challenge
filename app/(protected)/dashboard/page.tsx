import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddPushupForm } from '@/components/add-pushup-form'
import { StatsCard } from '@/components/stats-card'
import { DailyHistoryList } from '@/components/daily-history-list'
import { SevenDayLineChart } from '@/components/charts/seven-day-line-chart'
import { WeeklyBarChart } from '@/components/charts/weekly-bar-chart'
import { Activity, Calendar, TrendingUp } from 'lucide-react'
import { getTodayStart, getWeekStart, getDaysAgo, toISOString } from '@/lib/date-utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Get today's total
  const todayStart = getTodayStart()
  const { data: todayEntries } = await supabase
    .from('pushup_entries')
    .select('count')
    .eq('user_id', user.id)
    .gte('performed_at', toISOString(todayStart))

  const todayTotal = todayEntries?.reduce((sum, entry) => sum + entry.count, 0) || 0

  // Get weekly total
  const weekStart = getWeekStart()
  const { data: weekEntries } = await supabase
    .from('pushup_entries')
    .select('count')
    .eq('user_id', user.id)
    .gte('performed_at', toISOString(weekStart))

  const weeklyTotal = weekEntries?.reduce((sum, entry) => sum + entry.count, 0) || 0

  // Get last 7 days history
  const sevenDaysAgo = getDaysAgo(6) // Including today = 7 days
  const { data: historyEntries } = await supabase
    .from('pushup_entries')
    .select('count, performed_at')
    .eq('user_id', user.id)
    .gte('performed_at', toISOString(sevenDaysAgo))
    .order('performed_at', { ascending: false })

  // Group by date
  const historyMap = new Map<string, number>()
  historyEntries?.forEach((entry) => {
    const date = new Date(entry.performed_at).toISOString().split('T')[0]
    historyMap.set(date, (historyMap.get(date) || 0) + entry.count)
  })

  const history = Array.from(historyMap.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="space-y-6">
        {/* Add Push-Up Form */}
        <AddPushupForm userId={user.id} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Today's Total"
            value={todayTotal}
            icon={Activity}
            description="Push-ups completed today"
          />
          <StatsCard
            title="Weekly Total"
            value={weeklyTotal}
            icon={TrendingUp}
            description="This week's progress"
          />
          <StatsCard
            title="Last 7 Days"
            value={history.length}
            icon={Calendar}
            description="Days with activity"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SevenDayLineChart data={history} />
          <WeeklyBarChart data={history} />
        </div>

        {/* Daily History */}
        <DailyHistoryList history={history} />
      </div>
    </div>
  )
}
