import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { resources } from './resources';

const deviceLanguage = getLocales()[0]?.languageCode || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: deviceLanguage, // default to device language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        cleanCode: true,
    });

export default i18n;
