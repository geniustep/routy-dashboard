<template>
  <a-config-provider :locale="antLocale" :direction="direction">
    <component :is="layout">
      <router-view />
    </component>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import enUS from 'ant-design-vue/es/locale/en_US'
import frFR from 'ant-design-vue/es/locale/fr_FR'
import arEG from 'ant-design-vue/es/locale/ar_EG'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const { locale } = useI18n()

const antLocale = computed(() => {
  const map: Record<string, any> = {
    en: enUS,
    fr: frFR,
    ar: arEG,
  }
  return map[locale.value] || enUS
})

const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

const layout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layoutName === 'auth' ? AuthLayout : DefaultLayout
})

// Initialize direction on mount
const initializeDirection = () => {
  const savedLocale = localStorage.getItem('app_locale') || 'ar'
  const isRTL = savedLocale === 'ar'
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', savedLocale)
}

// Initialize immediately
initializeDirection()

watch(
  () => locale.value,
  (value) => {
    document.documentElement.setAttribute('dir', value === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', value)
  },
  { immediate: true }
)
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
