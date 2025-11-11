export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  // Moroccan phone number validation (e.g., +212 6XXXXXXXX)
  const phoneRegex = /^(\+212|0)[567]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export function isRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}

export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0
}

export function isNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && value >= 0
}

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}
