<template>
  <a-card class="shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Login to Dashboard</h2>

    <a-form
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-form-item label="Username" name="username">
        <a-input
          v-model:value="formState.username"
          size="large"
          placeholder="Enter your username"
        >
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Password" name="password">
        <a-input-password
          v-model:value="formState.password"
          size="large"
          placeholder="Enter your password"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-checkbox v-model:checked="formState.remember">
          Remember me
        </a-checkbox>
      </a-form-item>

      <a-alert
        v-if="authStore.error"
        :message="authStore.error"
        type="error"
        show-icon
        closable
        class="mb-4"
        @close="authStore.error = null"
      />

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          block
          :loading="authStore.loading"
        >
          Login
        </a-button>
      </a-form-item>
    </a-form>

    <div class="text-center text-gray-600 mt-4">
      <p>Powered by Routy v1.0</p>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const formState = reactive({
  username: '',
  password: '',
  remember: false,
})

const rules = {
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  const success = await authStore.login(formState.username, formState.password)
  if (success) {
    router.push('/')
  }
}
</script>
