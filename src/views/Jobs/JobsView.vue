<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Jobs</h1>
        <p class="text-gray-600">Manage driver jobs and assignments</p>
      </div>
      <a-space>
        <a-segmented v-model:value="viewMode" :options="['Kanban', 'List']" />
        <a-button @click="loadJobs">
          <template #icon><reload-outlined /></template>
        </a-button>
      </a-space>
    </div>

    <!-- Filters -->
    <a-card>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="8">
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search jobs..."
            @search="loadJobs"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="6">
          <a-select
            v-model:value="filters.job_type"
            placeholder="Job Type"
            style="width: 100%"
            @change="loadJobs"
            allow-clear
          >
            <a-select-option value="">All Types</a-select-option>
            <a-select-option value="pickup">Pickup</a-select-option>
            <a-select-option value="delivery">Delivery</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-input-number
            v-model:value="filters.driver_id"
            placeholder="Driver ID"
            style="width: 100%"
            @change="loadJobs"
            allow-clear
          />
        </a-col>
        <a-col :xs="24" :sm="2">
          <a-button @click="resetFilters" block>Reset</a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Kanban View -->
    <div v-if="viewMode === 'Kanban'" class="overflow-x-auto">
      <div class="flex gap-4 pb-4" style="min-width: 1200px">
        <div
          v-for="column in kanbanColumns"
          :key="column.key"
          class="flex-1 min-w-[280px]"
        >
          <a-card :title="column.title" size="small" :headStyle="{ backgroundColor: column.color }">
            <template #extra>
              <a-badge :count="getJobsByState(column.key).length" />
            </template>
            <div class="space-y-2 min-h-[400px]">
              <a-card
                v-for="job in getJobsByState(column.key)"
                :key="job.id"
                size="small"
                hoverable
                @click="viewJobDetails(job.id)"
                class="cursor-pointer"
              >
                <div class="space-y-2">
                  <div class="flex justify-between items-start">
                    <strong class="text-sm">{{ job.name }}</strong>
                    <a-tag :color="job.job_type === 'pickup' ? 'blue' : 'green'" size="small">
                      {{ job.job_type }}
                    </a-tag>
                  </div>
                  <div class="text-xs text-gray-600">
                    <user-outlined /> {{ job.driver_id ? job.driver_id[1] : 'Unassigned' }}
                  </div>
                  <div class="text-xs text-gray-600 truncate">
                    <environment-outlined /> {{ job.location_address }}
                  </div>
                  <div class="text-xs text-gray-500">
                    <clock-circle-outlined /> {{ formatDateTime(job.scheduled_time) }}
                  </div>
                </div>
              </a-card>
              <a-empty v-if="getJobsByState(column.key).length === 0" description="No jobs" :image="simpleImage" />
            </div>
          </a-card>
        </div>
      </div>
    </div>

    <!-- List View -->
    <a-card v-else>
      <a-table
        :columns="columns"
        :data-source="jobs"
        :loading="loading"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="viewJobDetails(record.id)" class="text-primary font-medium">
              {{ record.name }}
            </a>
          </template>
          <template v-if="column.key === 'job_type'">
            <a-tag :color="record.job_type === 'pickup' ? 'blue' : 'green'">
              {{ record.job_type }}
            </a-tag>
          </template>
          <template v-if="column.key === 'driver'">
            {{ record.driver_id ? record.driver_id[1] : 'Unassigned' }}
          </template>
          <template v-if="column.key === 'state'">
            <a-tag :color="getStatusColor(record.state)">
              {{ formatState(record.state) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'scheduled_time'">
            {{ formatDateTime(record.scheduled_time) }}
          </template>
          <template v-if="column.key === 'actions'">
            <a-button size="small" @click="viewJobDetails(record.id)">
              <template #icon><eye-outlined /></template>
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { formatDateTime } from '@/utils/date'
import { Empty } from 'ant-design-vue'
import {
  ReloadOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const jobsStore = useJobsStore()
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const viewMode = ref('Kanban')
const loading = computed(() => jobsStore.loading)
const jobs = computed(() => jobsStore.jobs || [])

const filters = reactive({
  search: '',
  job_type: '',
  driver_id: null,
})

const kanbanColumns = [
  { key: 'assigned', title: 'Assigned', color: '#f0f0f0' },
  { key: 'accepted', title: 'Accepted', color: '#e6f7ff' },
  { key: 'in_progress', title: 'In Progress', color: '#e6fffb' },
  { key: 'completed', title: 'Completed', color: '#f6ffed' },
  { key: 'failed', title: 'Failed', color: '#fff1f0' },
]

const columns = [
  { title: 'Job ID', dataIndex: 'name', key: 'name', width: 120 },
  { title: 'Type', key: 'job_type', width: 100 },
  { title: 'Driver', key: 'driver', width: 150 },
  { title: 'Location', dataIndex: 'location_address', key: 'location', ellipsis: true },
  { title: 'Status', key: 'state', width: 120 },
  { title: 'Scheduled', key: 'scheduled_time', width: 180 },
  { title: 'Actions', key: 'actions', width: 100, fixed: 'right' },
]

function getJobsByState(state: string) {
  return jobs.value.filter(job => job.state === state)
}

function getStatusColor(state: string) {
  const colors: Record<string, string> = {
    assigned: 'default',
    accepted: 'blue',
    in_progress: 'cyan',
    completed: 'green',
    failed: 'red',
    cancelled: 'orange',
  }
  return colors[state] || 'default'
}

function formatState(state: string) {
  return state.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function viewJobDetails(id: number) {
  router.push(`/jobs/${id}`)
}

function resetFilters() {
  filters.search = ''
  filters.job_type = ''
  filters.driver_id = null
  loadJobs()
}

async function loadJobs() {
  const filterParams: any = {}
  if (filters.job_type) filterParams.job_type = filters.job_type
  if (filters.driver_id) filterParams.driver_id = filters.driver_id
  await jobsStore.fetchAll(filterParams)
}

onMounted(() => {
  loadJobs()
})
</script>

<style scoped>
.kanban-column {
  min-height: 400px;
}
</style>
