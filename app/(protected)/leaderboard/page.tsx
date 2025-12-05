import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LeaderboardList } from '@/components/leaderboard-list'

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Fetch leaderboard
  const { data: leaderboard } = await supabase
    .from('weekly_leaderboard_current')
    .select(`
      week_start,
      user_id,
      total_pushups,
      profiles!inner(display_name)
    `)
    .order('total_pushups', { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performers this week
        </p>
      </div>

      <LeaderboardList entries={leaderboard || []} />
    </div>
  )
}
