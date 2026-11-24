import { useRef, useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import { useRanking } from '../../app/RankingProvider';
import { useI18n } from '../../i18n';
import type { PersonalScores } from '../../lib/ranking';
import { downloadBlob } from './download';
import { MAX_JSON_BYTES, parseRankingFile, serializeRanking } from './encodeRanking';

export function ShareFiles(): ReactElement {
  const { t } = useI18n();
  const { scores, setScores, notify } = useRanking();
  const [pending, setPending] = useState<PersonalScores | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const latest = useRef(0);

  async function readFile(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    const task = ++latest.current;
    setPending(null);
    let imported: PersonalScores | null = null;
    if (file.size <= MAX_JSON_BYTES) {
      try {
        imported = parseRankingFile(await file.text());
      } catch {
        imported = null;
      }
    }
    if (task !== latest.current) return;
    if (imported === null) notify(t('shareInvalidFile'));
    else setPending(imported);
  }

  function apply(): void {
    if (pending === null) return;
    setScores(pending);
    setPending(null);
    notify(t('shareImported'));
  }

  return (
    <section className="share__panel">
      <h2>{t('shareFiles')}</h2>
      <p>{t('shareFilesHelp')}</p>
      <div className="share__actions">
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([serializeRanking(scores)], { type: 'application/json' });
            downloadBlob(blob, 'top-tier.json');
          }}
        >
          {t('shareExport')}
        </button>
        <button type="button" onClick={() => fileInput.current?.click()}>
          {t('shareImport')}
        </button>
        <input
          type="file"
          accept=".json,application/json"
          ref={fileInput}
          hidden
          aria-label={t('shareImport')}
          onChange={(event) => {
            void readFile(event);
          }}
        />
      </div>
      {pending !== null && (
        <div className="share__confirmation" role="group" aria-label={t('shareImportPreview')}>
          <p>{t('shareImportPreview')}</p>
          <div className="share__actions">
            <button type="button" className="share__primary" onClick={apply}>
              {t('shareImportApply')}
            </button>
            <button type="button" onClick={() => setPending(null)}>
              {t('shareCancel')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
