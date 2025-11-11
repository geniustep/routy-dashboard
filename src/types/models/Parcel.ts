export interface Parcel {
  id: number
  name: string
  service_request_id: [number, string]

  description: string
  weight: number
  length: number
  width: number
  height: number
  declared_value: number

  state: 'pending' | 'picked' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned'

  picked_at: string | false
  delivered_at: string | false

  pod_signature: string | false
  pod_photo: string | false
  pod_notes: string
  recipient_name: string

  current_job_id: [number, string] | false
}

export interface ParcelFormData {
  service_request_id: number
  description: string
  weight: number
  length?: number
  width?: number
  height?: number
  declared_value?: number
}
