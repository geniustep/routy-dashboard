import { defineStore } from 'pinia'
import { ref } from 'vue'
import { parcelService } from '@/api/services/parcelService'
import type { Parcel } from '@/types/models/Parcel'

export const useParcelsStore = defineStore('parcels', () => {
  const parcels = ref<Parcel[]>([])
  const currentParcel = ref<Parcel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters?: any) {
    loading.value = true
    error.value = null

    try {
      parcels.value = await parcelService.getAll(filters)
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
      currentParcel.value = await parcelService.getById(id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchByServiceRequest(serviceRequestId: number) {
    loading.value = true
    error.value = null

    try {
      parcels.value = await parcelService.getByServiceRequest(serviceRequestId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    parcels,
    currentParcel,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchByServiceRequest,
  }
})
