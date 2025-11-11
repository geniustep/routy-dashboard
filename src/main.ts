import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'leaflet/dist/leaflet.css'
import './assets/styles/main.css'

import App from './App.vue'
import router from './router'
import i18n from './locales'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)
app.use(VueQueryPlugin)
app.use(i18n)

app.mount('#app')
