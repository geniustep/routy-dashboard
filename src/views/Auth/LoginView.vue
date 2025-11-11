<template>
  <a-card class="shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-6">
      {{ t('common.loginTitle') }}
    </h2>

    <a-form
      :model="formState"
      :rules="validationRules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-form-item :label="t('common.username')" name="username">
        <a-input
          v-model:value="formState.username"
          size="large"
          :placeholder="t('common.usernamePlaceholder')"
        >
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item :label="t('common.password')" name="password">
        <a-input-password
          v-model:value="formState.password"
          size="large"
          :placeholder="t('common.passwordPlaceholder')"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-checkbox v-model:checked="formState.remember">
          {{ t('common.rememberMe') }}
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
          {{ t('common.login') }}
        </a-button>
      </a-form-item>
    </a-form>

    <div class="text-center text-gray-600 mt-4">
      <p>{{ t('common.poweredBy') }}</p>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const formState = reactive({
  username: '',
  password: '',
  remember: false,
})

const validationRules = computed(() => ({
  username: [
    { required: true, message: t('common.validation.usernameRequired'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('common.validation.passwordRequired'), trigger: 'blur' },
  ],
}))

async function handleSubmit() {
  const success = await authStore.login(formState.username, formState.password)
  if (success) {
    router.push('/')
  }
}
</script>
