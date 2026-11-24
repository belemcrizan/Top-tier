import { createContext, useContext, useEffect, useMemo } from 'react';
import type { JSX, ReactNode } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { ptBR } from './pt-BR';
import { en } from './en';
import type { TranslationKey } from './pt-BR';

export type Language = 'pt-BR' | 'en';
interface LocaleContext {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}
const Locale = createContext<LocaleContext | null>(null);

function parseLanguage(raw: string | null): Language {
  return raw === 'en' ? 'en' : 'pt-BR';
}

export function I18nProvider({ children }: { children: ReactNode }): JSX.Element {
  const [lang, setLang] = usePersistentState('top-tier:language', parseLanguage, String);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const value = useMemo<LocaleContext>(
    () => ({ lang, setLang, t: (key) => (lang === 'en' ? en : ptBR)[key] }),
    [lang, setLang],
  );
  return <Locale.Provider value={value}>{children}</Locale.Provider>;
}

export function useI18n(): LocaleContext {
  const locale = useContext(Locale);
  if (!locale) throw new Error('I18nProvider is required');
  return locale;
}
