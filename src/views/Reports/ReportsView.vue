<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Reports & Analytics</h1>
        <p class="text-gray-600">Performance insights and analytics</p>
      </div>
      <a-range-picker v-model:value="dateRange" @change="handleDateChange" />
    </div>

    <!-- KPIs -->
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic title="Total Deliveries" :value="kpis.totalDeliveries" :value-style="{ color: '#1890ff' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Success Rate" :value="kpis.successRate" suffix="%" :value-style="{ color: '#52c41a' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Total Revenue" :value="kpis.totalRevenue" prefix="MAD" :value-style="{ color: '#faad14' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Active Drivers" :value="kpis.activeDrivers" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts -->
    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="Deliveries Trend">
          <v-chart class="chart" :option="deliveriesTrendOption" autoresize />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Delivery Status">
          <v-chart class="chart" :option="statusDistributionOption" autoresize />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="Top Drivers">
          <v-chart class="chart" :option="topDriversOption" autoresize />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Hourly Activity">
          <v-chart class="chart" :option="hourlyActivityOption" autoresize />
        </a-card>
      </a-col>
    </a-row>

    <!-- Performance Table -->
    <a-card title="Driver Performance">
      <a-table
        :columns="performanceColumns"
        :data-source="driverPerformance"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'rating'">
            <a-rate :value="record.rating" disabled allow-half />
          </template>
          <template v-if="column.key === 'successRate'">
            <a-progress :percent="record.successRate" :status="record.successRate >= 90 ? 'success' : 'normal'" />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const dateRange = ref<any>([])

const kpis = ref({
  totalDeliveries: 1247,
  successRate: 94.5,
  totalRevenue: 125800,
  activeDrivers: 32,
})

const deliveriesTrendOption = ref({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Completed', 'Failed'] },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Completed', type: 'line', data: [120, 132, 101, 134, 90, 230, 210], smooth: true, areaStyle: {}, itemStyle: { color: '#52c41a' } },
    { name: 'Failed', type: 'line', data: [10, 12, 8, 9, 7, 15, 12], smooth: true, areaStyle: {}, itemStyle: { color: '#ff4d4f' } },
  ],
})

const statusDistributionOption = ref({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 1048, name: 'Delivered', itemStyle: { color: '#52c41a' } },
      { value: 735, name: 'In Progress', itemStyle: { color: '#1890ff' } },
      { value: 580, name: 'Pending', itemStyle: { color: '#faad14' } },
      { value: 84, name: 'Failed', itemStyle: { color: '#ff4d4f' } },
    ],
  }],
})

const topDriversOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['Driver 5', 'Driver 4', 'Driver 3', 'Driver 2', 'Driver 1'] },
  series: [{
    name: 'Deliveries',
    type: 'bar',
    data: [120, 140, 165, 180, 195],
    itemStyle: { color: '#1890ff' },
  }],
})

const hourlyActivityOption = ref({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
  yAxis: { type: 'value' },
  series: [{
    name: 'Deliveries',
    type: 'bar',
    data: [10, 15, 45, 120, 180, 95, 30],
    itemStyle: { color: '#52c41a' },
  }],
})

const performanceColumns = [
  { title: 'Driver', dataIndex: 'name', key: 'name' },
  { title: 'Total Deliveries', dataIndex: 'totalDeliveries', key: 'totalDeliveries' },
  { title: 'Success Rate', key: 'successRate' },
  { title: 'Rating', key: 'rating' },
  { title: 'Revenue', dataIndex: 'revenue', key: 'revenue' },
]

const driverPerformance = ref([
  { name: 'Ahmed Ali', totalDeliveries: 195, successRate: 96.5, rating: 4.8, revenue: 'MAD 9,800' },
  { name: 'Mohammed Hassan', totalDeliveries: 180, successRate: 94.2, rating: 4.7, revenue: 'MAD 9,100' },
  { name: 'Youssef Ibrahim', totalDeliveries: 165, successRate: 93.8, rating: 4.6, revenue: 'MAD 8,500' },
  { name: 'Karim Saad', totalDeliveries: 140, successRate: 92.1, rating: 4.5, revenue: 'MAD 7,200' },
  { name: 'Omar Khalid', totalDeliveries: 120, successRate: 91.5, rating: 4.4, revenue: 'MAD 6,400' },
])

function handleDateChange() {
  // Load data for selected date range
  console.log('Date range changed:', dateRange.value)
}
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
