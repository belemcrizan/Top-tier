import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { RankingProvider } from './app/RankingProvider';
import { I18nProvider } from './i18n';
import './styles/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <RankingProvider>
        <App />
      </RankingProvider>
    </I18nProvider>
  </StrictMode>,
);
