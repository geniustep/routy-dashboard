<template>
  <div class="space-y-4">
    <a-page-header
      :title="`Parcel: ${parcel?.name || 'Loading...'}`"
      @back="() => $router.back()"
    >
      <template #extra>
        <a-space>
          <a-button @click="handlePrint">
            <printer-outlined /> Print Label
          </a-button>
          <a-button type="primary" @click="handleTrack">
            <environment-outlined /> Track
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-row :gutter="16" v-if="parcel">
        <!-- Main Details -->
        <a-col :xs="24" :lg="16">
          <a-card title="Parcel Details" class="mb-4">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="Parcel ID" :span="2">
                <strong>{{ parcel.name }}</strong>
              </a-descriptions-item>
              <a-descriptions-item label="Status" :span="2">
                <a-tag :color="getStatusColor(parcel.state)" style="font-size: 14px;">
                  {{ formatState(parcel.state) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Service Request" :span="2">
                <a @click="viewServiceRequest" class="text-primary cursor-pointer">
                  {{ parcel.service_request_id ? parcel.service_request_id[1] : 'N/A' }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item label="Description" :span="2">
                {{ parcel.description || 'No description' }}
              </a-descriptions-item>
              <a-descriptions-item label="Weight">
                {{ formatWeight(parcel.weight) }}
              </a-descriptions-item>
              <a-descriptions-item label="Declared Value">
                {{ formatCurrency(parcel.declared_value) }}
              </a-descriptions-item>
              <a-descriptions-item label="Dimensions" :span="2">
                <span v-if="parcel.length && parcel.width && parcel.height">
                  {{ parcel.length }} × {{ parcel.width }} × {{ parcel.height }} cm
                  <span class="text-gray-500 ml-2">
                    (Volume: {{ calculateVolume() }} cm³)
                  </span>
                </span>
                <span v-else class="text-gray-400">Not specified</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Proof of Delivery -->
          <a-card title="Proof of Delivery" v-if="parcel.state === 'delivered'" class="mb-4">
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="Recipient Name">
                {{ parcel.recipient_name || 'N/A' }}
              </a-descriptions-item>
              <a-descriptions-item label="Delivered At">
                {{ parcel.delivered_at ? formatDateTime(parcel.delivered_at) : 'N/A' }}
              </a-descriptions-item>
              <a-descriptions-item label="Signature" v-if="parcel.pod_signature">
                <img :src="parcel.pod_signature" alt="Signature" class="max-w-xs border" />
              </a-descriptions-item>
              <a-descriptions-item label="Photo" v-if="parcel.pod_photo">
                <img :src="parcel.pod_photo" alt="POD Photo" class="max-w-md border rounded" />
              </a-descriptions-item>
              <a-descriptions-item label="Notes" v-if="parcel.pod_notes">
                {{ parcel.pod_notes }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Failed Delivery Info -->
          <a-card title="Failure Information" v-if="parcel.state === 'failed'">
            <a-alert
              message="Delivery Failed"
              description="This parcel could not be delivered. Please check the timeline for details."
              type="error"
              show-icon
            />
          </a-card>
        </a-col>

        <!-- Timeline & Actions -->
        <a-col :xs="24" :lg="8">
          <a-card title="Delivery Timeline" class="mb-4">
            <a-timeline>
              <a-timeline-item color="green">
                <p class="font-medium">Parcel Created</p>
                <small class="text-gray-500">Initial status</small>
              </a-timeline-item>

              <a-timeline-item
                v-if="parcel.picked_at"
                color="blue"
              >
                <p class="font-medium">Picked Up</p>
                <small class="text-gray-500">{{ formatDateTime(parcel.picked_at) }}</small>
              </a-timeline-item>

              <a-timeline-item
                v-if="parcel.state === 'in_transit'"
                color="cyan"
              >
                <p class="font-medium">In Transit</p>
                <small class="text-gray-500">Currently being transported</small>
              </a-timeline-item>

              <a-timeline-item
                v-if="parcel.state === 'out_for_delivery'"
                color="orange"
              >
                <p class="font-medium">Out for Delivery</p>
                <small class="text-gray-500">Driver is on the way</small>
              </a-timeline-item>

              <a-timeline-item
                v-if="parcel.delivered_at"
                color="green"
              >
                <p class="font-medium">Delivered</p>
                <small class="text-gray-500">{{ formatDateTime(parcel.delivered_at) }}</small>
                <div v-if="parcel.recipient_name" class="mt-1">
                  <a-tag size="small">{{ parcel.recipient_name }}</a-tag>
                </div>
              </a-timeline-item>

              <a-timeline-item
                v-if="parcel.state === 'failed'"
                color="red"
              >
                <p class="font-medium">Delivery Failed</p>
                <small class="text-gray-500">Could not complete delivery</small>
              </a-timeline-item>

              <a-timeline-item
                v-if="parcel.state === 'returned'"
                color="purple"
              >
                <p class="font-medium">Returned</p>
                <small class="text-gray-500">Parcel returned to sender</small>
              </a-timeline-item>
            </a-timeline>
          </a-card>

          <!-- Current Job Info -->
          <a-card title="Current Job" class="mb-4" v-if="parcel.current_job_id">
            <p>
              <strong>Job ID:</strong>
              <a @click="viewJob" class="text-primary ml-2 cursor-pointer">
                {{ parcel.current_job_id[1] }}
              </a>
            </p>
          </a-card>

          <!-- Quick Actions -->
          <a-card title="Quick Actions">
            <a-space direction="vertical" style="width: 100%">
              <a-button block @click="handlePrint">
                <printer-outlined /> Print Label
              </a-button>
              <a-button block @click="handleTrack">
                <environment-outlined /> Track Location
              </a-button>
              <a-button block @click="handleExport">
                <export-outlined /> Export PDF
              </a-button>
              <a-button block @click="handleRefresh">
                <reload-outlined /> Refresh
              </a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useParcelsStore } from '@/stores/parcels'
import { formatDateTime } from '@/utils/date'
import { formatCurrency, formatWeight } from '@/utils/format'
import {
  PrinterOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const parcelsStore = useParcelsStore()

const id = Number(route.params.id)
const loading = computed(() => parcelsStore.loading)
const parcel = computed(() => parcelsStore.currentParcel)

parcelsStore.fetchById(id)

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

function calculateVolume() {
  if (!parcel.value) return 0
  const { length, width, height } = parcel.value
  if (!length || !width || !height) return 0
  return (length * width * height).toFixed(2)
}

function viewServiceRequest() {
  if (parcel.value?.service_request_id) {
    router.push(`/service-requests/${parcel.value.service_request_id[0]}`)
  }
}

function viewJob() {
  if (parcel.value?.current_job_id) {
    router.push(`/jobs/${parcel.value.current_job_id[0]}`)
  }
}

function handlePrint() {
  message.info('Print label functionality - Coming soon')
}

function handleTrack() {
  router.push(`/tracking?parcel=${id}`)
}

function handleExport() {
  message.info('Export PDF functionality - Coming soon')
}

function handleRefresh() {
  parcelsStore.fetchById(id)
  message.success('Parcel details refreshed')
}
</script>
