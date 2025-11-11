export interface Hub {
  id: number
  name: string
  code: string
  address: string
  latitude: number
  longitude: number
  is_active: boolean
  capacity: number
  manager_id: [number, string] | false
  phone: string
  email: string
}
