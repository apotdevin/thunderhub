import './styles/globals.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config, initConfig } from './config/thunderhubConfig';
import { stripTrailingSlashes } from './utils/path';

async function bootstrap() {
  const basePath = stripTrailingSlashes(import.meta.env.BASE_URL);
  initConfig({ basePath, apiUrl: `${basePath}/graphql` });

  const configUrl = `${basePath}/api/config`;
  try {
    const res = await fetch(configUrl);
    if (res.ok) {
      const data = await res.json();
      initConfig(data);
    } else {
      console.error(
        `Failed to fetch config from ${configUrl}: ${res.status} ${res.statusText}`
      );
    }
  } catch (error) {
    // Render with defaults if config fetch fails
    console.error(`Failed to fetch config from ${configUrl}:`, error);
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
