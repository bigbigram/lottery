import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'en',
    currencies: ['Nu.', 'INR'],
    selectedCurrency: 'Nu.',
    autoPlay: false,
    notifications: {
      sound: true,
      desktop: true
    }
  }),

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.theme);
    },

    setLanguage(lang) {
      this.language = lang;
      // Implement i18n logic
    },

    setCurrency(currency) {
      if (this.currencies.includes(currency)) {
        this.selectedCurrency = currency;
      }
    }
  },

  persist: true
});
