import { defineStore } from 'pinia'
import { ref } from 'vue'
import { serviceRequestService } from '@/api/services/serviceRequestService'
import type { ServiceRequest } from '@/types/models/ServiceRequest'

export const useServiceRequestsStore = defineStore('serviceRequests', () => {
  const requests = ref<ServiceRequest[]>([])
  const currentRequest = ref<ServiceRequest | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters?: any) {
    loading.value = true
    error.value = null

    try {
      requests.value = await serviceRequestService.getAll(filters)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number) {
    loading.value = true
    error.value = null

    try {
      currentRequest.value = await serviceRequestService.getById(id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(data: any) {
    loading.value = true
    error.value = null

    try {
      const id = await serviceRequestService.create(data)
      await fetchAll()
      return id
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: any) {
    loading.value = true
    error.value = null

    try {
      await serviceRequestService.update(id, data)
      await fetchAll()
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function confirm(id: number) {
    try {
      await serviceRequestService.confirm(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function cancel(id: number) {
    try {
      await serviceRequestService.cancel(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.message
    }
  }

  return {
    requests,
    currentRequest,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    confirm,
    cancel,
  }
})
