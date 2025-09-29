import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    https: false // Set to true for PWA in production
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['plotly.js', 'react-plotly.js'],
          animations: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    },
    // Optimize for PWA
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['plotly.js', 'framer-motion', 'lucide-react']
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      'buffer': 'buffer',
    },
  },
  // PWA optimizations
  esbuild: {
    drop: ['console', 'debugger']
  }
})
