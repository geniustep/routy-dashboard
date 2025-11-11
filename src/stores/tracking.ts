import { defineStore } from 'pinia'
import { ref } from 'vue'
import { trackingService } from '@/api/services/trackingService'
import type { GPSLog } from '@/api/services/trackingService'

export const useTrackingStore = defineStore('tracking', () => {
  const locations = ref<Map<number, GPSLog>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLatestLocations() {
    loading.value = true
    error.value = null

    try {
      const logs = await trackingService.getLatestLocations()
      logs.forEach(log => {
        const driverId = Array.isArray(log.driver_id) ? log.driver_id[0] : log.driver_id
        locations.value.set(driverId, log)
      })
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchDriverLocation(driverId: number) {
    try {
      const log = await trackingService.getDriverLocation(driverId)
      if (log) {
        locations.value.set(driverId, log)
      }
    } catch (e: any) {
      error.value = e.message
    }
  }

  function updateLocation(driverId: number, location: GPSLog) {
    locations.value.set(driverId, location)
  }

  return {
    locations,
    loading,
    error,
    fetchLatestLocations,
    fetchDriverLocation,
    updateLocation,
  }
})
