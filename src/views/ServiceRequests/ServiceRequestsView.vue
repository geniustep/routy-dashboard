<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">{{ t('serviceRequests.title') }}</h1>
        <p class="text-gray-600">{{ t('serviceRequests.subtitle') }}</p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon><plus-outlined /></template>
        {{ t('serviceRequests.newRequest') }}
      </a-button>
    </div>

    <!-- Filters -->
    <a-card>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="filters.search"
            :placeholder="t('serviceRequests.filters.searchPlaceholder')"
            @search="handleSearch"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="filters.state"
            :placeholder="t('serviceRequests.filters.statusPlaceholder')"
            style="width: 100%"
            @change="handleSearch"
            allow-clear
          >
            <a-select-option value="">{{ t('serviceRequests.filters.allStatuses') }}</a-select-option>
            <a-select-option value="draft">{{ t('common.statusLabels.draft') }}</a-select-option>
            <a-select-option value="confirmed">{{ t('common.statusLabels.confirmed') }}</a-select-option>
            <a-select-option value="assigned">{{ t('common.statusLabels.assigned') }}</a-select-option>
            <a-select-option value="in_progress">{{ t('common.statusLabels.in_progress') }}</a-select-option>
            <a-select-option value="delivered">{{ t('common.statusLabels.delivered') }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-range-picker
            v-model:value="filters.dateRange"
            style="width: 100%"
            @change="handleSearch"
          />
        </a-col>
        <a-col :xs="24" :sm="2">
          <a-button @click="resetFilters" block>{{ t('common.reset') }}</a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Table -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="serviceRequests || []"
        :loading="isLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="viewDetails(record.id)" class="text-primary font-medium">
              {{ record.name }}
            </a>
          </template>

          <template v-if="column.key === 'customer'">
            {{ record.customer_id ? record.customer_id[1] : t('common.notAvailable') }}
          </template>

          <template v-if="column.key === 'service_type'">
            <a-tag>
              {{ t(`serviceRequests.createModal.types.${record.service_type}`) || record.service_type }}
            </a-tag>
          </template>

          <template v-if="column.key === 'pickup_address'">
            <div class="truncate max-w-xs">{{ record.pickup_address }}</div>
          </template>

          <template v-if="column.key === 'delivery_address'">
            <div class="truncate max-w-xs">{{ record.delivery_address }}</div>
          </template>

          <template v-if="column.key === 'driver'">
            {{ record.assigned_driver_id ? record.assigned_driver_id[1] : '-' }}
          </template>

          <template v-if="column.key === 'state'">
            <a-tag :color="getStatusColor(record.state)">
              {{ t(`common.statusLabels.${record.state}`) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip :title="t('serviceRequests.actions.view')">
                <a-button size="small" @click="viewDetails(record.id)">
                  <template #icon><eye-outlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip :title="t('serviceRequests.actions.confirm')" v-if="record.state === 'draft'">
                <a-button size="small" type="primary" @click="confirmRequest(record.id)">
                  <template #icon><check-outlined /></template>
                </a-button>
              </a-tooltip>

              <a-dropdown>
                <a-button size="small">
                  <template #icon><more-outlined /></template>
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="viewDetails(record.id)">
                      <eye-outlined /> {{ t('serviceRequests.actions.viewDetails') }}
                    </a-menu-item>
                    <a-menu-item
                      v-if="record.state !== 'cancelled' && record.state !== 'delivered'"
                      @click="cancelRequest(record.id)"
                      danger
                    >
                      <close-outlined /> {{ t('serviceRequests.actions.cancel') }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create Modal -->
    <a-modal
      v-model:open="showCreateModal"
      :title="t('serviceRequests.createModal.title')"
      width="800px"
      @ok="handleCreate"
      :confirmLoading="creating"
    >
      <a-form
        :model="newRequest"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="t('serviceRequests.createModal.serviceType')">
              <a-select v-model:value="newRequest.service_type">
                <a-select-option value="local">{{ t('serviceRequests.createModal.types.local') }}</a-select-option>
                <a-select-option value="express">{{ t('serviceRequests.createModal.types.express') }}</a-select-option>
                <a-select-option value="scheduled">{{ t('serviceRequests.createModal.types.scheduled') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="t('serviceRequests.createModal.customerId')">
              <a-input-number
                v-model:value="newRequest.customer_id"
                style="width: 100%"
                :placeholder="t('serviceRequests.createModal.customerIdPlaceholder')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="t('serviceRequests.createModal.pickupAddress')">
          <a-input v-model:value="newRequest.pickup_address" />
        </a-form-item>

        <a-form-item :label="t('serviceRequests.createModal.pickupPhone')">
          <a-input v-model:value="newRequest.pickup_phone" />
        </a-form-item>

        <a-form-item :label="t('serviceRequests.createModal.deliveryAddress')">
          <a-input v-model:value="newRequest.delivery_address" />
        </a-form-item>

        <a-form-item :label="t('serviceRequests.createModal.deliveryPhone')">
          <a-input v-model:value="newRequest.delivery_phone" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="t('serviceRequests.createModal.serviceFee')">
              <a-input-number
                v-model:value="newRequest.service_fee"
                style="width: 100%"
                :min="0"
                :prefix="t('common.currencyMAD')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="t('serviceRequests.createModal.codAmount')">
              <a-input-number
                v-model:value="newRequest.cod_amount"
                style="width: 100%"
                :min="0"
                :prefix="t('common.currencyMAD')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="t('serviceRequests.createModal.notes')">
          <a-textarea v-model:value="newRequest.notes" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useServiceRequests } from '@/composables/useServiceRequests'
import type { ServiceRequestFormData } from '@/types/models/ServiceRequest'
import {
  PlusOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n()

const filters = reactive({
  search: '',
  state: '',
  dateRange: [],
})

const showCreateModal = ref(false)
const creating = ref(false)
const newRequest = reactive<ServiceRequestFormData>({
  service_type: 'local',
  customer_id: null,
  pickup_address: '',
  pickup_phone: '',
  delivery_address: '',
  delivery_phone: '',
  service_fee: 0,
  cod_amount: 0,
  notes: '',
})

const columns = computed(() => [
  { title: t('serviceRequests.columns.id'), dataIndex: 'name', key: 'name', width: 120 },
  { title: t('serviceRequests.columns.customer'), key: 'customer', width: 150 },
  { title: t('serviceRequests.columns.serviceType'), key: 'service_type', width: 120 },
  { title: t('serviceRequests.columns.pickup'), key: 'pickup_address', ellipsis: true },
  { title: t('serviceRequests.columns.delivery'), key: 'delivery_address', ellipsis: true },
  { title: t('serviceRequests.columns.driver'), key: 'driver', width: 150 },
  { title: t('serviceRequests.columns.status'), key: 'state', width: 120 },
  { title: t('serviceRequests.columns.actions'), key: 'actions', width: 150, fixed: 'right' },
])

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => t('common.itemsTotal', { count: total }),
})

watch(
  () => locale.value,
  () => {
    pagination.value = {
      ...pagination.value,
      showTotal: (total: number) => t('common.itemsTotal', { count: total }),
    }
  },
  { immediate: true }
)

const { serviceRequests, isLoading, confirmServiceRequest, cancelServiceRequest, createServiceRequest } =
  useServiceRequests(filters)

function getStatusColor(state: string) {
  const colors: Record<string, string> = {
    draft: 'default',
    confirmed: 'blue',
    assigned: 'orange',
    in_progress: 'cyan',
    delivered: 'green',
    cancelled: 'red',
  }
  return colors[state] || 'default'
}

function handleSearch() {
  // Filters are reactive, so the query will automatically refetch
}

function resetFilters() {
  filters.search = ''
  filters.state = ''
  filters.dateRange = []
}

function handleTableChange(pag: any) {
  pagination.value = {
    ...pagination.value,
    ...pag,
    showTotal: pagination.value.showTotal,
  }
}

function viewDetails(id: number) {
  router.push(`/service-requests/${id}`)
}

async function confirmRequest(id: number) {
  try {
    await confirmServiceRequest(id)
  } catch (error: any) {
    message.error(error.message || t('serviceRequests.messages.confirmError'))
  }
}

async function cancelRequest(id: number) {
  try {
    await cancelServiceRequest(id)
  } catch (error: any) {
    message.error(error.message || t('serviceRequests.messages.cancelError'))
  }
}

async function handleCreate() {
  if (!newRequest.customer_id || !newRequest.pickup_address || !newRequest.delivery_address) {
    message.error(t('common.validation.requiredFields'))
    return
  }

  creating.value = true
  try {
    await createServiceRequest({ ...newRequest })
    showCreateModal.value = false
    // Reset form
    Object.assign(newRequest, {
      service_type: 'local',
      customer_id: null,
      pickup_address: '',
      pickup_phone: '',
      delivery_address: '',
      delivery_phone: '',
      service_fee: 0,
      cod_amount: 0,
      notes: '',
    })
  } catch (error: any) {
    message.error(error.message || t('serviceRequests.messages.createError'))
  } finally {
    creating.value = false
  }
}
</script>
