import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { covers } from '../../visual/media';
import { AlbumCover } from './AlbumCover';

it('serves only a thumbnail in the track list, even on a high-density display', () => {
  render(<AlbumCover album="evermore" size="thumb" alt="evermore" />);
  const image = screen.getByRole('img', { name: 'evermore' });
  expect(image).toHaveAttribute('src', covers.evermore.thumb);
  expect(image).not.toHaveAttribute('srcset');
  expect(image).toHaveAttribute('width', '112');
  expect(image).toHaveAttribute('height', '112');
});

it('removes failed WebP candidates for the era fallback, then tries the next album cover', () => {
  const view = render(<AlbumCover album="folklore" size="card" alt="Capa" />);
  const image = screen.getByRole('img', { name: 'Capa' });
  expect(image.getAttribute('srcset')).toContain(covers.folklore.card);
  fireEvent.error(image);
  expect(image).toHaveAttribute('src', covers.folklore.fallback);
  expect(image).not.toHaveAttribute('srcset');
  view.rerender(<AlbumCover album="reputation" size="detail" alt="Capa" />);
  expect(image).toHaveAttribute('src', covers.reputation.card);
  expect(image.getAttribute('srcset')).toContain(covers.reputation.large);
});
