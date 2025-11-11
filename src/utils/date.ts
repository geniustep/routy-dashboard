import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: string | Date, format: string = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(date).format(format)
}

export function formatTime(date: string | Date, format: string = 'HH:mm'): string {
  return dayjs(date).format(format)
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow()
}

export function isToday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isTomorrow(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
}

export function isYesterday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
}

export function getStartOfDay(date?: string | Date): string {
  return dayjs(date).startOf('day').toISOString()
}

export function getEndOfDay(date?: string | Date): string {
  return dayjs(date).endOf('day').toISOString()
}

export function addDays(date: string | Date, days: number): string {
  return dayjs(date).add(days, 'day').toISOString()
}

export function subtractDays(date: string | Date, days: number): string {
  return dayjs(date).subtract(days, 'day').toISOString()
}
