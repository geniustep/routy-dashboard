import { odooClient } from '../odoo/client'

export interface GPSLog {
  id: number
  driver_id: [number, string]
  latitude: number
  longitude: number
  speed: number
  heading: number
  accuracy: number
  timestamp: string
}

export const trackingService = {
  async getLatestLocations(): Promise<GPSLog[]> {
    // Get latest GPS log for each driver
    return odooClient.call('routy.gps_log', 'get_latest_locations', [])
  },

  async getDriverLocation(driverId: number): Promise<GPSLog | null> {
    const logs = await odooClient.search('routy.gps_log', [['driver_id', '=', driverId]], [], 1, 0)
    return logs.length > 0 ? logs[0] : null
  },

  async getDriverHistory(driverId: number, dateFrom: string, dateTo: string): Promise<GPSLog[]> {
    return odooClient.search('routy.gps_log', [
      ['driver_id', '=', driverId],
      ['timestamp', '>=', dateFrom],
      ['timestamp', '<=', dateTo],
    ])
  },
}
