# Progressive Web App (PWA) Implementation

The Push-Up Challenge app is now a fully functional PWA! Users can install it on their devices for a native-like experience.

## 📱 Features

- **Installable**: Users can add the app to their home screen on Android, iOS, and Desktop.
- **Offline Support**: Basic offline capabilities with a dedicated fallback page (`/offline`).
- **Caching**: Smart caching for static assets (images, fonts) and API responses.
- **Custom Install Prompts**:
  - **Android/Desktop**: Custom bottom sheet prompt triggered by `beforeinstallprompt`.
  - **iOS**: Custom banner with instructions (Share -> Add to Home Screen).
- **Theme Integration**: Matches the app's dark/light mode.

## 🛠️ Components

- **`public/manifest.json`**: App metadata, icons, and theme colors.
- **`next.config.ts`**: PWA configuration using `next-pwa`.
- **`components/pwa-install-prompt.tsx`**: Handles the install logic for Chrome/Android.
- **`components/ios-install-prompt.tsx`**: Detects iOS Safari and shows specific instructions.
- **`components/pwa-provider.tsx`**: Manages the display of install prompts.
- **`app/offline/page.tsx`**: Fallback page shown when the user is offline.

## 🧪 How to Test

### 1. Build the App
PWAs work best in production builds.
```bash
pnpm build
pnpm start
```

### 2. Desktop (Chrome/Edge)
1. Open the app in your browser.
2. You should see an install icon in the address bar.
3. Resize the window to mobile width (< 768px) to see the custom install sheet (if not already installed).

### 3. Mobile (Android)
1. Open the app in Chrome.
2. A custom bottom sheet should appear asking to install.
3. Tapping "Install" should trigger the native install prompt.

### 4. Mobile (iOS)
1. Open the app in Safari.
2. A banner should appear at the bottom with instructions.
3. Follow instructions: Tap Share -> Add to Home Screen.

### 5. Offline Mode
1. Open DevTools -> Network tab.
2. Set throttling to "Offline".
3. Refresh the page.
4. You should see the custom Offline page instead of the browser's dinosaur.

## 🔧 Configuration

The PWA config is in `next.config.ts`. You can adjust caching strategies there:
- **`supabase-cache`**: Caches API responses for 24 hours (NetworkFirst).
- **`images-cache`**: Caches images for 30 days (CacheFirst).
- **`google-fonts`**: Caches fonts for 1 year (CacheFirst).

## ⚠️ Notes
- Service workers are disabled in development mode by default.
- The install prompt respects the user's choice and won't spam them if they dismiss it (saved in `localStorage`).
