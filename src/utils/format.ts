export function formatCurrency(amount: number, currency: string = 'MAD'): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`
}

export function formatWeight(weight: number, unit: string = 'kg'): string {
  return `${formatNumber(weight, 2)} ${unit}`
}

export function formatDistance(distance: number, unit: string = 'km'): string {
  if (distance < 1) {
    return `${formatNumber(distance * 1000, 0)} m`
  }
  return `${formatNumber(distance, 2)} ${unit}`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function formatPhone(phone: string): string {
  // Format phone number (e.g., +212 6XX XX XX XX)
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('212')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`
  }
  return phone
}

export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function titleCase(text: string): string {
  return text.split(' ').map(capitalize).join(' ')
}
