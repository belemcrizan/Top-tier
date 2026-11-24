import { renderToString } from 'react-dom/server';
import { Application } from './app/Application';

export function renderCollection(): string {
  return renderToString(<Application />);
}
