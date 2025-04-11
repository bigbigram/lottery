import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { validateEnv } from './utils/validateEnv';
// Validate environment before app starts
validateEnv();

const supportsPassive = (() => {
  let passiveSupported = false;
  try {
    window.addEventListener('test', null, {
      get passive() {
        passiveSupported = true;
        return false;
      }
    });
  } catch (e) { }
  return passiveSupported;
})();

// Add passive touch event listeners
document.addEventListener('touchstart', () => {}, supportsPassive ? { passive: true } : false);
document.addEventListener('touchmove', () => {}, supportsPassive ? { passive: true } : false);

const app = createApp(App);
const pinia = createPinia();

// Add performance monitoring
if (import.meta.env.PROD) {
  router.beforeEach((to, from, next) => {
    const start = performance.now();
    next();
    router.afterEach(() => {
      const duration = performance.now() - start;
      console.log(`Route ${to.path} loaded in ${duration}ms`);
    });
  });
}

// Handle service worker messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      // Handle cache updates
      console.log('Cache updated:', event.data);
    }
  });
}

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

app.use(pinia);
app.use(router);

// Add passive event listener support
app.directive('scroll', {
  mounted(el, binding) {
    el.addEventListener('touchmove', binding.value, { passive: true });
    el.addEventListener('touchstart', binding.value, { passive: true });
  },
  unmounted(el, binding) {
    el.removeEventListener('touchmove', binding.value);
    el.removeEventListener('touchstart', binding.value);
  }
});

app.mount('#app');

// Add global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err);
  // You could send to error tracking service here
};
