import './styles/globals.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config, initConfig } from './config/thunderhubConfig';
import { appendBasePath } from './utils/basePath';

async function bootstrap() {
  const configUrl = appendBasePath('/api/config');

  try {
    const res = await fetch(configUrl);
    if (res.ok) {
      const data = await res.json();
      initConfig(data);
      console.info('[ThunderHub] Loaded client config', {
        configUrl,
        npmVersion: data.npmVersion,
        basePath: data.basePath,
        dbEnabled: data.dbEnabled,
      });
    } else {
      console.error('[ThunderHub] Failed to load client config', {
        configUrl,
        status: res.status,
        statusText: res.statusText,
      });
    }
  } catch (error) {
    console.error('[ThunderHub] Error loading client config', {
      configUrl,
      error,
    });
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename={config.basePath || '/'}>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

bootstrap();
