import type { JSX } from 'react';
import { sources } from '../data/rankings';
import { TIER_SCALE } from '../data/tiers';
import { useI18n } from '../i18n';

const photoSource =
  'https://www.vogue.mx/estilo-de-vida/articulo/' + 'taylor-swift-y-su-nuevo-disco-folklore';

export function Colophon(): JSX.Element {
  const { t } = useI18n();
  return (
    <footer className="colophon">
      <details>
        <summary>{t('method')}</summary>
        <p>{t('editorialMethod')}</p>
        <h2>{t('tiers')}</h2>
        <ul>
          {TIER_SCALE.map(({ tier, min, max, label }) => (
            <li key={tier}>
              {tier} · {label} · {min}–{max}
            </li>
          ))}
        </ul>
        <h2>{t('credits')}</h2>
        <ul>
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url}>{source.titulo}</a>
            </li>
          ))}
        </ul>
        <p className="colophon__image-credit">
          {t('photoCredit')} Beth Garrabrant · <a href={photoSource}>Vogue México</a>
        </p>
      </details>
      <div className="colophon__credit">
        <span>Crizan Belem Ribeiro · {t('independent')}</span>
        <a href="https://github.com/belemcrizan/Top-tier">GitHub</a>
      </div>
    </footer>
  );
}
