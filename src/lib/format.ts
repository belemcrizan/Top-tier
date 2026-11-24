import english from 'n2words/languages/en';
import portuguese from 'n2words/languages/pt';

const brazilian: Record<string, string> = {
  dezasseis: 'dezesseis',
  dezassete: 'dezessete',
  dezanove: 'dezenove',
};

// The collection counts feminine nouns in Portuguese (eras and faixas).
export function numeroPorExtenso(count: number, lang: 'pt-BR' | 'en' = 'pt-BR'): string {
  if (lang === 'en') return english(count);
  return portuguese(count)
    .split(' ')
    .map((word) => brazilian[word] ?? word)
    .join(' ')
    .replace(/\bum$/, 'uma')
    .replace(/\bdois$/, 'duas');
}
