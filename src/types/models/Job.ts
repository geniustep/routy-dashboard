export interface Job {
  id: number
  name: string
  job_type: 'pickup' | 'delivery'
  service_request_id: [number, string]
  driver_id: [number, string]

  location_address: string
  location_lat: number
  location_lng: number

  state: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'failed' | 'cancelled'

  scheduled_time: string
  started_at: string | false
  completed_at: string | false

  notes: string
  failure_reason: string
}
