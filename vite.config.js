import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiProxy = {
  target: 'https://api.etkinlik.in',
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.setHeader('Origin', 'https://etkinlik.in')
      proxyReq.setHeader('Referer', 'https://etkinlik.in/')
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': apiProxy,
      '/tasks': apiProxy,
    }
  }
})
