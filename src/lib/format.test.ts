import { expect, it } from 'vitest';
import { numeroPorExtenso } from './format';

it('renders changing catalog counts in Brazilian Portuguese and English', () => {
  expect(numeroPorExtenso(2)).toBe('duas');
  expect(numeroPorExtenso(17)).toBe('dezessete');
  expect(numeroPorExtenso(49)).toBe('quarenta e nove');
  expect(numeroPorExtenso(51, 'en')).toBe('fifty-one');
});
