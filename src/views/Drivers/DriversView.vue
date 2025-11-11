<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Drivers</h1>
        <p class="text-gray-600">Manage and monitor drivers</p>
      </div>
      <a-button @click="loadDrivers"><reload-outlined /> Refresh</a-button>
    </div>

    <!-- Stats -->
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card><a-statistic title="Total Drivers" :value="stats.total" /></a-card>
      </a-col>
      <a-col :span="6">
        <a-card><a-statistic title="Online" :value="stats.online" :value-style="{ color: '#52c41a' }" /></a-card>
      </a-col>
      <a-col :span="6">
        <a-card><a-statistic title="Busy" :value="stats.busy" :value-style="{ color: '#faad14' }" /></a-card>
      </a-col>
      <a-col :span="6">
        <a-card><a-statistic title="Offline" :value="stats.offline" :value-style="{ color: '#d9d9d9' }" /></a-card>
      </a-col>
    </a-row>

    <!-- Drivers Grid -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="driver in drivers" :key="driver.id">
        <a-card hoverable @click="viewDriver(driver.id)" class="cursor-pointer">
          <div class="text-center">
            <a-avatar :size="64" class="mb-3">
              <template #icon><user-outlined /></template>
            </a-avatar>
            <h3 class="font-semibold mb-1">{{ driver.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ driver.phone }}</p>
            <a-badge status="success" text="Online" />
            <a-divider class="my-3" />
            <a-space direction="vertical" style="width: 100%">
              <div class="flex justify-between text-xs">
                <span>Active Jobs:</span>
                <strong>{{ driver.active_job_count || 0 }}</strong>
              </div>
              <div class="flex justify-between text-xs">
                <span>Total Deliveries:</span>
                <strong>{{ driver.total_deliveries || 0 }}</strong>
              </div>
              <div class="flex justify-between text-xs">
                <span>Success Rate:</span>
                <strong class="text-green-600">{{ driver.success_rate || 0 }}%</strong>
              </div>
            </a-space>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDriversStore } from '@/stores/drivers'
import { ReloadOutlined, UserOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const driversStore = useDriversStore()
const drivers = computed(() => driversStore.drivers || [])

const stats = computed(() => ({
  total: drivers.value.length,
  online: drivers.value.filter(d => d.online_status === 'online').length,
  busy: drivers.value.filter(d => d.online_status === 'busy').length,
  offline: drivers.value.filter(d => d.online_status === 'offline').length,
}))

function viewDriver(id: number) {
  router.push(`/drivers/${id}`)
}

async function loadDrivers() {
  await driversStore.fetchAll()
}

onMounted(() => {
  loadDrivers()
})
</script>
