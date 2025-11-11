<template>
  <div>
    <a-page-header :title="`Driver: ${driver?.name || 'Loading...'}`" @back="() => $router.back()">
      <template #tags>
        <a-badge status="success" text="Online" />
      </template>
    </a-page-header>

    <a-spin :spinning="loading">
      <a-row :gutter="16" v-if="driver">
        <a-col :span="16">
          <a-card title="Driver Information" class="mb-4">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="Name">{{ driver.name }}</a-descriptions-item>
              <a-descriptions-item label="Email">{{ driver.email }}</a-descriptions-item>
              <a-descriptions-item label="Phone">{{ driver.phone }}</a-descriptions-item>
              <a-descriptions-item label="Status"><a-badge status="success" text="Online" /></a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card title="Performance Metrics">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-statistic title="Active Jobs" :value="driver.active_job_count || 0" />
              </a-col>
              <a-col :span="8">
                <a-statistic title="Total Deliveries" :value="driver.total_deliveries || 0" />
              </a-col>
              <a-col :span="8">
                <a-statistic title="Success Rate" :value="driver.success_rate || 0" suffix="%" :value-style="{ color: '#52c41a' }" />
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="Quick Actions">
            <a-space direction="vertical" style="width: 100%">
              <a-button block><message-outlined /> Send Message</a-button>
              <a-button block><environment-outlined /> Track Location</a-button>
              <a-button block><bar-chart-outlined /> View Reports</a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDriversStore } from '@/stores/drivers'
import { MessageOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const driversStore = useDriversStore()
const id = Number(route.params.id)
const loading = computed(() => driversStore.loading)
const driver = computed(() => driversStore.currentDriver)

driversStore.fetchById(id)
</script>
