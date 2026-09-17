import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Safely register Service Worker for offline PWA functionality
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onRegisterError(error) {
        // Benign in sandboxed dev preview iframes
        if (process.env.NODE_ENV === 'development') {
          console.debug('PWA ServiceWorker note (preview environment):', error);
        }
      },
    });
  } catch (err) {
    // Non-blocking in sandboxed environments
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
