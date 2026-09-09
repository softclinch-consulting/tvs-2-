import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

function showErrorOverlay(msg: string) {
  try {
    let el = document.getElementById('app-error-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'app-error-overlay';
      Object.assign(el.style, {
        position: 'fixed',
        inset: '12px',
        zIndex: '2147483647',
        padding: '12px',
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 24px)'
      } as any);
      document.body.appendChild(el);
    }
    el.textContent = String(msg);
  } catch (e) {
    // ignore
  }
}

window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error', e.error || e.message || e);
  showErrorOverlay((e as ErrorEvent).error?.stack || (e as ErrorEvent).message || String(e));
});
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection', (e as PromiseRejectionEvent).reason);
  showErrorOverlay(((e as PromiseRejectionEvent).reason && ((e as PromiseRejectionEvent).reason.stack || (e as PromiseRejectionEvent).reason)) || String((e as PromiseRejectionEvent).reason));
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
