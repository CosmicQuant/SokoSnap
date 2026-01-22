import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sokosnap.app',
  appName: 'SokoSnap',
  webDir: 'dist',
  android: {
    // Prevent keyboard from resizing the entire app
    // Only the focused input will adjust
    overrideUserAgent: undefined,
    backgroundColor: '#000000',
    allowMixedContent: true,
    captureInput: true,
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    Keyboard: {
      // Keyboard will overlay the app instead of resizing it
      resize: 'none',
      resizeOnFullScreen: false,
    },
  },
};

export default config;
