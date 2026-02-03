# Copilot Instructions for SokoSnap

## Project Overview
SokoSnap is a social commerce platform (React 19, TypeScript, Vite) with mobile apps (Capacitor). It features TikTok-style product feeds, M-Pesa escrow, and secure authentication via Firebase.

## Architecture & State
- **State Management:** Zustand with `persist` and `devtools` middleware. Stores are domain-scoped (`authStore`, `cartStore`).
  - **Pattern:** Use getters within store creators for computed values (e.g., `get itemCount() { ... }`).
- **Backend:** Firebase (Auth, Firestore, Storage) with modern persistence (`persistentLocalCache`).
- **Mobile:** Capacitor for Android/iOS.
  - **Auth:** Google Login native integration (via `@codetrix-studio/capacitor-google-auth`).
  - **Permissions:** Camera, Location, Storage configured in `AndroidManifest.xml` and `Info.plist`.

## Development Workflows
- **Package Manager:** `npm`
- **Dev Server:** `npm run dev` (Vite)
- **Mobile Build:**
  - Android: `npm run build:apk` (Syncs Capacitor + builds Debug APK)
  - iOS: `npx cap sync` then open Xcode.
- **Testing:** `npm test` (Vitest + JSDOM).
  - **Coverage:** `npm run test:coverage` (Threshold: 60%).

## Key Patterns & Conventions
- **Routing & Deployment:**
  - **Base Path:** Logic in `vite.config.ts` sets `base: '/'` for Vercel and `base: './'` for Capacitor/local builds. Handle paths accordingly.
- **Imports:** Use Path Aliases:
  - `@/` -> `src/`
  - `@components/` -> `src/components/`
  - `@store/` -> `src/store/`
- **Components:** Functional components with Zod validation for forms/inputs.
  - Locate in `src/components/features/{featureName}` or `src/components/common`.
- **Firebase:** Access instances via `src/lib/firebase.ts`. Do not re-initialize `initializeApp`.
- **Environment:**
  - Use `import.meta.env.VITE_*` for vars.
  - Mobile-specific configs in `capacitor.config.ts`.

## Code Style
- **Styling:** Tailwind CSS (v4) with `clsx` and `tailwind-merge`.
  - **Custom Colors:** Use `bg-mpesa` / `text-mpesa` for payment related UI (defined in `tailwind.config.js`).
- **Linting:** ESLint + Prettier (`npm run lint:fix`, `npm run format`).
- **Types:** Strict TypeScript. Define shared types in `src/types/index.ts`.
