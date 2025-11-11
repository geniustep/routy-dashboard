<template>
  <a-config-provider :locale="locale">
    <component :is="layout">
      <router-view />
    </component>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import enUS from 'ant-design-vue/es/locale/en_US'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const locale = enUS

const layout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layoutName === 'auth' ? AuthLayout : DefaultLayout
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
