import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector";
import translationEN from './translationEN.json';
import translationZH from './translationZH.json';

i18n.on('languageChanged', function (lng) {
  if (lng === i18n.options.fallbackLng[0]) {
    if (window.location.pathname.includes('/' + i18n.options.fallbackLng[0])) {
      const newUrl = window.location.pathname.replace('/' + i18n.options.fallbackLng[0], '')
      window.location.replace(newUrl)
    }
  }
})

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      zh: {
        translation: translationZH
      }
    },
    whitelist: ['en', 'zh'],
    fallbackLng: ['en'],
    detection: {
      order: ['path'],
      lookupFromPathIndex: 0,
      checkWhitelist: true
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: '.'
    }
  })

export default i18n;