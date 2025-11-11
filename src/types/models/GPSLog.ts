export interface GPSLog {
  id: number
  driver_id: [number, string]
  latitude: number
  longitude: number
  speed: number
  heading: number
  accuracy: number
  timestamp: string
  altitude: number
  battery_level: number
}
