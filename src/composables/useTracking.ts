import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'

export interface VehicleLocation {
  driver_id: number
  lat: number
  lng: number
  speed: number
  heading: number
  timestamp: number
}

export function useTracking() {
  const socket = ref<Socket | null>(null)
  const vehicles = ref<Map<number, VehicleLocation>>(new Map())
  const isConnected = ref(false)

  function connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL

    socket.value = io(wsUrl, {
      auth: {
        token: localStorage.getItem('odoo_session'),
      },
      transports: ['websocket', 'polling'],
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('Connected to tracking server')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from tracking server')
    })

    socket.value.on('driver_location', (data: VehicleLocation) => {
      vehicles.value.set(data.driver_id, data)
    })

    socket.value.on('all_locations', (locations: VehicleLocation[]) => {
      locations.forEach((loc) => {
        vehicles.value.set(loc.driver_id, loc)
      })
    })

    socket.value.on('error', (error: any) => {
      console.error('WebSocket error:', error)
    })
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  function requestAllLocations() {
    if (socket.value && isConnected.value) {
      socket.value.emit('request_all_locations')
    }
  }

  onMounted(() => {
    connect()
    requestAllLocations()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    vehicles,
    isConnected,
    requestAllLocations,
    connect,
    disconnect,
  }
}
