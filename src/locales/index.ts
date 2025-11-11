import { createI18n } from 'vue-i18n'
import en from './en'
import fr from './fr'
import ar from './ar'

export const availableLocales = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'العربية', value: 'ar' },
]

const i18n = createI18n({
  legacy: false,
  locale: 'ar',
  fallbackLocale: 'ar',
  messages: {
    en,
    fr,
    ar,
  },
})

export default i18n

