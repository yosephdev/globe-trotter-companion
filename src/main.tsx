import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Apply dark mode class based on user preference or saved setting
const savedTheme = localStorage.getItem('theme') || 'system';
if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}

// Error boundary for production
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // You could send this to an error tracking service
  });
}

// Mount the app
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}