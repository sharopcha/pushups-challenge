/**
 * Chart utility functions for Nivo charts
 */

import { useTheme } from 'next-themes'

/**
 * Get theme-aware colors for charts
 */
export function useChartTheme() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return {
    textColor: isDark ? '#e5e7eb' : '#374151',
    gridColor: isDark ? '#374151' : '#e5e7eb',
    tooltipBackground: isDark ? '#1f2937' : '#ffffff',
    tooltipColor: isDark ? '#f9fafb' : '#111827',
    primaryColor: isDark ? '#60a5fa' : '#3b82f6',
    secondaryColor: isDark ? '#a78bfa' : '#8b5cf6',
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Get color for leaderboard position
 */
export function getLeaderboardColor(index: number, isDark: boolean): string {
  if (index === 0) return isDark ? '#fbbf24' : '#f59e0b' // Gold
  if (index === 1) return isDark ? '#9ca3af' : '#6b7280' // Silver
  if (index === 2) return isDark ? '#d97706' : '#c2410c' // Bronze
  return isDark ? '#60a5fa' : '#3b82f6' // Default blue
}

/**
 * Transform daily history for line chart
 */
export interface DailyData {
  date: string
  total: number
}

export function transformToLineData(history: DailyData[]) {
  return [
    {
      id: 'push-ups',
      data: history
        .map(entry => ({
          x: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          y: entry.total,
        }))
        .reverse(), // Reverse to show oldest to newest
    },
  ]
}

/**
 * Transform daily history for bar chart
 */
export function transformToBarData(history: DailyData[]) {
  return history
    .map(entry => ({
      day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      pushups: entry.total,
      date: entry.date,
    }))
    .reverse() // Reverse to show oldest to newest
}

/**
 * Transform leaderboard for horizontal bar chart
 */
export interface LeaderboardEntry {
  user_id: string | null
  total_pushups: number | null
  profiles: { display_name: string } | null
}

export function transformToLeaderboardData(entries: LeaderboardEntry[], isDark: boolean) {
  return entries.map((entry, index) => ({
    name: entry.profiles?.display_name || 'Anonymous',
    pushups: entry.total_pushups || 0,
    color: getLeaderboardColor(index, isDark),
  }))
}
