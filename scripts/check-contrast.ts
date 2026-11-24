import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const rules = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
type Palette = Map<string, string>;
type Theme = 'light' | 'dark';

function palette(theme: Theme, era: string): Palette {
  const colors = new Map<string, string>();
  for (const [, selector, declarations] of rules) {
    const matches = selector.split(',').some((item) => {
      const scope = item.trim().replaceAll('"', "'");
      if (scope === ':root') return true;
      const themeRule = `[data-theme='${theme}']`;
      const eraRule = `[data-era='${era}']`;
      return [themeRule, eraRule, themeRule + eraRule, `${themeRule} ${eraRule}`].includes(scope);
    });
    if (!matches) continue;
    for (const [, name, hex] of declarations.matchAll(/--([\w-]+):\s*#([\da-f]{6});/gi)) {
      colors.set(name, hex);
    }
  }
  return colors;
}

function fogOpacity(layer: string): number {
  const value = css.match(new RegExp(`--mist-${layer}-opacity:\\s*([0-9.]+);`))?.[1];
  const opacity = Number(value);
  if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new Error(`Invalid opacity for the ${layer} layer`);
  }
  return opacity;
}

function compositeMist(colors: Palette): string {
  const rgb = (token: string): number[] => {
    const hex = colors.get(token);
    if (!hex) throw new Error(`Missing color: ${token}`);
    return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  };
  // All layer centers coinciding gives a conservative bound, including a visible dust particle.
  const layers = [
    ['rose', 'hero-mist-rose'],
    ['rose', 'hero-mist-rose'],
    ['copper', 'hero-mist-copper'],
    ['dust', 'hero-muted'],
  ];
  let behind = rgb('hero-dark');
  for (const [layer, token] of layers) {
    const alpha = fogOpacity(layer);
    behind = rgb(token).map((channel, i) => channel * alpha + behind[i] * (1 - alpha));
  }
  return behind.map((n) => Math.ceil(n).toString(16).padStart(2, '0')).join('');
}

function luminance(hex: string): number {
  const channels = [0, 2, 4].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

let checks = 0;
const failures: string[] = [];
function verify(colors: Palette, a: string, b: string, min: number, label: string): void {
  const foreground = colors.get(a);
  const background = colors.get(b);
  if (!foreground || !background) throw new Error(`Missing tested token: ${a} or ${b}.`);
  const x = luminance(foreground);
  const y = luminance(background);
  const ratio = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  checks++;
  if (ratio < min) failures.push(`${label} ${a}/${b}: ${ratio.toFixed(2)} < ${min}`);
}

for (const theme of ['light', 'dark'] as const) {
  for (const era of ['evermore', 'folklore', 'reputation']) {
    const colors = palette(theme, era);
    const pair = (a: string, b: string, min = 4.5): void =>
      verify(colors, a, b, min, theme + '/' + era);
    for (const background of ['bg', 'surface', 'surface-2', 'era-veil']) {
      for (const foreground of ['ink', 'ink-muted', 'action', 'era-ink'])
        pair(foreground, background);
      for (const foreground of ['ui-line', 'focus']) pair(foreground, background, 3);
    }
    pair('on-action', 'action');
    pair('era-ink', 'era-soft');
    colors.set('hero-with-mist', compositeMist(colors));
    for (const background of ['hero-dark', 'hero-with-mist']) {
      pair('hero-ink', background);
      pair('hero-muted', background);
      pair('hero-btn', background, 3);
      pair('hero-btn-line', background, 3);
    }
    pair('hero-btn-ink', 'hero-btn');
    for (const tier of ['splus', 's', 'a', 'b', 'c']) {
      pair(`tier-${tier}-ink`, `tier-${tier}-surface`);
      pair(`tier-${tier}-ink`, 'era-veil', 3);
    }
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(`${checks} color pairs meet their WCAG AA contrast thresholds.`);
