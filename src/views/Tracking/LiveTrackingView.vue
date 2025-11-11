<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Live Tracking</h1>
        <p class="text-gray-600">Real-time GPS tracking of active drivers</p>
      </div>
      <a-space>
        <a-badge :status="isConnected ? 'success' : 'error'" :text="isConnected ? 'Connected' : 'Disconnected'" />
        <a-button @click="requestAllLocations">
          <reload-outlined /> Refresh
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="16">
      <a-col :xs="24" :lg="18">
        <a-card :body-style="{ padding: 0, height: '600px', position: 'relative' }">
          <div id="map" style="height: 100%; width: 100%"></div>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="6">
        <a-card title="Active Vehicles" :body-style="{ maxHeight: '600px', overflowY: 'auto' }">
          <div class="space-y-2">
            <a-card
              v-for="[driverId, location] in vehicles"
              :key="driverId"
              size="small"
              hoverable
              @click="focusVehicle(location)"
              class="cursor-pointer"
            >
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <strong class="text-sm">Driver {{ driverId }}</strong>
                  <a-badge status="success" />
                </div>
                <div class="text-xs text-gray-600">
                  <dashboard-outlined /> {{ location.speed }} km/h
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatRelativeTime(location.timestamp) }}
                </div>
              </div>
            </a-card>
            <a-empty
              v-if="vehicles.size === 0"
              description="No active vehicles"
              :image="simpleImage"
            />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTracking } from '@/composables/useTracking'
import { formatRelativeTime } from '@/utils/date'
import { ReloadOutlined, DashboardOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const { vehicles, isConnected, requestAllLocations } = useTracking()

let map: L.Map | null = null
const markers = new Map<number, L.Marker>()

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

function initMap() {
  // Initialize Leaflet map
  map = L.map('map').setView([33.5731, -7.5898], 12)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  // Watch for vehicle updates
  setInterval(() => {
    updateVehicleMarkers()
  }, 2000)
}

function updateVehicleMarkers() {
  if (!map) return

  vehicles.value.forEach((location, driverId) => {
    const latlng: L.LatLngExpression = [location.lat, location.lng]

    if (markers.has(driverId)) {
      // Update existing marker
      const marker = markers.get(driverId)!
      marker.setLatLng(latlng)
    } else {
      // Create new marker
      const icon = L.divIcon({
        html: `<div style="background: #52c41a; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'vehicle-marker',
        iconSize: [20, 20],
      })

      const marker = L.marker(latlng, { icon })
        .addTo(map!)
        .bindPopup(`
          <div>
            <strong>Driver ${driverId}</strong><br/>
            Speed: ${location.speed} km/h<br/>
            Heading: ${location.heading}°<br/>
            Updated: ${formatRelativeTime(location.timestamp)}
          </div>
        `)

      markers.set(driverId, marker)
    }
  })

  // Remove markers for drivers that are no longer active
  markers.forEach((marker, driverId) => {
    if (!vehicles.value.has(driverId)) {
      map!.removeLayer(marker)
      markers.delete(driverId)
    }
  })

  // Fit bounds to show all markers
  if (markers.size > 0) {
    const bounds = L.latLngBounds([...markers.values()].map(m => m.getLatLng()))
    map!.fitBounds(bounds, { padding: [50, 50] })
  }
}

function focusVehicle(location: any) {
  if (!map) return
  map.setView([location.lat, location.lng], 15)

  const marker = markers.get(location.driver_id)
  if (marker) {
    marker.openPopup()
  }
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';

.vehicle-marker {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
