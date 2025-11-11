<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold">{{ t('dashboard.title') }}</h1>
      <p class="text-gray-600">{{ t('dashboard.welcome') }}</p>
    </div>

    <!-- KPI Cards -->
    <a-row :gutter="16">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            :title="t('dashboard.kpi.totalRequests')"
            :value="stats.totalRequests"
            :prefix="h(FileTextOutlined)"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            :title="t('dashboard.kpi.activeDeliveries')"
            :value="stats.activeDeliveries"
            :value-style="{ color: '#52c41a' }"
            :prefix="h(CarOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            :title="t('dashboard.kpi.successRate')"
            :value="stats.successRate"
            suffix="%"
            :precision="1"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            :title="t('dashboard.kpi.revenueToday')"
            :value="stats.revenue"
            :prefix="t('common.currencyMAD')"
            :precision="2"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts Row -->
    <a-row :gutter="16">
      <a-col :xs="24" :lg="16">
        <a-card :title="t('dashboard.charts.deliveriesOverview')" :loading="loading">
          <v-chart class="chart" :option="deliveryChartOption" autoresize />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card :title="t('dashboard.charts.statusDistribution')" :loading="loading">
          <v-chart class="chart" :option="statusChartOption" autoresize />
        </a-card>
      </a-col>
    </a-row>

    <!-- Recent Activities Row -->
    <a-row :gutter="16">
      <a-col :xs="24" :lg="12">
        <a-card :title="t('dashboard.recentRequests.title')" :loading="loading">
          <a-list
            :data-source="recentRequests"
            :locale="{ emptyText: t('dashboard.recentRequests.empty') }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.name"
                  :description="item.customer_id ? item.customer_id[1] : 'N/A'"
                />
                <template #extra>
                  <a-tag :color="getStatusColor(item.state)">
                    {{ t(`common.statusLabels.${item.state}`) }}
                  </a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
          <div class="text-center mt-4">
            <a-button type="link" @click="viewAllRequests">
              {{ t('dashboard.recentRequests.viewAll') }}
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card :title="t('dashboard.activeDrivers.title')" :loading="loading">
          <a-list
            :data-source="activeDrivers"
            :locale="{ emptyText: t('dashboard.activeDrivers.empty') }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.name"
                  :description="t('dashboard.activeDrivers.activeJobs', { count: item.active_job_count || 0 })"
                >
                  <template #avatar>
                    <a-avatar>
                      <template #icon><user-outlined /></template>
                    </a-avatar>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <a-badge status="success" :text="t('common.online')" />
                </template>
              </a-list-item>
            </template>
          </a-list>
          <div class="text-center mt-4">
            <a-button type="link" @click="viewAllDrivers">
              {{ t('dashboard.activeDrivers.viewAll') }}
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  FileTextOutlined,
  CarOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { serviceRequestService } from '@/api/services/serviceRequestService'
import { driverService } from '@/api/services/driverService'
import { useI18n } from 'vue-i18n'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const router = useRouter()
const loading = ref(false)
const { t } = useI18n()

const stats = ref({
  totalRequests: 0,
  activeDeliveries: 0,
  successRate: 0,
  revenue: 0,
})

const recentRequests = ref<any[]>([])
const activeDrivers = ref<any[]>([])

const deliveryChartOption = ref({})
const statusChartOption = ref({})

watchEffect(() => {
  deliveryChartOption.value = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('dashboard.charts.deliveriesSeries'),
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        smooth: true,
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.2)',
        },
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  }

  statusChartOption.value = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '5%',
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: t('dashboard.charts.delivered'), itemStyle: { color: '#52c41a' } },
          { value: 735, name: t('dashboard.charts.inProgress'), itemStyle: { color: '#1890ff' } },
          { value: 580, name: t('dashboard.charts.pending'), itemStyle: { color: '#faad14' } },
          { value: 484, name: t('dashboard.charts.cancelled'), itemStyle: { color: '#ff4d4f' } },
        ],
      },
    ],
  }
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

async function loadDashboardData() {
  loading.value = true
  try {
    // Load recent requests
    const requests = await serviceRequestService.getAll({ limit: 5 })
    recentRequests.value = requests || []

    // Load active drivers
    const drivers = await driverService.getActive()
    activeDrivers.value = (drivers || []).slice(0, 5)

    // Calculate stats (mock data for now)
    stats.value = {
      totalRequests: requests?.length || 0,
      activeDeliveries: 42,
      successRate: 94.5,
      revenue: 12450.50,
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

function viewAllRequests() {
  router.push('/service-requests')
}

function viewAllDrivers() {
  router.push('/drivers')
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
