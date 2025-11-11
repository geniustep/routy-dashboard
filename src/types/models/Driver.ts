export interface Driver {
  id: number
  name: string
  login: string
  email: string
  phone: string
  image_1920: string | false

  active_job_count?: number
  total_deliveries?: number
  success_rate?: number
  average_rating?: number

  online_status?: 'online' | 'offline' | 'busy'
  current_location?: {
    lat: number
    lng: number
  }
}
