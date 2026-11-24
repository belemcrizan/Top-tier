import { expect, test } from '@playwright/test';
import axe from 'axe-core';

declare global {
  interface Window {
    axe: typeof axe;
  }
}

for (const route of ['duelo', 'tiers']) {
  test('listening tools are accessible in the browser: ' + route, async ({ page }) => {
    await page.goto('./#' + route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.addScriptTag({ content: axe.source });
    const findings = await page.evaluate(async () => {
      const engine = window.axe;
      const { violations } = await engine.run('main', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      });
      return violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((node) => node.target) }));
    });
    expect(findings).toEqual([]);
  });
}
