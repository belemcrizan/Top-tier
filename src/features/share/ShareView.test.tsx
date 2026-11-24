import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import axe from 'axe-core';
import type { ReactElement } from 'react';
import { RankingProvider, useRanking } from '../../app/RankingProvider';
import { I18nProvider } from '../../i18n';
import { encodeRanking, serializeRanking } from './encodeRanking';
import { ShareFiles } from './ShareFiles';
import ShareView from './ShareView';

function PersonalScore(): ReactElement {
  const { scores } = useRanking();
  return <span data-testid="personal-score">{scores['evermore-02'] ?? 'original'}</span>;
}

function wrapped(element: ReactElement): ReactElement {
  return (
    <I18nProvider>
      <RankingProvider>
        <main>
          {element}
          <PersonalScore />
        </main>
      </RankingProvider>
    </I18nProvider>
  );
}

function chooseFile(content: string): void {
  const file = new File([content], 'top-tier.json', { type: 'application/json' });
  // jsdom's File implementation lacks Blob.text(), available in the browsers we support.
  Object.defineProperty(file, 'text', { value: () => Promise.resolve(content) });
  fireEvent.change(screen.getByLabelText('Escolher arquivo JSON', { selector: 'input' }), {
    target: { files: [file] },
  });
}

describe('reading and importing a ranking', () => {
  it('opens a shared ranking and compares it without changing saved scores', async () => {
    const hash = encodeRanking({ 'evermore-02': 0 });
    const { container } = render(wrapped(<ShareView sharedHash={hash} />));
    expect(screen.getByRole('heading', { name: 'Ranking recebido' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Comparar com o meu' }));
    expect(screen.getByRole('heading', { name: 'Comparar rankings' })).toBeVisible();
    expect(screen.getByText('Recebido', { selector: 'h2' })).toBeVisible();
    expect(screen.getByTestId('personal-score')).toHaveTextContent('original');
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map(({ id }) => id)).toEqual([]);
    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao ranking recebido' }));
    expect(screen.getByRole('heading', { name: 'Ranking recebido' })).toBeVisible();
  });

  it('provides a route back when the link is damaged', () => {
    render(wrapped(<ShareView sharedHash="bad" />));
    expect(screen.getByRole('link', { name: 'Abrir meu ranking' })).toHaveAttribute(
      'href',
      '#meu-ranking',
    );
  });

  it('imports validated scores atomically after review and preserves them on a corrupt import', async () => {
    render(wrapped(<ShareFiles />));
    chooseFile(serializeRanking({ 'evermore-02': 42 }));
    const approve = await screen.findByRole('button', { name: 'Usar estas notas' });
    expect(screen.getByTestId('personal-score')).toHaveTextContent('original');
    fireEvent.click(approve);
    expect(screen.getByTestId('personal-score')).toHaveTextContent('42');
    chooseFile('{"version":2,"scores":{"evermore-02":900}}');
    await waitFor(() => expect(screen.getByText(/Não foi possível ler estas notas/)).toBeVisible());
    expect(screen.getByTestId('personal-score')).toHaveTextContent('42');
  });
});
