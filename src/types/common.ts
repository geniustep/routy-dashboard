export type OdooMany2One = [number, string] | false

export interface SelectOption {
  label: string
  value: string | number
}

export interface KPIData {
  title: string
  value: number | string
  prefix?: string
  suffix?: string
  trend?: number
  trendDirection?: 'up' | 'down'
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    [key: string]: any
  }[]
}

export interface MenuItem {
  key: string
  label: string
  icon?: any
  path?: string
  children?: MenuItem[]
}
