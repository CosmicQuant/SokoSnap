# Mobile App Setup Guide

This project has been configured with **Capacitor** to build native Android and iOS apps.

## Prerequisites
1. **Node.js** (Installed)
2. **Android Studio** (For building Android App)
3. **Xcode** (For building iOS App - Mac only)

## Google Login Configuration (REQUIRED)

To enable Native Google Login without browser redirects:

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project for "SokoSnap".
3. **OAuth Consent Screen**: Set up the consent screen.
4. **Credentials**:
   - Create an **Android Key**: You will need the SHA-1 of your signing keystore.
   - Create an **iOS Key**: You will need the bundle ID (`com.sokosnap.app`).
   - Create a **Web Client ID**: This represents your backend/web app.

### 2. Android Setup
1. Download `google-services.json` from Firebase/Google Console.
2. Place it in `android/app/google-services.json`.
3. Open `capacitor.config.ts` and replace `YOUR_WEB_CLIENT_ID` with your actual Web Client ID.

### 3. iOS Setup
1. Download `GoogleService-Info.plist`.
2. Place it in `ios/App/App/GoogleService-Info.plist`.
3. Open `ios/App/App/Info.plist` (in Xcode) and add a **URL Type**:
   - **URL Schemes**: `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_REVERSED`

## Permissions Configured
The following permissions have been added to the project manifest/plist:
- **Camera**: For taking photos of products.
- **Photo Library**: For uploading existing photos.
- **Location (Fine/Coarse)**: For delivery tracking and "products near me".
- **Storage**: For file access.

## Building the Apps

### Android
```bash
npm run build
npx cap sync
npx cap open android
```
Then click the "Run" button in Android Studio.

### iOS (Mac Only)
```bash
npm run build
npx cap sync
npx cap open ios
```
Then run the app in Xcode.
