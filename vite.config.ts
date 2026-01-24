import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base path for Capacitor/Production
    base: './',

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
