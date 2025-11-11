<template>
  <div>
    <a-page-header :title="`Job: ${job?.name || 'Loading...'}`" @back="() => $router.back()">
      <template #extra>
        <a-space>
          <a-button v-if="job?.state === 'assigned'" type="primary" @click="handleAccept">Accept</a-button>
          <a-button v-if="job?.state === 'accepted'" type="primary" @click="handleStart">Start</a-button>
          <a-button v-if="job?.state === 'in_progress'" type="primary" @click="handleComplete">Complete</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-row :gutter="16" v-if="job">
        <a-col :span="16">
          <a-card title="Job Information" class="mb-4">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="Job ID">{{ job.name }}</a-descriptions-item>
              <a-descriptions-item label="Type">
                <a-tag :color="job.job_type === 'pickup' ? 'blue' : 'green'">{{ job.job_type }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Status">
                <a-tag :color="getStatusColor(job.state)">{{ formatState(job.state) }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Driver">{{ job.driver_id ? job.driver_id[1] : 'N/A' }}</a-descriptions-item>
              <a-descriptions-item label="Location" :span="2">{{ job.location_address }}</a-descriptions-item>
              <a-descriptions-item label="Scheduled">{{ formatDateTime(job.scheduled_time) }}</a-descriptions-item>
              <a-descriptions-item label="Started">{{ job.started_at ? formatDateTime(job.started_at) : '-' }}</a-descriptions-item>
              <a-descriptions-item label="Completed">{{ job.completed_at ? formatDateTime(job.completed_at) : '-' }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Timeline">
            <a-timeline>
              <a-timeline-item color="green">Job Created</a-timeline-item>
              <a-timeline-item v-if="job.state !== 'assigned'" color="blue">Job Accepted</a-timeline-item>
              <a-timeline-item v-if="job.started_at" color="cyan">Job Started</a-timeline-item>
              <a-timeline-item v-if="job.completed_at" color="green">Job Completed</a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useJobsStore } from '@/stores/jobs'
import { formatDateTime } from '@/utils/date'

const route = useRoute()
const jobsStore = useJobsStore()
const id = Number(route.params.id)
const loading = computed(() => jobsStore.loading)
const job = computed(() => jobsStore.currentJob)

jobsStore.fetchById(id)

function getStatusColor(state: string) {
  const colors: Record<string, string> = { assigned: 'default', accepted: 'blue', in_progress: 'cyan', completed: 'green', failed: 'red' }
  return colors[state] || 'default'
}

function formatState(state: string) {
  return state.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function handleAccept() {
  await jobsStore.accept(id)
  message.success('Job accepted')
}

async function handleStart() {
  await jobsStore.start(id)
  message.success('Job started')
}

async function handleComplete() {
  await jobsStore.complete(id)
  message.success('Job completed')
}
</script>
