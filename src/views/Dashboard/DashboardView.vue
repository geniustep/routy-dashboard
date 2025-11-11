<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's what's happening today.</p>
    </div>

    <!-- KPI Cards -->
    <a-row :gutter="16">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            title="Total Requests"
            :value="stats.totalRequests"
            :prefix="h(FileTextOutlined)"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            title="Active Deliveries"
            :value="stats.activeDeliveries"
            :value-style="{ color: '#52c41a' }"
            :prefix="h(CarOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-lg transition-shadow">
          <a-statistic
            title="Success Rate"
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
            title="Revenue Today"
            :value="stats.revenue"
            prefix="MAD"
            :precision="2"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts Row -->
    <a-row :gutter="16">
      <a-col :xs="24" :lg="16">
        <a-card title="Deliveries Overview" :loading="loading">
          <v-chart class="chart" :option="deliveryChartOption" autoresize />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="Status Distribution" :loading="loading">
          <v-chart class="chart" :option="statusChartOption" autoresize />
        </a-card>
      </a-col>
    </a-row>

    <!-- Recent Activities Row -->
    <a-row :gutter="16">
      <a-col :xs="24" :lg="12">
        <a-card title="Recent Service Requests" :loading="loading">
          <a-list
            :data-source="recentRequests"
            :locale="{ emptyText: 'No recent requests' }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.name"
                  :description="item.customer_id ? item.customer_id[1] : 'N/A'"
                />
                <template #extra>
                  <a-tag :color="getStatusColor(item.state)">
                    {{ item.state }}
                  </a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
          <div class="text-center mt-4">
            <a-button type="link" @click="viewAllRequests">
              View All Requests
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card title="Active Drivers" :loading="loading">
          <a-list
            :data-source="activeDrivers"
            :locale="{ emptyText: 'No active drivers' }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="item.name"
                  :description="`${item.active_job_count || 0} active jobs`"
                >
                  <template #avatar>
                    <a-avatar>
                      <template #icon><user-outlined /></template>
                    </a-avatar>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <a-badge status="success" text="Online" />
                </template>
              </a-list-item>
            </template>
          </a-list>
          <div class="text-center mt-4">
            <a-button type="link" @click="viewAllDrivers">
              View All Drivers
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
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

const stats = ref({
  totalRequests: 0,
  activeDeliveries: 0,
  successRate: 0,
  revenue: 0,
})

const recentRequests = ref<any[]>([])
const activeDrivers = ref<any[]>([])

const deliveryChartOption = ref({
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
      name: 'Deliveries',
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
})

const statusChartOption = ref({
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
        { value: 1048, name: 'Delivered', itemStyle: { color: '#52c41a' } },
        { value: 735, name: 'In Progress', itemStyle: { color: '#1890ff' } },
        { value: 580, name: 'Pending', itemStyle: { color: '#faad14' } },
        { value: 484, name: 'Cancelled', itemStyle: { color: '#ff4d4f' } },
      ],
    },
  ],
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
