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
          {{ t('common.appName') }}
        </h1>
        <h1 v-else class="text-2xl font-bold text-primary m-0">
          {{ t('common.shortName') }}
        </h1>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="border-r-0"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <dashboard-outlined />
          <span>{{ t('common.menu.dashboard') }}</span>
        </a-menu-item>
        <a-menu-item key="service-requests">
          <file-text-outlined />
          <span>{{ t('common.menu.serviceRequests') }}</span>
        </a-menu-item>
        <a-menu-item key="parcels">
          <inbox-outlined />
          <span>{{ t('common.menu.parcels') }}</span>
        </a-menu-item>
        <a-menu-item key="jobs">
          <car-outlined />
          <span>{{ t('common.menu.jobs') }}</span>
        </a-menu-item>
        <a-menu-item key="drivers">
          <user-outlined />
          <span>{{ t('common.menu.drivers') }}</span>
        </a-menu-item>
        <a-menu-item key="tracking">
          <environment-outlined />
          <span>{{ t('common.menu.tracking') }}</span>
        </a-menu-item>
        <a-menu-item key="reports">
          <bar-chart-outlined />
          <span>{{ t('common.menu.reports') }}</span>
        </a-menu-item>
        <a-menu-item key="settings">
          <setting-outlined />
          <span>{{ t('common.menu.settings') }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header-container">
        <div class="header-left">
          <div class="menu-toggle" @click="toggleCollapsed">
            <menu-unfold-outlined
              v-if="collapsed"
              class="menu-icon"
            />
            <menu-fold-outlined
              v-else
              class="menu-icon"
            />
          </div>
          <div class="breadcrumb-info">
            <span class="current-page">{{ getCurrentPageTitle() }}</span>
          </div>
        </div>

        <div class="header-right">
          <a-tooltip :title="t('common.header.notifications')">
            <a-badge :count="5" class="notification-badge">
              <div class="icon-button">
                <bell-outlined class="header-icon" />
              </div>
            </a-badge>
          </a-tooltip>

          <a-select
            v-model:value="currentLocale"
            size="small"
            class="language-selector"
          >
            <a-select-option
              v-for="option in languageOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>

          <a-dropdown>
            <div class="user-profile">
              <a-avatar :size="36" class="user-avatar">
                <template #icon><user-outlined /></template>
              </a-avatar>
              <div class="user-info">
                <span class="username">{{ authStore.currentUser?.username || 'User' }}</span>
                <span class="user-role">Administrator</span>
              </div>
            </div>
            <template #overlay>
              <a-menu class="user-menu">
                <a-menu-item key="profile">
                  <user-outlined /> {{ t('common.header.profile') }}
                </a-menu-item>
                <a-menu-item key="settings">
                  <setting-outlined /> {{ t('common.header.settings') }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout" class="logout-item">
                  <logout-outlined /> {{ t('common.header.logout') }}
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
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { availableLocales } from '@/locales'
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
const { t, locale } = useI18n()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])
const languageOptions = availableLocales

// Load saved locale from localStorage
const savedLocale = localStorage.getItem('app_locale') || 'ar'
if (savedLocale && ['en', 'fr', 'ar'].includes(savedLocale)) {
  locale.value = savedLocale
  // Set document direction for Arabic
  if (savedLocale === 'ar') {
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
  } else {
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = savedLocale
  }
}

const currentLocale = computed({
  get: () => locale.value,
  set: (value: string) => {
    locale.value = value
    localStorage.setItem('app_locale', value)
    // Update document direction for Arabic
    if (value === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = value
    }
  },
})

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

function getCurrentPageTitle() {
  const path = route.path
  const menuMap: Record<string, string> = {
    '/dashboard': t('common.menu.dashboard'),
    '/service-requests': t('common.menu.serviceRequests'),
    '/parcels': t('common.menu.parcels'),
    '/jobs': t('common.menu.jobs'),
    '/drivers': t('common.menu.drivers'),
    '/tracking': t('common.menu.tracking'),
    '/reports': t('common.menu.reports'),
    '/settings': t('common.menu.settings'),
  }
  
  // Check exact match first
  if (menuMap[path]) {
    return menuMap[path]
  }
  
  // Check if path starts with any menu key
  for (const [key, value] of Object.entries(menuMap)) {
    if (path.startsWith(key)) {
      return value
    }
  }
  
  return t('common.menu.dashboard')
}
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Header Container */
.header-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Header Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.menu-icon {
  font-size: 18px;
  color: #ffffff;
}

.breadcrumb-info {
  display: flex;
  align-items: center;
}

.current-page {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Header Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Icon Button */
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.header-icon {
  font-size: 18px;
  color: #ffffff;
}

.notification-badge :deep(.ant-badge-count) {
  background: #ff4d4f;
  box-shadow: 0 0 0 1px #ffffff;
}

/* Language Selector */
.language-selector {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.language-selector :deep(.ant-select-selector) {
  background: transparent !important;
  border: none !important;
  color: #ffffff;
}

.language-selector :deep(.ant-select-selection-item) {
  color: #ffffff !important;
  font-weight: 500;
}

.language-selector :deep(.ant-select-arrow) {
  color: #ffffff;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}

/* User Menu */
.user-menu {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
}

.user-menu :deep(.ant-menu-item) {
  padding: 8px 16px;
  margin: 2px 4px;
  border-radius: 6px;
}

.user-menu :deep(.ant-menu-item:hover) {
  background: #f0f0f0;
}

.logout-item {
  color: #ff4d4f !important;
}

.logout-item:hover {
  background: #fff1f0 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .breadcrumb-info {
    display: none;
  }
  
  .user-info {
    display: none;
  }
  
  .language-selector {
    width: 100px !important;
  }
}
</style>
