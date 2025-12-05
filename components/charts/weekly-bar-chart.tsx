'use client'

import { ResponsiveBar } from '@nivo/bar'
import { useChartTheme, transformToBarData, type DailyData } from '@/lib/chart-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeeklyBarChartProps {
  data: DailyData[]
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const theme = useChartTheme()
  const chartData = transformToBarData(data)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Breakdown</CardTitle>
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
        <CardTitle>Weekly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveBar
            data={chartData}
            keys={['pushups']}
            indexBy="day"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={[theme.primaryColor]}
            borderRadius={6}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Day',
              legendPosition: 'middle',
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Push-ups',
              legendPosition: 'middle',
              legendOffset: -50,
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
                    fill: theme.textColor,
                  },
                },
                legend: {
                  text: {
                    fill: theme.textColor,
                  },
                },
              },
              grid: {
                line: {
                  stroke: theme.gridColor,
                  strokeWidth: 1,
                },
              },
              tooltip: {
                container: {
                  background: theme.tooltipBackground,
                  color: theme.tooltipColor,
                  fontSize: 12,
                },
              },
            }}
            tooltip={({ indexValue, value }) => (
              <div
                style={{
                  padding: '12px',
                  background: theme.tooltipBackground,
                  color: theme.tooltipColor,
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{indexValue}</strong>
                <br />
                <span>{value} push-ups</span>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
