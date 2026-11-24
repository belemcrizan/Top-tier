import { StrictMode } from 'react';
import type { JSX } from 'react';
import App from './App';
import { RankingProvider } from './RankingProvider';
import { I18nProvider } from '../i18n';

export function Application(): JSX.Element {
  return (
    <StrictMode>
      <I18nProvider>
        <RankingProvider>
          <App />
        </RankingProvider>
      </I18nProvider>
    </StrictMode>
  );
}
