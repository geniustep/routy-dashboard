<template>
  <a-layout class="min-h-screen">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="bg-white shadow-sm"
      :width="250"
    >
      <div class="logo p-4 text-center border-b">
        <h1 v-if="!collapsed" class="text-2xl font-bold text-primary m-0">
          Routy
        </h1>
        <h1 v-else class="text-2xl font-bold text-primary m-0">R</h1>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="border-r-0"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <dashboard-outlined />
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item key="service-requests">
          <file-text-outlined />
          <span>Service Requests</span>
        </a-menu-item>
        <a-menu-item key="parcels">
          <inbox-outlined />
          <span>Parcels</span>
        </a-menu-item>
        <a-menu-item key="jobs">
          <car-outlined />
          <span>Jobs</span>
        </a-menu-item>
        <a-menu-item key="drivers">
          <user-outlined />
          <span>Drivers</span>
        </a-menu-item>
        <a-menu-item key="tracking">
          <environment-outlined />
          <span>Live Tracking</span>
        </a-menu-item>
        <a-menu-item key="reports">
          <bar-chart-outlined />
          <span>Reports</span>
        </a-menu-item>
        <a-menu-item key="settings">
          <setting-outlined />
          <span>Settings</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="bg-white shadow-sm px-6 flex items-center justify-between">
        <menu-unfold-outlined
          v-if="collapsed"
          class="text-xl cursor-pointer"
          @click="toggleCollapsed"
        />
        <menu-fold-outlined
          v-else
          class="text-xl cursor-pointer"
          @click="toggleCollapsed"
        />

        <div class="flex items-center gap-4">
          <a-badge :count="5">
            <bell-outlined class="text-xl cursor-pointer" />
          </a-badge>

          <a-dropdown>
            <div class="flex items-center gap-2 cursor-pointer">
              <a-avatar :size="32">
                <template #icon><user-outlined /></template>
              </a-avatar>
              <span>{{ authStore.currentUser?.username }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <user-outlined /> Profile
                </a-menu-item>
                <a-menu-item key="settings">
                  <setting-outlined /> Settings
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined /> Logout
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="p-6 bg-gray-50">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  InboxOutlined,
  CarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

// Update selected menu item based on current route
watch(
  () => route.path,
  (newPath) => {
    const pathSegment = newPath.split('/')[1]
    selectedKeys.value = [pathSegment || 'dashboard']
  },
  { immediate: true }
)

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

function handleMenuClick({ key }: { key: string }) {
  router.push(`/${key}`)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
