import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jobService } from '@/api/services/jobService'
import type { Job } from '@/types/models/Job'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([])
  const currentJob = ref<Job | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters?: any) {
    loading.value = true
    error.value = null

    try {
      jobs.value = await jobService.getAll(filters)
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
      currentJob.value = await jobService.getById(id)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchByDriver(driverId: number) {
    loading.value = true
    error.value = null

    try {
      jobs.value = await jobService.getByDriver(driverId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function accept(id: number) {
    try {
      await jobService.accept(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function start(id: number) {
    try {
      await jobService.start(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function complete(id: number, data?: any) {
    try {
      await jobService.complete(id, data)
      await fetchAll()
    } catch (e: any) {
      error.value = e.message
    }
  }

  return {
    jobs,
    currentJob,
    loading,
    error,
    fetchAll,
    fetchById,
    fetchByDriver,
    accept,
    start,
    complete,
  }
})
