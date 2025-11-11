<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Service Requests</h1>
        <p class="text-gray-600">Manage all service requests</p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon><plus-outlined /></template>
        New Request
      </a-button>
    </div>

    <!-- Filters -->
    <a-card>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search by ID or customer..."
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
            <a-select-option value="draft">Draft</a-select-option>
            <a-select-option value="confirmed">Confirmed</a-select-option>
            <a-select-option value="assigned">Assigned</a-select-option>
            <a-select-option value="in_progress">In Progress</a-select-option>
            <a-select-option value="delivered">Delivered</a-select-option>
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
          <a-button @click="resetFilters" block>Reset</a-button>
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
            {{ record.customer_id ? record.customer_id[1] : 'N/A' }}
          </template>

          <template v-if="column.key === 'service_type'">
            <a-tag>{{ record.service_type }}</a-tag>
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
              {{ formatState(record.state) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip title="View">
                <a-button size="small" @click="viewDetails(record.id)">
                  <template #icon><eye-outlined /></template>
                </a-button>
              </a-tooltip>

              <a-tooltip title="Confirm" v-if="record.state === 'draft'">
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
                      <eye-outlined /> View Details
                    </a-menu-item>
                    <a-menu-item
                      v-if="record.state !== 'cancelled' && record.state !== 'delivered'"
                      @click="cancelRequest(record.id)"
                      danger
                    >
                      <close-outlined /> Cancel
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
      title="Create Service Request"
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
            <a-form-item label="Service Type">
              <a-select v-model:value="newRequest.service_type">
                <a-select-option value="local">Local</a-select-option>
                <a-select-option value="express">Express</a-select-option>
                <a-select-option value="scheduled">Scheduled</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Customer ID">
              <a-input-number
                v-model:value="newRequest.customer_id"
                style="width: 100%"
                placeholder="Enter customer ID"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Pickup Address">
          <a-input v-model:value="newRequest.pickup_address" />
        </a-form-item>

        <a-form-item label="Pickup Phone">
          <a-input v-model:value="newRequest.pickup_phone" />
        </a-form-item>

        <a-form-item label="Delivery Address">
          <a-input v-model:value="newRequest.delivery_address" />
        </a-form-item>

        <a-form-item label="Delivery Phone">
          <a-input v-model:value="newRequest.delivery_phone" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Service Fee">
              <a-input-number
                v-model:value="newRequest.service_fee"
                style="width: 100%"
                :min="0"
                prefix="MAD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="COD Amount">
              <a-input-number
                v-model:value="newRequest.cod_amount"
                style="width: 100%"
                :min="0"
                prefix="MAD"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Notes">
          <a-textarea v-model:value="newRequest.notes" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useServiceRequests } from '@/composables/useServiceRequests'
import {
  PlusOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

const filters = reactive({
  search: '',
  state: '',
  dateRange: [],
})

const showCreateModal = ref(false)
const creating = ref(false)
const newRequest = reactive({
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

const columns = [
  { title: 'ID', dataIndex: 'name', key: 'name', width: 120 },
  { title: 'Customer', key: 'customer', width: 150 },
  { title: 'Service Type', key: 'service_type', width: 120 },
  { title: 'Pickup', key: 'pickup_address', ellipsis: true },
  { title: 'Delivery', key: 'delivery_address', ellipsis: true },
  { title: 'Driver', key: 'driver', width: 150 },
  { title: 'Status', key: 'state', width: 120 },
  { title: 'Actions', key: 'actions', width: 150, fixed: 'right' },
]

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
})

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

function formatState(state: string) {
  return state.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
  pagination.value = pag
}

function viewDetails(id: number) {
  router.push(`/service-requests/${id}`)
}

async function confirmRequest(id: number) {
  try {
    await confirmServiceRequest(id)
  } catch (error: any) {
    message.error(error.message || 'Failed to confirm request')
  }
}

async function cancelRequest(id: number) {
  try {
    await cancelServiceRequest(id)
  } catch (error: any) {
    message.error(error.message || 'Failed to cancel request')
  }
}

async function handleCreate() {
  if (!newRequest.customer_id || !newRequest.pickup_address || !newRequest.delivery_address) {
    message.error('Please fill in all required fields')
    return
  }

  creating.value = true
  try {
    await createServiceRequest(newRequest)
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
    message.error(error.message || 'Failed to create request')
  } finally {
    creating.value = false
  }
}
</script>
