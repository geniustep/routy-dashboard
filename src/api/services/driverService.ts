import { odooClient } from '../odoo/client'
import type { Driver } from '@/types/models/Driver'

export const driverService = {
  async getAll(): Promise<Driver[]> {
    return odooClient.search('res.users', [['groups_id', 'in', []]/* Add driver group ID */], [
      'name',
      'login',
      'email',
      'phone',
      'image_1920',
    ])
  },

  async getById(id: number): Promise<Driver> {
    const result = await odooClient.read('res.users', [id])
    return result[0]
  },

  async getActive(): Promise<Driver[]> {
    // This would require custom API endpoint for online status
    return this.getAll()
  },

  async getPerformance(id: number, dateFrom?: string, dateTo?: string): Promise<any> {
    // This would require custom API endpoint for performance metrics
    return odooClient.call('res.users', 'get_driver_performance', [[id]], {
      date_from: dateFrom,
      date_to: dateTo,
    })
  },
}
