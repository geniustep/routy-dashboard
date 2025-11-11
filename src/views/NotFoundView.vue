<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-gray-500 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a-button type="primary" size="large" @click="goHome">
        Go to Dashboard
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
