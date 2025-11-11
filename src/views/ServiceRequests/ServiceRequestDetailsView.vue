<template>
  <div class="space-y-4">
    <a-page-header
      :title="`Service Request: ${serviceRequest?.name || 'Loading...'}`"
      @back="() => $router.back()"
    >
      <template #extra>
        <a-space>
          <a-button v-if="serviceRequest?.state === 'draft'" type="primary" @click="handleConfirm">
            Confirm
          </a-button>
          <a-button danger v-if="canCancel" @click="handleCancel">
            Cancel Request
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-spin :spinning="isLoading">
      <a-row :gutter="16" v-if="serviceRequest">
        <!-- Main Details -->
        <a-col :xs="24" :lg="16">
          <a-card title="Request Details" class="mb-4">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="Status">
                <a-tag :color="getStatusColor(serviceRequest.state)">
                  {{ formatState(serviceRequest.state) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Service Type">
                <a-tag>{{ serviceRequest.service_type }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Customer">
                {{ serviceRequest.customer_id ? serviceRequest.customer_id[1] : 'N/A' }}
              </a-descriptions-item>
              <a-descriptions-item label="Driver">
                {{ serviceRequest.assigned_driver_id ? serviceRequest.assigned_driver_id[1] : 'Not assigned' }}
              </a-descriptions-item>
              <a-descriptions-item label="Pickup Address" :span="2">
                <environment-outlined /> {{ serviceRequest.pickup_address }}
              </a-descriptions-item>
              <a-descriptions-item label="Pickup Phone">
                <phone-outlined /> {{ serviceRequest.pickup_phone }}
              </a-descriptions-item>
              <a-descriptions-item label="Delivery Address" :span="2">
                <environment-outlined /> {{ serviceRequest.delivery_address }}
              </a-descriptions-item>
              <a-descriptions-item label="Delivery Phone">
                <phone-outlined /> {{ serviceRequest.delivery_phone }}
              </a-descriptions-item>
              <a-descriptions-item label="Service Fee">
                MAD {{ serviceRequest.service_fee }}
              </a-descriptions-item>
              <a-descriptions-item label="COD Amount">
                MAD {{ serviceRequest.cod_amount }}
              </a-descriptions-item>
              <a-descriptions-item label="Created Date" :span="2">
                {{ formatDateTime(serviceRequest.create_date) }}
              </a-descriptions-item>
              <a-descriptions-item label="Notes" :span="2" v-if="serviceRequest.notes">
                {{ serviceRequest.notes }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Parcels -->
          <a-card title="Parcels">
            <a-empty v-if="!serviceRequest.parcel_count" description="No parcels" />
            <div v-else>
              <p>Total parcels: {{ serviceRequest.parcel_count }}</p>
            </div>
          </a-card>
        </a-col>

        <!-- Timeline & Actions -->
        <a-col :xs="24" :lg="8">
          <a-card title="Timeline" class="mb-4">
            <a-timeline>
              <a-timeline-item color="green">
                <p>Request Created</p>
                <small>{{ formatDateTime(serviceRequest.create_date) }}</small>
              </a-timeline-item>
              <a-timeline-item
                v-if="serviceRequest.state !== 'draft'"
                color="blue"
              >
                <p>Request Confirmed</p>
              </a-timeline-item>
              <a-timeline-item
                v-if="serviceRequest.assigned_driver_id"
                color="blue"
              >
                <p>Driver Assigned</p>
                <small>{{ serviceRequest.assigned_driver_id[1] }}</small>
              </a-timeline-item>
              <a-timeline-item
                v-if="serviceRequest.state === 'delivered'"
                color="green"
              >
                <p>Delivered</p>
              </a-timeline-item>
            </a-timeline>
          </a-card>

          <a-card title="Quick Actions">
            <a-space direction="vertical" style="width: 100%">
              <a-button block @click="handlePrint">
                <printer-outlined /> Print
              </a-button>
              <a-button block @click="handleExport">
                <export-outlined /> Export PDF
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
import { useServiceRequest } from '@/composables/useServiceRequests'
import { formatDateTime } from '@/utils/date'
import {
  EnvironmentOutlined,
  PhoneOutlined,
  PrinterOutlined,
  ExportOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { serviceRequest, isLoading } = useServiceRequest(id)

const canCancel = computed(() => {
  return serviceRequest.value?.state !== 'cancelled' && serviceRequest.value?.state !== 'delivered'
})

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

function handleConfirm() {
  message.info('Confirm functionality to be implemented')
}

function handleCancel() {
  message.info('Cancel functionality to be implemented')
}

function handlePrint() {
  window.print()
}

function handleExport() {
  message.info('Export functionality to be implemented')
}
</script>
