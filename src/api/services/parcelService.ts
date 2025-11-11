import { odooClient } from '../odoo/client'
import type { Parcel } from '@/types/models/Parcel'

export const parcelService = {
  async getAll(filters?: any): Promise<Parcel[]> {
    const domain = filters ? this.buildDomain(filters) : []
    return odooClient.search('routy.parcel', domain, [
      'name',
      'service_request_id',
      'description',
      'weight',
      'length',
      'width',
      'height',
      'declared_value',
      'state',
      'picked_at',
      'delivered_at',
      'current_job_id',
    ])
  },

  async getById(id: number): Promise<Parcel> {
    const result = await odooClient.read('routy.parcel', [id])
    return result[0]
  },

  async getByServiceRequest(serviceRequestId: number): Promise<Parcel[]> {
    return odooClient.search('routy.parcel', [['service_request_id', '=', serviceRequestId]])
  },

  async create(data: Partial<Parcel>): Promise<number> {
    return odooClient.create('routy.parcel', data)
  },

  async update(id: number, data: Partial<Parcel>): Promise<boolean> {
    return odooClient.write('routy.parcel', [id], data)
  },

  buildDomain(filters: any): any[] {
    const domain: any[] = []

    if (filters.state) {
      domain.push(['state', '=', filters.state])
    }
    if (filters.service_request_id) {
      domain.push(['service_request_id', '=', filters.service_request_id])
    }
    if (filters.search) {
      domain.push(['name', 'ilike', filters.search])
    }

    return domain
  },
}
