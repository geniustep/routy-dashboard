import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

type DateInput = string | number | Date

export function formatDate(date: DateInput, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: DateInput, format: string = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(date).format(format)
}

export function formatTime(date: DateInput, format: string = 'HH:mm'): string {
  return dayjs(date).format(format)
}

export function formatRelativeTime(date: DateInput): string {
  return dayjs(date).fromNow()
}

export function isToday(date: DateInput): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isTomorrow(date: DateInput): boolean {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
}

export function isYesterday(date: DateInput): boolean {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
}

export function getStartOfDay(date?: DateInput): string {
  return dayjs(date).startOf('day').toISOString()
}

export function getEndOfDay(date?: DateInput): string {
  return dayjs(date).endOf('day').toISOString()
}

export function addDays(date: DateInput, days: number): string {
  return dayjs(date).add(days, 'day').toISOString()
}

export function subtractDays(date: DateInput, days: number): string {
  return dayjs(date).subtract(days, 'day').toISOString()
}
