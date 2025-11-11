import { defineStore } from 'pinia'
import { ref } from 'vue'
import { driverService } from '@/api/services/driverService'
import type { Driver } from '@/types/models/Driver'

export const useDriversStore = defineStore('drivers', () => {
  const drivers = ref<Driver[]>([])
  const currentDriver = ref<Driver | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null

    try {
      drivers.value = await driverService.getAll()
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
      currentDriver.value = await driverService.getById(id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchActive() {
    loading.value = true
    error.value = null

    try {
      drivers.value = await driverService.getActive()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    drivers,
    currentDriver,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchActive,
  }
})
