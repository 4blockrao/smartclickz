import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// After a new deploy, chunk filenames (content-hashed) change. A browser holding a
// stale index.html will request an old chunk that no longer exists → the dynamic
// import fails ("Importing a module script failed"). Recover by reloading once to
// fetch the fresh index.html + chunk names. The 10s time-guard prevents a reload
// loop if a chunk is genuinely missing.
window.addEventListener('vite:preloadError', () => {
  const KEY = 'vite-preload-reload-at';
  const last = Number(sessionStorage.getItem(KEY) || 0);
  if (Date.now() - last > 10000) {
    sessionStorage.setItem(KEY, String(Date.now()));
    window.location.reload();
  }
});

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);