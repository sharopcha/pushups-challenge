/**
 * Format date utilities for the Push-Up Challenge app
 */

/**
 * Get the start of today in UTC
 */
export function getTodayStart(): Date {
  const now = new Date()
  now.setUTCHours(0, 0, 0, 0)
  return now
}

/**
 * Get the start of the current week (Monday) in UTC
 */
export function getWeekStart(): Date {
  const now = new Date()
  const dayOfWeek = now.getUTCDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust when day is Sunday
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

/**
 * Get date N days ago from today
 */
export function getDaysAgo(days: number): Date {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

/**
 * Format date to readable string (e.g., "Dec 5, 2025")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format date to short weekday (e.g., "Mon", "Tue")
 */
export function formatWeekday(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

/**
 * Get ISO string for a date (for Supabase queries)
 */
export function toISOString(date: Date): string {
  return date.toISOString()
}
