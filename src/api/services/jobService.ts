import { odooClient } from '../odoo/client'
import type { Job } from '@/types/models/Job'

export const jobService = {
  async getAll(filters?: any): Promise<Job[]> {
    const domain = filters ? this.buildDomain(filters) : []
    return odooClient.search('routy.job', domain, [
      'name',
      'job_type',
      'service_request_id',
      'driver_id',
      'location_address',
      'location_lat',
      'location_lng',
      'state',
      'scheduled_time',
      'started_at',
      'completed_at',
      'notes',
    ])
  },

  async getById(id: number): Promise<Job> {
    const result = await odooClient.read('routy.job', [id])
    return result[0]
  },

  async getByDriver(driverId: number): Promise<Job[]> {
    return odooClient.search('routy.job', [['driver_id', '=', driverId]])
  },

  async accept(id: number): Promise<any> {
    return odooClient.call('routy.job', 'action_accept', [[id]])
  },

  async start(id: number): Promise<any> {
    return odooClient.call('routy.job', 'action_start', [[id]])
  },

  async complete(id: number, data?: any): Promise<any> {
    return odooClient.call('routy.job', 'action_complete', [[id]], data || {})
  },

  async fail(id: number, reason: string): Promise<any> {
    return odooClient.call('routy.job', 'action_fail', [[id]], { reason })
  },

  buildDomain(filters: any): any[] {
    const domain: any[] = []

    if (filters.state) {
      domain.push(['state', '=', filters.state])
    }
    if (filters.driver_id) {
      domain.push(['driver_id', '=', filters.driver_id])
    }
    if (filters.job_type) {
      domain.push(['job_type', '=', filters.job_type])
    }

    return domain
  },
}
