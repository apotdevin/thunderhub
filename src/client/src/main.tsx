import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config } from './config/thunderhubConfig';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={config.basePath || '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
