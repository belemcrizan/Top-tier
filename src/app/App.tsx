import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import { Colophon } from '../components/Colophon';
import { Masthead } from '../components/Masthead';
import { Onboarding } from '../components/Onboarding';
import { albums, songs } from '../data/rankings';
import type { AlbumId } from '../data/rankings';
import Collection from '../features/collection/Collection';
import RankingView from '../features/ranking/RankingView';
import { useHashRoute } from '../hooks/useHashRoute';
import { useI18n } from '../i18n';
import { useRanking } from './RankingProvider';
import { useTheme } from '../hooks/useTheme';
import '../styles/components/shell.css';
import '../styles/components/record-shelf.css';

const DuelArena = lazy(() => import('../features/duel/DuelArena'));
const TierBoard = lazy(() => import('../features/tierboard/TierBoard'));
const ShareView = lazy(() => import('../features/share/ShareView'));
const CompareView = lazy(() => import('../features/share/CompareView'));

export default function App(): JSX.Element {
  const { route, navigate } = useHashRoute();
  const { t } = useI18n();
  const { theme, toggle } = useTheme();
  const { personalSongs } = useRanking();
  const [albumId, setAlbumId] = useState<AlbumId>(albums[0].id);
  const main = useRef<HTMLElement>(null);
  const previous = useRef(route.page);
  useEffect(() => {
    if (previous.current !== route.page) {
      previous.current = route.page;
      main.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [route.page]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.era = albumId;
  }, [theme, albumId]);
  let page: JSX.Element;
  switch (route.page) {
    case 'collection':
      page = (
        <>
          <Collection albumId={albumId} onSelect={setAlbumId} personalSongs={personalSongs} />
          <Onboarding />
          <RankingView key={albumId} mode="album" albumId={albumId} entries={songs} />
        </>
      );
      break;
    case 'overall':
    case 'personal':
      page = (
        <>
          <div className="page-heading">
            <h1>{t(route.page)}</h1>
            <p>{t(route.page === 'overall' ? 'overallDescription' : 'personalDescription')}</p>
          </div>
          <RankingView
            key={route.page}
            mode={route.page}
            entries={route.page === 'overall' ? songs : personalSongs}
          />
        </>
      );
      break;
    case 'duel':
      page = <DuelArena />;
      break;
    case 'board':
      page = <TierBoard />;
      break;
    case 'compare':
      page = <CompareView />;
      break;
    case 'shared':
      page = <ShareView sharedHash={route.payload ?? ''} />;
      break;
    case 'share':
      page = <ShareView />;
      break;
  }
  return (
    <div className="app" data-theme={theme} data-era={albumId}>
      <a
        className="skip-link"
        href="#content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        {t('skip')}
      </a>
      <Masthead current={route.page} navigate={navigate} theme={theme} toggle={toggle} />
      <main id="content" ref={main} tabIndex={-1}>
        <Suspense
          fallback={
            <p className="page-heading" role="status">
              {t('loading')}
            </p>
          }
        >
          {page}
        </Suspense>
      </main>
      <Colophon />
    </div>
  );
}
