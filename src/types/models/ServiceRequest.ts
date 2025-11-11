export interface ServiceRequest {
  id: number
  name: string
  customer_id: [number, string] | null | false
  service_type: 'local' | 'express' | 'scheduled'

  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  pickup_contact: string
  pickup_phone: string

  delivery_address: string
  delivery_lat: number
  delivery_lng: number
  delivery_contact: string
  delivery_phone: string

  parcel_ids: number[]
  parcel_count: number

  service_fee: number
  cod_amount: number
  currency_id: [number, string]

  state: 'draft' | 'confirmed' | 'assigned' | 'in_progress' | 'delivered' | 'cancelled'
  assigned_driver_id: [number, string] | false

  scheduled_pickup_date: string
  scheduled_delivery_date: string

  notes: string
  create_date: string
  write_date: string
}

export interface ServiceRequestFormData {
  customer_id: number | null
  service_type: string
  pickup_address: string
  pickup_phone: string
  delivery_address: string
  delivery_phone: string
  service_fee?: number
  cod_amount?: number
  notes?: string
}
