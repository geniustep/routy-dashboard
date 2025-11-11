<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Parcels</h1>
        <p class="text-gray-600">Track and manage all parcels</p>
      </div>
      <a-space>
        <a-button @click="handleRefresh">
          <template #icon><reload-outlined /></template>
          Refresh
        </a-button>
      </a-space>
    </div>

    <!-- Filters -->
    <a-card>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search by parcel ID..."
            @search="handleSearch"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="filters.state"
            placeholder="Status"
            style="width: 100%"
            @change="handleSearch"
            allow-clear
          >
            <a-select-option value="">All Statuses</a-select-option>
            <a-select-option value="pending">Pending</a-select-option>
            <a-select-option value="picked">Picked</a-select-option>
            <a-select-option value="in_transit">In Transit</a-select-option>
            <a-select-option value="out_for_delivery">Out for Delivery</a-select-option>
            <a-select-option value="delivered">Delivered</a-select-option>
            <a-select-option value="failed">Failed</a-select-option>
            <a-select-option value="returned">Returned</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-input
            v-model:value="filters.service_request_id"
            placeholder="Service Request ID"
            @change="handleSearch"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="2">
          <a-button @click="resetFilters" block>Reset</a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Stats Cards -->
    <a-row :gutter="16">
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            title="Total"
            :value="stats.total"
            :prefix="h(InboxOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            title="In Transit"
            :value="stats.inTransit"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            title="Delivered"
            :value="stats.delivered"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            title="Failed"
            :value="stats.failed"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Table -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="parcels"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: 1400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="viewDetails(record.id)" class="text-primary font-medium">
              {{ record.name }}
            </a>
          </template>

          <template v-if="column.key === 'service_request'">
            <a @click="viewServiceRequest(record.service_request_id[0])" class="text-blue-600">
              {{ record.service_request_id ? record.service_request_id[1] : 'N/A' }}
            </a>
          </template>

          <template v-if="column.key === 'description'">
            <div class="truncate max-w-xs">{{ record.description || '-' }}</div>
          </template>

          <template v-if="column.key === 'weight'">
            {{ formatWeight(record.weight) }}
          </template>

          <template v-if="column.key === 'dimensions'">
            <span v-if="record.length && record.width && record.height">
              {{ record.length }} × {{ record.width }} × {{ record.height }} cm
            </span>
            <span v-else>-</span>
          </template>

          <template v-if="column.key === 'value'">
            {{ formatCurrency(record.declared_value) }}
          </template>

          <template v-if="column.key === 'state'">
            <a-tag :color="getStatusColor(record.state)">
              {{ formatState(record.state) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'timeline'">
            <div class="text-xs">
              <div v-if="record.picked_at">
                Picked: {{ formatDateTime(record.picked_at) }}
              </div>
              <div v-if="record.delivered_at">
                Delivered: {{ formatDateTime(record.delivered_at) }}
              </div>
            </div>
          </template>

          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip title="View Details">
                <a-button size="small" @click="viewDetails(record.id)">
                  <template #icon><eye-outlined /></template>
                </a-button>
              </a-tooltip>

              <a-dropdown>
                <a-button size="small">
                  <template #icon><more-outlined /></template>
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="viewDetails(record.id)">
                      <eye-outlined /> View Details
                    </a-menu-item>
                    <a-menu-item @click="printLabel(record.id)">
                      <printer-outlined /> Print Label
                    </a-menu-item>
                    <a-menu-item @click="trackParcel(record.id)">
                      <environment-outlined /> Track
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useParcelsStore } from '@/stores/parcels'
import { formatDateTime } from '@/utils/date'
import { formatCurrency, formatWeight } from '@/utils/format'
import {
  InboxOutlined,
  EyeOutlined,
  MoreOutlined,
  PrinterOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const parcelsStore = useParcelsStore()

const loading = computed(() => parcelsStore.loading)
const parcels = computed(() => parcelsStore.parcels)

const filters = reactive({
  search: '',
  state: '',
  service_request_id: '',
})

const stats = computed(() => {
  const allParcels = parcels.value || []
  return {
    total: allParcels.length,
    inTransit: allParcels.filter(p => ['in_transit', 'out_for_delivery'].includes(p.state)).length,
    delivered: allParcels.filter(p => p.state === 'delivered').length,
    failed: allParcels.filter(p => p.state === 'failed').length,
  }
})

const columns = [
  { title: 'Parcel ID', dataIndex: 'name', key: 'name', width: 120, fixed: 'left' },
  { title: 'Service Request', key: 'service_request', width: 150 },
  { title: 'Description', key: 'description', width: 200 },
  { title: 'Weight', key: 'weight', width: 100 },
  { title: 'Dimensions', key: 'dimensions', width: 150 },
  { title: 'Value', key: 'value', width: 120 },
  { title: 'Status', key: 'state', width: 140 },
  { title: 'Timeline', key: 'timeline', width: 180 },
  { title: 'Actions', key: 'actions', width: 120, fixed: 'right' },
]

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} parcels`,
})

function getStatusColor(state: string) {
  const colors: Record<string, string> = {
    pending: 'default',
    picked: 'blue',
    in_transit: 'cyan',
    out_for_delivery: 'orange',
    delivered: 'green',
    failed: 'red',
    returned: 'purple',
  }
  return colors[state] || 'default'
}

function formatState(state: string) {
  return state.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function handleSearch() {
  loadParcels()
}

function resetFilters() {
  filters.search = ''
  filters.state = ''
  filters.service_request_id = ''
  loadParcels()
}

function handleTableChange(pag: any) {
  pagination.value = pag
}

function viewDetails(id: number) {
  router.push(`/parcels/${id}`)
}

function viewServiceRequest(id: number) {
  router.push(`/service-requests/${id}`)
}

function printLabel(id: number) {
  message.info('Print label functionality - Coming soon')
}

function trackParcel(id: number) {
  router.push(`/tracking?parcel=${id}`)
}

async function handleRefresh() {
  await loadParcels()
  message.success('Parcels refreshed')
}

async function loadParcels() {
  const filterParams: any = {}
  if (filters.search) filterParams.search = filters.search
  if (filters.state) filterParams.state = filters.state
  if (filters.service_request_id) filterParams.service_request_id = parseInt(filters.service_request_id)

  await parcelsStore.fetchAll(filterParams)
}

onMounted(() => {
  loadParcels()
})
</script>
