import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isVercel = process.env.VERCEL === '1';

  return {
    // Base path: '/' for Vercel/Web to support nested routes (e.g. /p/1), './' for Capacitor/Builds
    base: isVercel ? '/' : './',

    // Development server configuration
    server: {
      port: 3000,
      host: true, // Listen on all addresses
      open: true, // Open browser on start
      strictPort: true,
    },

    // Preview server (for production builds)
    preview: {
      port: 3000,
    },

    // Plugins
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'SokoSnap',
          short_name: 'SokoSnap',
          description: 'Secure social commerce with M-Pesa escrow',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          icons: [
            {
              src: 'icons/icon-48.webp',
              sizes: '48x48',
              type: 'image/webp'
            },
            {
              src: 'icons/icon-72.webp',
              sizes: '72x72',
              type: 'image/webp'
            },
            {
              src: 'icons/icon-96.webp',
              sizes: '96x96',
              type: 'image/webp'
            },
            {
              src: 'icons/icon-128.webp',
              sizes: '128x128',
              type: 'image/webp'
            },
            {
              src: 'icons/icon-192.webp',
              sizes: '192x192',
              type: 'image/webp'
            },
            {
              src: 'icons/icon-256.webp',
              sizes: '256x256',
              type: 'image/webp'
            },
            {
              src: 'icons/icon-512.webp',
              sizes: '512x512',
              type: 'image/webp'
            }
          ]
        }
      })
    ],

    // Path aliases matching tsconfig.json
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@store': path.resolve(__dirname, './src/store'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
      },
    },

    // Environment variable handling
    // Note: Only VITE_ prefixed variables are exposed to client
    define: {
      // Make app version available
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '0.0.0'),
    },

    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',

      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,

      // Generate source maps for production debugging
      sourcemap: true,

      // Rollup options for code splitting
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          seller: path.resolve(__dirname, 'seller.html'),
        },
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-maps': ['leaflet', 'react-leaflet'],
            'vendor-state': ['zustand', 'zod', '@tanstack/react-query'],
            'vendor-capacitor': [
              '@capacitor/core',
              '@capacitor/app',
              '@capacitor/camera',
              '@capacitor/geolocation',
              '@capacitor/filesystem',
              '@capacitor/share',
            ],
          },
        },
      },

      // Target modern browsers
      target: 'es2022',

      // Minification
      minify: 'esbuild',
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand', 'zod', 'lucide-react', 'recharts'],
    },

    // Enable CSS modules
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
  };
});
