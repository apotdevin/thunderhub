import './styles/globals.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config, initConfig } from './config/thunderhubConfig';

async function bootstrap() {
  const configUrl = `${import.meta.env.BASE_URL}api/config`;
  try {
    const res = await fetch(configUrl);
    if (res.ok) {
      const data = await res.json();
      initConfig(data);
    }
  } catch {
    // Render with defaults if config fetch fails
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
