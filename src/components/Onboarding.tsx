import { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import type { JSX } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { useI18n } from '../i18n';

const titles = ['intro1', 'intro2', 'intro3'] as const;
const descriptions = ['introBody1', 'introBody2', 'introBody3'] as const;

export function Onboarding(): JSX.Element | null {
  const { t } = useI18n();
  const [dismissed, done] = usePersistentState('top-tier:guide:v2', (s) => s === 'true', String);
  const [step, setStep] = useState(0);
  if (dismissed) return null;
  return (
    <aside className="guide" aria-label={t('guide')}>
      <BookOpen size={23} aria-hidden="true" />
      <div className="guide__copy" aria-live="polite">
        <span>
          {t('guide')} · {step + 1}/{titles.length}
        </span>
        <strong>{t(titles[step])}</strong>
        <p>{t(descriptions[step])}</p>
      </div>
      <button
        className="guide__next"
        onClick={() => (step === 2 ? done(true) : setStep((current) => current + 1))}
      >
        {t(step === 2 ? 'finish' : 'next')}
      </button>
      <button onClick={() => done(true)} aria-label={t('dismiss')}>
        <X size={17} />
      </button>
    </aside>
  );
}
