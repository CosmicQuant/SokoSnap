import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isVercel = process.env.VERCEL === '1';

  return {
    // Base path: '/' for Vercel/Web/Dev to support nested routes of SPA, './' for Capacitor Production Builds
    // Default to '/' to ensure Firebase/Web deep links work.
    // For Mobile builds, we rely on the relative path behavior if configured, or you can manually switch this locally.
    base: process.env.CAPACITOR_BUILD ? './' : '/',

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
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 1. Firebase (Largest chunk, standalone)
              if (id.includes('firebase') || id.includes('@firebase')) {
                return 'vendor-firebase';
              }

              // 2. Maps (Large, specific usage)
              if (id.includes('leaflet') || id.includes('react-leaflet') || id.includes('react-google-maps')) {
                return 'vendor-maps';
              }

              // 3. Capacitor (Native bridge)
              if (id.includes('@capacitor') || id.includes('@codetrix-studio')) {
                return 'vendor-capacitor';
              }

              // 4. AI (Specific usage)
              if (id.includes('@google/generative-ai')) {
                return 'vendor-ai';
              }

              // 5. Core Vendor (React + UI + State + Utils)
              // Grouping these avoids circular dependencies between React and its ecosystem
              return 'vendor-core';
            }
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
