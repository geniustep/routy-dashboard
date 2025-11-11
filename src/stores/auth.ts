import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { odooClient } from '@/api/odoo/client'
import type { OdooSession } from '@/api/odoo/client'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<OdooSession | null>(odooClient.getSession())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => session.value !== null)
  const currentUser = computed(() => {
    if (!session.value) return null
    return {
      id: session.value.uid,
      username: session.value.username,
    }
  })

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const db = import.meta.env.VITE_ODOO_DB
      session.value = await odooClient.authenticate(db, username, password)
      return true
    } catch (e: any) {
      error.value = e.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    odooClient.logout()
    session.value = null
  }

  return {
    session,
    loading,
    error,
    isAuthenticated,
    currentUser,
    login,
    logout,
  }
})
