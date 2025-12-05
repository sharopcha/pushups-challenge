'use client'

import { ResponsiveLine } from '@nivo/line'
import { useChartTheme, transformToLineData, type DailyData } from '@/lib/chart-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SevenDayLineChartProps {
  data: DailyData[]
}

export function SevenDayLineChart({ data }: SevenDayLineChartProps) {
  const theme = useChartTheme()
  const chartData = transformToLineData(data)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Progress</CardTitle>
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
        <CardTitle>7-Day Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 0,
              max: 'auto',
              stacked: false,
            }}
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendOffset: 45,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Push-ups',
              legendOffset: -50,
              legendPosition: 'middle',
            }}
            colors={[theme.primaryColor]}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.15}
            useMesh={true}
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
          />
        </div>
      </CardContent>
    </Card>
  )
}
