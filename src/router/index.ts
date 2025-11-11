import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/service-requests',
    name: 'ServiceRequests',
    component: () => import('@/views/ServiceRequests/ServiceRequestsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/service-requests/:id',
    name: 'ServiceRequestDetails',
    component: () => import('@/views/ServiceRequests/ServiceRequestDetailsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/parcels',
    name: 'Parcels',
    component: () => import('@/views/Parcels/ParcelsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/parcels/:id',
    name: 'ParcelDetails',
    component: () => import('@/views/Parcels/ParcelDetailsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('@/views/Jobs/JobsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/jobs/:id',
    name: 'JobDetails',
    component: () => import('@/views/Jobs/JobDetailsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('@/views/Drivers/DriversView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/drivers/:id',
    name: 'DriverDetails',
    component: () => import('@/views/Drivers/DriverDetailsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tracking',
    name: 'Tracking',
    component: () => import('@/views/Tracking/LiveTrackingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports/ReportsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
