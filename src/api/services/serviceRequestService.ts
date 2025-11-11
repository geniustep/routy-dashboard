import { odooClient } from '../odoo/client'
import type { ServiceRequest } from '@/types/models/ServiceRequest'

export const serviceRequestService = {
  async getAll(filters?: any): Promise<ServiceRequest[]> {
    const domain = filters ? this.buildDomain(filters) : []
    const kwargs: any = {
      fields: [
        'name',
        'customer_id',
        'service_type',
        'pickup_address',
        'delivery_address',
        'state',
        'assigned_driver_id',
        'service_fee',
        'cod_amount',
        'scheduled_pickup_date',
        'create_date',
        'parcel_count',
      ]
    }

    if (filters?.limit) kwargs.limit = filters.limit
    if (filters?.offset) kwargs.offset = filters.offset

    return odooClient.search('routy.service_request', domain, kwargs.fields, kwargs.limit, kwargs.offset)
  },

  async getById(id: number): Promise<ServiceRequest> {
    const result = await odooClient.read('routy.service_request', [id])
    return result[0]
  },

  async create(data: Partial<ServiceRequest>): Promise<number> {
    return odooClient.create('routy.service_request', data)
  },

  async update(id: number, data: Partial<ServiceRequest>): Promise<boolean> {
    return odooClient.write('routy.service_request', [id], data)
  },

  async delete(id: number): Promise<boolean> {
    return odooClient.unlink('routy.service_request', [id])
  },

  async confirm(id: number): Promise<any> {
    return odooClient.call('routy.service_request', 'action_confirm', [[id]])
  },

  async cancel(id: number): Promise<any> {
    return odooClient.call('routy.service_request', 'action_cancel', [[id]])
  },

  buildDomain(filters: any): any[] {
    const domain: any[] = []

    if (filters.state) {
      domain.push(['state', '=', filters.state])
    }
    if (filters.customer_id) {
      domain.push(['customer_id', '=', filters.customer_id])
    }
    if (filters.date_from) {
      domain.push(['create_date', '>=', filters.date_from])
    }
    if (filters.date_to) {
      domain.push(['create_date', '<=', filters.date_to])
    }
    if (filters.search) {
      domain.push(['name', 'ilike', filters.search])
    }

    return domain
  },
}
