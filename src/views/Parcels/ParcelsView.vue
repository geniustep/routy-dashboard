<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">{{ t('parcels.title') }}</h1>
        <p class="text-gray-600">{{ t('parcels.subtitle') }}</p>
      </div>
      <a-space>
        <a-button @click="handleRefresh">
          <template #icon><reload-outlined /></template>
          {{ t('common.refresh') }}
        </a-button>
      </a-space>
    </div>

    <!-- Filters -->
    <a-card>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="filters.search"
            :placeholder="t('parcels.filters.searchPlaceholder')"
            @search="handleSearch"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="filters.state"
            :placeholder="t('common.status')"
            style="width: 100%"
            @change="handleSearch"
            allow-clear
          >
            <a-select-option value="">{{ t('parcels.filters.allStatuses') }}</a-select-option>
            <a-select-option value="pending">{{ t('common.statusLabels.pending') }}</a-select-option>
            <a-select-option value="picked">{{ t('common.statusLabels.picked') }}</a-select-option>
            <a-select-option value="in_transit">{{ t('common.statusLabels.in_transit') }}</a-select-option>
            <a-select-option value="out_for_delivery">{{ t('common.statusLabels.out_for_delivery') }}</a-select-option>
            <a-select-option value="delivered">{{ t('common.statusLabels.delivered') }}</a-select-option>
            <a-select-option value="failed">{{ t('common.statusLabels.failed') }}</a-select-option>
            <a-select-option value="returned">{{ t('common.statusLabels.returned') }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-input
            v-model:value="filters.service_request_id"
            :placeholder="t('parcels.filters.requestPlaceholder')"
            @change="handleSearch"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="2">
          <a-button @click="resetFilters" block>{{ t('common.reset') }}</a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Stats Cards -->
    <a-row :gutter="16">
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            :title="t('parcels.stats.total')"
            :value="stats.total"
            :prefix="h(InboxOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            :title="t('parcels.stats.inTransit')"
            :value="stats.inTransit"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            :title="t('parcels.stats.delivered')"
            :value="stats.delivered"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card size="small">
          <a-statistic
            :title="t('parcels.stats.failed')"
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
              {{ record.service_request_id ? record.service_request_id[1] : t('common.notAvailable') }}
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
                {{ t('parcels.timeline.picked') }}: {{ formatDateTime(record.picked_at) }}
              </div>
              <div v-if="record.delivered_at">
                {{ t('parcels.timeline.delivered') }}: {{ formatDateTime(record.delivered_at) }}
              </div>
            </div>
          </template>

          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip :title="t('common.viewDetails')">
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
                      <eye-outlined /> {{ t('parcels.actions.viewDetails') }}
                    </a-menu-item>
                    <a-menu-item @click="printLabel(record.id)">
                      <printer-outlined /> {{ t('parcels.actions.printLabel') }}
                    </a-menu-item>
                    <a-menu-item @click="trackParcel(record.id)">
                      <environment-outlined /> {{ t('parcels.actions.track') }}
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
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

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
  { title: t('parcels.columns.id'), dataIndex: 'name', key: 'name', width: 120, fixed: 'left' },
  { title: t('parcels.columns.serviceRequest'), key: 'service_request', width: 150 },
  { title: t('parcels.columns.description'), key: 'description', width: 200 },
  { title: t('parcels.columns.weight'), key: 'weight', width: 100 },
  { title: t('parcels.columns.dimensions'), key: 'dimensions', width: 150 },
  { title: t('parcels.columns.value'), key: 'value', width: 120 },
  { title: t('parcels.columns.status'), key: 'state', width: 140 },
  { title: t('parcels.columns.timeline'), key: 'timeline', width: 180 },
  { title: t('parcels.columns.actions'), key: 'actions', width: 120, fixed: 'right' },
]

const pagination = ref({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => t('common.parcelsTotal', { count: total }),
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
  return t(`common.statusLabels.${state}` as any) || state.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
  message.info(t('parcels.messages.printComingSoon', { id }))
}

function trackParcel(id: number) {
  router.push(`/tracking?parcel=${id}`)
}

async function handleRefresh() {
  await loadParcels()
  message.success(t('parcels.messages.refreshSuccess'))
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
