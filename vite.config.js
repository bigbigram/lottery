import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          whitespace: 'preserve'
        }
      }
    })
  ],
  base: '/',
  server: {
    host: '192.168.78.177',
    port: 3000,
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: '192.168.78.177',
      clientPort: 3000,
      overlay: true
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': [
        "default-src 'self'",
        "connect-src 'self' https://lottery.indob2c.com https://api.emailjs.com",
        "frame-src 'self' https://www.google.com",
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
        "img-src 'self' data: https:",
        "font-src 'self' https://cdnjs.cloudflare.com"
      ].join('; ')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'lottery-core': ['./src/store/lotteryStore.js']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
