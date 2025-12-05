'use client'

import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from 'next-themes'
import { useChartTheme, transformToLeaderboardData, type LeaderboardEntry } from '@/lib/chart-utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface LeaderboardBarChartProps {
  entries: LeaderboardEntry[]
}

export function LeaderboardBarChart({ entries }: LeaderboardBarChartProps) {
  const { theme } = useTheme()
  const chartTheme = useChartTheme()
  const isDark = theme === 'dark'
  const chartData = transformToLeaderboardData(entries, isDark)

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Visual ranking of this week's leaders</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No entries yet this week. Be the first!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Visual ranking of this week's leaders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveBar
            data={chartData}
            keys={['pushups']}
            indexBy="name"
            layout="horizontal"
            margin={{ top: 20, right: 30, bottom: 50, left: 120 }}
            padding={0.2}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ data }) => data.color}
            borderRadius={6}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Push-ups',
              legendPosition: 'middle',
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: chartTheme.textColor,
                  },
                },
                legend: {
                  text: {
                    fill: chartTheme.textColor,
                  },
                },
              },
              grid: {
                line: {
                  stroke: chartTheme.gridColor,
                  strokeWidth: 1,
                },
              },
              tooltip: {
                container: {
                  background: chartTheme.tooltipBackground,
                  color: chartTheme.tooltipColor,
                  fontSize: 12,
                },
              },
            }}
            tooltip={({ indexValue, value, data }) => (
              <div
                style={{
                  padding: '12px',
                  background: chartTheme.tooltipBackground,
                  color: chartTheme.tooltipColor,
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{indexValue}</strong>
                <br />
                <span style={{ color: data.color }}>
                  {value} push-ups
                </span>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
