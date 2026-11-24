import { Moon, Sun, Disc3 } from 'lucide-react';
import type { JSX, MouseEvent } from 'react';
import { routeHashes } from '../app/routes';
import type { Page } from '../app/routes';
import { useI18n } from '../i18n';

interface Props {
  current: Page | 'shared';
  navigate: (page: Page) => void;
  theme: 'dark' | 'light';
  toggle: () => void;
}

export function Masthead({ current, navigate, theme, toggle }: Props): JSX.Element {
  const { lang, setLang, t } = useI18n();
  function follow(event: MouseEvent<HTMLAnchorElement>, page: Page): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    event.preventDefault();
    navigate(page);
  }
  return (
    <header className="masthead">
      <div className="masthead__inner">
        <a className="masthead__brand" href="#colecao" onClick={(e) => follow(e, 'collection')}>
          <Disc3 aria-hidden="true" size={26} strokeWidth={1.5} /> Top Tier
        </a>
        <nav aria-label={t('nav')} className="masthead__nav">
          {(Object.keys(routeHashes) as Page[]).map((page) => (
            <a
              key={page}
              href={'#' + routeHashes[page]}
              aria-current={current === page ? 'page' : undefined}
              onClick={(e) => follow(e, page)}
            >
              {t(page)}
            </a>
          ))}
        </nav>
        <div className="masthead__tools">
          <select
            aria-label={t('locale')}
            value={lang}
            onChange={(e) => setLang(e.target.value === 'en' ? 'en' : 'pt-BR')}
          >
            <option value="pt-BR" lang="pt-BR">
              PT
            </option>
            <option value="en" lang="en">
              EN
            </option>
          </select>
          <button onClick={toggle} aria-label={t(theme === 'dark' ? 'lightTheme' : 'darkTheme')}>
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}
