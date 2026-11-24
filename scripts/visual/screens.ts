import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export const screens = {
  inicio: 'Abertura',
  colecao: 'Coleção de álbuns',
  album: 'Ranking do álbum',
  geral: 'Ranking geral com filtros',
  ficha: 'Detalhes da música',
  pessoal: 'Meu ranking',
  duelo: 'Duelo',
  tiers: 'Quadro de tiers',
  compartilhar: 'Compartilhamento',
  cartao: 'Cartão PNG',
};

async function position(element: Locator): Promise<void> {
  await element.evaluate((node) => {
    const header = document.querySelector('header');
    const inset =
      header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY - inset - 12,
      behavior: 'instant',
    });
  });
}

async function checkCover(image: Locator, album: string): Promise<void> {
  await expect(image).toHaveCount(1);
  await expect(image).toHaveAttribute('src', new RegExp(`${album}.*\\.webp$`));
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBeGreaterThan(0);
  const geometry = await image.evaluate((node: HTMLImageElement) => {
    const rect = node.getBoundingClientRect();
    return [Math.abs(rect.width - rect.height), Math.abs(node.naturalWidth - node.naturalHeight)];
  });
  expect(geometry[0]).toBeLessThanOrEqual(1);
  expect(geometry[1]).toBe(0);
}

export async function captureScreens(
  page: Page,
  url: string,
  directory: string,
  revised: boolean,
): Promise<void> {
  const errors = new Set<string>();
  page.on('pageerror', (error) => errors.add(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || /hydrat(?:ion|ing|ed).*error/i.test(message.text())) {
      errors.add(message.text());
    }
  });
  async function open(hash: string): Promise<void> {
    await page.goto(`${url}${hash}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-fonts', 'ready');
  }
  async function capture(key: keyof typeof screens): Promise<void> {
    // Only visible images need decoding; distant rows intentionally use native lazy loading.
    const missing = await page.locator('img').evaluateAll(async (nodes) => {
      const visible = nodes.filter((node): node is HTMLImageElement => {
        if (!(node instanceof HTMLImageElement)) return false;
        const { top, bottom, left, right, width, height } = node.getBoundingClientRect();
        return (
          width > 0 &&
          height > 0 &&
          bottom > 0 &&
          top < innerHeight &&
          right > 0 &&
          left < innerWidth
        );
      });
      await Promise.allSettled(visible.map((node) => node.decode()));
      return visible
        .filter((node) => !node.naturalWidth)
        .map((node) => node.currentSrc || node.src);
    });
    await page.screenshot({ path: join(directory, `${key}.png`), animations: 'disabled' });
    if (revised) {
      expect(missing, `Undecoded images on ${key}`).toEqual([]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `Page overflow on ${key}`).toBeLessThanOrEqual(1);
      expect([...errors], `Browser errors on ${key}`).toEqual([]);
    }
  }

  await open('');
  await capture('inicio');
  if (revised) {
    const hero = page.locator('img.room__art');
    const preload = page.locator('head link[rel="preload"][as="image"]');
    await expect(preload).toHaveCount(1);
    expect(await hero.getAttribute('srcset')).toBeTruthy();
    expect(await preload.getAttribute('imagesrcset')).toBe(await hero.getAttribute('srcset'));
    expect(await preload.getAttribute('imagesizes')).toBe(await hero.getAttribute('sizes'));
    expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(/\.webp$/);
    const ratio = await hero.evaluate(
      (image: HTMLImageElement) => image.naturalWidth / image.naturalHeight,
    );
    expect(ratio).toBeCloseTo(16 / 9, 2);
  }
  await position(page.locator('#era-title'));
  await capture('colecao');
  if (revised) {
    for (const album of ['evermore', 'folklore', 'reputation']) {
      await checkCover(page.locator(`.era-card[data-era="${album}"] img`), album);
    }
  }
  await position(page.locator('section.ranking'));
  await capture('album');
  if (revised) await checkCover(page.locator('[data-song-id]').first().locator('img'), 'evermore');

  await open('#ranking');
  await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  await page.getByRole('combobox', { name: 'Álbum', exact: true }).selectOption('folklore');
  await page.getByRole('combobox', { name: 'Tier', exact: true }).selectOption('S+');
  await page.getByRole('combobox', { name: 'Ordenar por' }).selectOption('score');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await capture('geral');
  const row = page.locator('[data-song-id]').first();
  const id = await row.getAttribute('data-song-id');
  expect(id).toMatch(/^folklore-/);
  if (revised) await checkCover(row.locator('img'), 'folklore');
  await row.getByRole('button', { name: /^Detalhes de / }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  if (revised) await checkCover(dialog.locator('img'), 'folklore');
  await capture('ficha');
  await dialog.press('Escape');
  await expect(dialog).not.toBeVisible();
  await open('#meu-ranking');
  await capture('pessoal');
  await open('#duelo');
  await capture('duelo');
  if (revised)
    await expect(page.getByRole('button', { name: /^Escolher / }).locator('img')).toHaveCount(2);
  await open('#tiers');
  await capture('tiers');
  if (revised) expect(await page.locator('main img').count()).toBeGreaterThan(2);
  await open('#compartilhar');
  const card = page.locator('.share__preview img');
  await expect(card).toBeAttached();
  await capture('compartilhar');
  // Keep the very same PNG used for preview and downloads, at its original (4:5) resolution.
  const bytes = await card.evaluate(async (image: HTMLImageElement) => {
    await image.decode();
    const response = await fetch(image.src);
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      data: await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(reader.error);
        void response.blob().then((blob) => reader.readAsDataURL(blob), reject);
      }),
    };
  });
  expect([bytes.width, bytes.height]).toEqual([1080, 1350]);
  await writeFile(join(directory, 'cartao.png'), Buffer.from(bytes.data, 'base64'));
  if (revised) expect([...errors]).toEqual([]);
}
